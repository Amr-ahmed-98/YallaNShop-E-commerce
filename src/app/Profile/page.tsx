'use client';
import { useEffect, useState } from 'react';
import Person2Icon from '@mui/icons-material/Person2';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const router = useRouter();
  const token = useSelector((state: any) => state.logicReducer.token);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('email');
      setUserData({ name: name || '', email: email || '' });
    }
  }, []);

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  if (!token) {
    return null; // or a loading spinner
  }

  return (
    <div className="container">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-center text-3xl font-bold mb-8">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className='flex justify-between items-center mb-2'>
                <p className="font-bold text-lg">Name</p>
                <Person2Icon className="text-gray-500" />
              </div>
              <p className='text-gray-600'>{userData.name}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className='flex justify-between items-center mb-2'>
                <p className="font-bold text-lg">Email</p>
                <AlternateEmailIcon className="text-gray-500" />
              </div>
              <p className='text-gray-600'>{userData.email}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className='flex justify-between items-center mb-2'>
                <p className="font-bold text-lg">Language</p>
                <LanguageIcon className="text-gray-500" />
              </div>
              <p className='text-gray-600'>English</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;