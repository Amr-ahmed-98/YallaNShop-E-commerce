'use client';
import Link from 'next/link';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import toast, {Toaster} from 'react-hot-toast';
import { useState } from 'react';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^(01)[0-2,5]{1}[0-9]{8}$/, 'Invalid Egyptian phone number')
    .required('Phone number is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
    .required('Message is required'),
});
const initialValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const dbRef = collection(db,'contactData');

const Contact = () => {
  const [key, setKey] = useState(0);
  const Formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async(values) => {
      try{
        await addDoc(dbRef,{name: values.name, email: values.email, phone: values.phone, message: values.message})
        toast.success('message sent successfully 👍')
        Formik.resetForm();
        setKey(key=>key+1);
      }catch{
        toast.error(`Sorry Try Again 😢`)
        Formik.resetForm();
      }
    },
  });

  return (
    <div className='container mx-auto px-4'>
      <div><Toaster/></div>
    <div className='my-4'>
      <span className='text-gray-500'>
        <Link href={'/'}>Home</Link> / Contact
      </span>
    </div>
    <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
      <div className='md:col-span-4 lg:col-span-3 shadow-md py-5'>
        <div className='flex items-center gap-3 ps-4 mb-3'>
          <span className='bg-[#e50914] text-white p-1 rounded-full'>
            <CallIcon />
          </span>
          <h3 className='text-lg font-semibold'>Call To Us</h3>
        </div>
        <div className='ps-4 mb-3'>
          <p className='mb-3'>We are available 24/7, 7 days a week.</p>
          <p>Phone: +8801611112222</p>
        </div>
        <hr className='border-gray-300 my-4' />
        <div className='flex items-center gap-3 ps-4 mb-3'>
          <span className='bg-[#e50914] text-white p-1 rounded-full'>
            <EmailIcon />
          </span>
          <h3 className='text-lg font-semibold'>Write To US</h3>
        </div>
        <div className='ps-4 mb-3'>
          <p className='mb-3'>
            Fill out our form and we will contact you within 24 hours.
          </p>
          <p>
            Emails: <a href='mailto:customer@exclusive.com' className='text-blue-600 hover:underline'>customer@exclusive.com</a>
          </p>
        </div>
      </div>
      <div className='md:col-span-8 lg:col-span-9 shadow-md py-5'>
        <form key={key} onSubmit={Formik.handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <input
                type='text'
                name='name'
                id='name'
                className='w-full p-3 border border-gray-300 rounded bg-gray-50'
                placeholder='Your Name'
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.errors.name && Formik.touched.name && (
                <div className='text-red-500 text-sm mt-1'>{Formik.errors.name}</div>
              )}
            </div>
            <div>
              <input
                type='email'
                name='email'
                id='email'
                className='w-full p-3 border border-gray-300 rounded bg-gray-50'
                placeholder='Your Email'
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.errors.email && Formik.touched.email && (
                <div className='text-red-500 text-sm mt-1'>{Formik.errors.email}</div>
              )}
            </div>
            <div>
              <input
                type='tel'
                name='phone'
                id='phone'
                className='w-full p-3 border border-gray-300 rounded bg-gray-50'
                placeholder='Your Phone Number'
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
              />
              {Formik.errors.phone && Formik.touched.phone && (
                <div className='text-red-500 text-sm mt-1'>{Formik.errors.phone}</div>
              )}
            </div>
          </div>
          <div>
            <textarea 
              className='w-full p-3 border border-gray-300 rounded bg-gray-50' 
              placeholder='Your Message' 
              onChange={Formik.handleChange} 
              onBlur={Formik.handleBlur} 
              name='message' 
              id='message'
              rows={4}
            ></textarea>
            {Formik.errors.message && Formik.touched.message && (
              <div className='text-red-500 text-sm mt-1'>{Formik.errors.message}</div>
            )}
          </div>
          <div className='flex justify-end'>
            <button className='bg-[#e50914] text-white px-6 py-3 rounded hover:bg-[#c50812] transition duration-300 ease-in-out' type='submit'>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Contact;
