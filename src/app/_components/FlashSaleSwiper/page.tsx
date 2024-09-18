'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { productState } from '@/interfaces/productsState';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from '@/app/styles/index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getId, initializeToken } from '@/store/logicSlice';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store/store';
import OffCanvasSignUp from '../OffCanvas/page';
import { addToCart, loadUserCart } from '@/store/cartSlice';
import { addToFavorites, loadUserFavorites } from '@/store/favoriteSlice';

const FlashSaleSwiper: React.FC = () => {
  const swiperRef = useRef<SwiperRef>(null);
  const router = useRouter();
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

  const { token } = useSelector((state: RootState) => state.logicReducer);
  const { favoriteItems = [] } = useSelector((state: RootState) => state.favorite);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(initializeToken());
    if (token) {
      dispatch(loadUserCart());
      dispatch(loadUserFavorites());
    }
  }, [dispatch, token]);

  const { data, isLoading } = useQuery<productState[]>({
    queryKey: ['flashSale'],
    queryFn: async () => {
      const response = await axios.get<productState[]>('https://fakestoreapi.com/products');
      return response.data;
    },
  });

  const handleMouseEnter = () => {
    if (swiperRef.current && swiperRef.current.swiper.autoplay.running) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current && !swiperRef.current.swiper.autoplay.running) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  const handleAddingProduct = async (productId: number) => {
    console.log('Adding product:', productId);
    if (!token) {
      setIsOffCanvasOpen(true); 
    } else {
      try {
        console.log('Dispatching addToCart');
        const result = await dispatch(addToCart({ productId, quantity: 1 }));
        console.log('addToCart result:', result);
        dispatch(loadUserCart());
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleAddToFavorites = async (productId: number) => {
    if (!token) {
      setIsOffCanvasOpen(true);
    } else {
      try {
        console.log('Dispatching addToFavorites');
        const result = await dispatch(addToFavorites(productId));
        console.log('addToFavorites result:', result);
        dispatch(loadUserFavorites());
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  const isProductFavorite = (productId: number) => {
    return Array.isArray(favoriteItems) && favoriteItems.some(item => item.id === productId);
  };
  
  return (
    <>
      <Grid container spacing={2}>
        <Swiper
          ref={swiperRef}
          spaceBetween={15}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {!isLoading &&
            data?.map((product) => (
              <SwiperSlide 
                key={product.id} 
                className="cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col h-full border card-item border-gray-200 rounded-lg overflow-hidden" >
                  <div className="relative w-full pt-[100%] bg-[#F5F5F5] relative overflow-hidden group">
                    <div className='absolute -bottom-full z-50 left-0 right-0 bg-black text-white h-[40px] font-bold flex justify-center items-center group-hover:bottom-0 cursor-pointer'data-id={product.id} onClick={()=>handleAddingProduct(product.id)}>
                      <button data-id={product.id}>Add To Cart</button>
                    </div>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="absolute top-0 left-0 w-full h-full object-contain p-4"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button 
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => handleAddToFavorites(product.id)}
                      >
                        {isProductFavorite(product.id) ? (
                          <FavoriteIcon className="text-red-500" />
                        ) : (
                          <FavoriteBorderIcon className="text-gray-600" />
                        )}
                      </button>
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" onClick={() => {
                        dispatch(getId(`${product.id}`))
                        router.push(`/ProductDetails`)
                      }}>
                        <VisibilityIcon className="text-gray-600" />
                      </button>
                    </div>
                    <div className={`${styles.discount} absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded`}>
                      <span>50%</span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2">{product.title}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{product.rating.rate} ★</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </Grid>
      <OffCanvasSignUp isOpen={isOffCanvasOpen} onClose={() => setIsOffCanvasOpen(false)} />
    </>
  );
};

export default FlashSaleSwiper;