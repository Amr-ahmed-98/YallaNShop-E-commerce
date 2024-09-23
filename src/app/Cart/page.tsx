'use client';
import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  loadUserCart,
  addToCart,
  clearCart,
} from '@/store/cartSlice';


const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    cartItems = [],
    total,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.logicReducer);
  
  const currentEmail = localStorage.getItem('email') ;

  useEffect(() => {
    if (currentEmail) {
      dispatch(loadUserCart());
    }
  }, [dispatch, currentEmail]);

  const handleQuantityChange = useCallback((itemId: number, newQuantity: number) => {
    dispatch(addToCart({ productId: itemId, quantity: newQuantity }));
  }, [dispatch]);


  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='w-full max-w-4xl mx-auto px-4 py-8 text-center'>
        Loading...
      </div>
    );
  }



  if (error) {
    return (
      <div className='w-full max-w-4xl mx-auto px-4 py-8 text-center'>
        Error: {error}
      </div>
    );
  }

  if (!currentEmail && !token) {
    return (
      <div className='w-full max-w-4xl mx-auto px-4 py-8 text-center'>
        <h2 className='text-2xl font-bold mb-4'>
          Please Sign In to View Your Cart
        </h2>
        <Link href='/SignIn'>
          <button className='bg-[#DB4444] hover:bg-[#db4444ac] text-white font-bold py-2 px-4 rounded'>
            Go to Sign In
          </button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className='w-full max-w-4xl mx-auto px-4 py-8 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Your Cart is Empty</h2>
        <Link href='/'>
          <button className='bg-[#DB4444] hover:bg-[#db4444ac] text-white font-bold py-2 px-4 rounded'>
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl mx-auto px-4'>
      <div className='container'>
        <div className='my-4'>
          <span className='text-gray-500'>
            <Link href={'/'}>Home</Link> / Cart
          </span>
        </div>
        <div className='hidden sm:flex justify-between shadow-md p-3 items-center rounded-md mb-4 bg-gray-50'>
          <span className='w-2/5 font-semibold'>Product</span>
          <span className='w-1/5 font-semibold text-center'>Price</span>
          <span className='w-1/5 font-semibold text-center'>Quantity</span>
          <span className='w-1/5 font-semibold text-right'>SubTotal</span>
        </div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className='flex flex-col sm:flex-row justify-between shadow-md p-3 items-start sm:items-center rounded-md mb-4'
          >
            <div className='flex items-center w-full sm:w-2/5 mb-3 sm:mb-0'>
              <img
                src={item.image}
                className='w-20 h-20 object-cover rounded-md mr-4'
                alt={item.title}
              />
              <p className='font-medium'>{item.title}</p>
            </div>
            <div className='flex justify-between w-full sm:w-3/5'>
              <span className='w-1/4 sm:w-1/3 text-left sm:text-center flex items-center justify-center'>
                <span className='sm:hidden font-semibold'>Price: </span>$
                {item.price.toFixed(2)}
              </span>
              <span className='w-2/4 sm:w-1/3 flex justify-center items-center'>
                <span className='sm:hidden font-semibold mr-2'>Quantity: </span>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
      <input
        type='number'
        value={item.quantity}
        onChange={(e) => handleQuantityChange(item.id, Math.max(0, parseInt(e.target.value, 10) || 0))}
        className="w-12 text-center border-none focus:outline-none"
        aria-label='Quantity'
        min="0"
      />
      <div className="flex flex-col">
        <button
          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
          className="p-1 hover:bg-gray-100"
          aria-label='Increase quantity'
        >
          <KeyboardArrowUpIcon />
        </button>
        <button
          onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))}
          className="p-1 hover:bg-gray-100"
          aria-label='Decrease quantity'
        >
          <KeyboardArrowDownIcon />
        </button>
      </div>
    </div>
              </span>
              <span className='w-1/4 flex items-center justify-center sm:w-1/3 text-right'>
                <span className='sm:hidden font-semibold'>Subtotal: </span>$
                {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
        <div className='my-5 w-full flex justify-between items-center'>
          <Link href={'/'}>
            <button className='border border-black p-5 hover:bg-[#DB4444] hover:text-white hover:border-none'>
              Return To Shop
            </button>
          </Link>
          <div className='text-xl font-bold'>Total: ${total.toFixed(2)}</div>
          <button
            className='border border-black p-5 hover:bg-[#DB4444] hover:text-white hover:border-none'
            onClick={() => handleClearCart()}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
