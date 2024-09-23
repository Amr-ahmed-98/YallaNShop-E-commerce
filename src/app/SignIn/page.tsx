'use client';
import React, { useEffect } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenData, googleSignIn, setUser } from '@/store/logicSlice';
import { AppDispatch } from '@/store/store';
import { onAuthStateChanged, User } from 'firebase/auth';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const SignIn = () => {
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state.logicReducer);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
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
        console.error('Error signing in:', error);
      }
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [user, dispatch]);

  const handleGoogleSignIn = async () => {
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
        <h2 className='text-center text-2xl font-bold'>Log In</h2>
        <button
          className='bg-black text-white w-full p-2 flex justify-center items-center gap-2 rounded-full my-3'
          onClick={handleGoogleSignIn}
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
              <label htmlFor='email' className='block'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='border w-full p-2 rounded-md'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
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
                onBlur={formik.handleBlur}
                value={formik.values.password}
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
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
