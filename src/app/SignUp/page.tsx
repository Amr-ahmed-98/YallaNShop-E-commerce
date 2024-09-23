'use client';
import Link from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { getTokenData, googleSignIn } from '@/store/logicSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const SignUp = () => {
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          values.email,
          values.password
        );
        if (userCredential && userCredential.user) {
          const token: string | undefined =
            await userCredential?.user.getIdToken();
          await dispatch(getTokenData(token));
          router.push('/');
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
  });

  const handleGoogleSignUp = async () => {
    try {
      const resultAction = await dispatch(googleSignIn());
      if (googleSignIn.fulfilled.match(resultAction)) {
        const { token } = resultAction.payload;
        await dispatch(getTokenData(token));
        router.push('/');
      } else if (googleSignIn.rejected.match(resultAction)) {
        console.error('Google Sign In failed:', resultAction.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <div className='container flex justify-center'>
      <div className='shadow-lg p-5 w-full md:w-[800px] flex justify-center flex-col items-center'>
        <h2 className='text-center text-2xl font-bold'>Create An Account</h2>
        <p>
          Already have an account?{' '}
          <Link href={'/SignIn'} className='underline'>
            Log in
          </Link>
        </p>
        <button
          className='bg-black text-white w-full p-2 flex justify-center items-center gap-2 rounded-full my-3'
          onClick={handleGoogleSignUp}
        >
          <GoogleIcon /> Continue with Google
        </button>
        <div className='font-bold'>
          {' '}
          ----------------- OR -----------------{' '}
        </div>
        <div className='my-4 w-full'>
          <form onSubmit={formik.handleSubmit}>
            <div className='my-3'>
              <label htmlFor='name' className='block'>
                Your Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                className='border w-full p-2 rounded-md'
                onChange={formik.handleChange}
                onFocus={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className='text-red-500'>{formik.errors.name}</div>
              ) : null}
            </div>
            <div className='my-3'>
              <label htmlFor='email' className='block'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='border w-full p-2 rounded-md'
                onChange={formik.handleChange}
                onFocus={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='text-red-500'>{formik.errors.email}</div>
              ) : null}
            </div>
            <div className='my-3'>
              <label htmlFor='password' className='block'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                className='border w-full p-2 rounded-md'
                onChange={formik.handleChange}
                onFocus={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className='text-red-500'>{formik.errors.password}</div>
              ) : null}
            </div>
            <div>
              <button
                type='submit'
                className='border-2 border-black w-full p-2 rounded-md hover:bg-black hover:text-white'
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
