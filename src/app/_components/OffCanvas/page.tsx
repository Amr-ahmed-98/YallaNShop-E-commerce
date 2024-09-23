import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from "@mui/icons-material/Google";
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { getTokenData, googleSignIn } from '@/store/logicSlice';


const OffCanvasSignUp = ({ isOpen, onClose }: any) => {
  const [activeTab, setActiveTab] = useState('signup');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      const resultAction = await dispatch(googleSignIn());
      if (googleSignIn.fulfilled.match(resultAction)) {
        const token = resultAction.payload;
        await dispatch(getTokenData(token.token));
        onClose();
      } else if (googleSignIn.rejected.match(resultAction)) {
        console.error("Google Sign In failed:", resultAction.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };


  const handleLogin = async(e: any) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(formData.email, formData.password);
      if (userCredential && userCredential.user) {
        const token: string | undefined = await userCredential?.user.getIdToken();
        await dispatch(getTokenData(token));
        onClose();
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignup = async(e: any) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(formData.email, formData.password);
      if (userCredential && userCredential.user) {
        const token: string | undefined = await userCredential?.user.getIdToken();
        await dispatch(getTokenData(token));
        onClose(); 
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl z-50 overflow-hidden">
        <div className="relative p-8">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
          
          <div className="flex mb-6">
            <button 
              className={`flex-1 py-2 text-lg font-semibold ${activeTab === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign up
            </button>
            <button 
              className={`flex-1 py-2 text-lg font-semibold ${activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('login')}
            >
              Log in
            </button>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">{activeTab === 'signup' ? 'Create an account' : 'Welcome back'}</h2>
          
          <button className="bg-black text-white w-full p-3 flex justify-center items-center gap-2 rounded-lg mb-6" onClick={handleGoogleSignIn}>
            <GoogleIcon /> Continue with Google
          </button>
          
          <div className="text-center mb-6 text-gray-500">OR</div>
          
          {activeTab === 'signup' ? (
            <form className="space-y-4" onSubmit={handleSignup}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Sign up
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Log in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffCanvasSignUp;