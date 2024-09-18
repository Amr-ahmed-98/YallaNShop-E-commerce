'use client'
import { Box, Grid, Typography } from "@mui/material";
import styles from '@/app/styles/index.module.scss';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { productState } from "@/interfaces/productsState";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getId, initializeToken } from "@/store/logicSlice";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@/store/store";
import OffCanvasSignUp from "../OffCanvas/page";
import { addToCart, loadUserCart } from "@/store/cartSlice";
import { addToFavorites, loadUserFavorites } from "@/store/favoriteSlice";
import FavoriteIcon from '@mui/icons-material/Favorite';

const MainProducts = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

  const { token } = useSelector((state: any) => state.logicReducer);
  const { favoriteItems = [] } = useSelector((state: RootState) => state.favorite);
  
  useEffect(() => {
    dispatch(initializeToken());
    if (token) {
      dispatch(loadUserCart());
      dispatch(loadUserFavorites());
    }
  }, [dispatch, token]);


  const { data, isLoading } = useQuery<productState[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await axios.get<productState[]>('https://fakestoreapi.com/products?limit=8');
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

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
    <Box component="section" className="container mx-auto px-4 py-8">
      <div className={`${styles.title}`}>{`Our Products`}</div>
      <Typography
        variant="h3"
        gutterBottom
        className="font-bold text-2xl sm:text-3xl md:text-4xl mb-6 text-center sm:text-left"
      >
       Explore Our Products
      </Typography>
      <Grid container spacing={2}>
        {!isLoading && data?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative w-full pt-[100%] bg-[#F5F5F5] overflow-hidden group">
                <div className='absolute cursor-pointer -bottom-full z-50 left-0 right-0 bg-black text-white h-[40px] font-bold flex justify-center items-center group-hover:bottom-0 transition-all duration-300'onClick={()=>handleAddingProduct(product.id)}>
                  <button >Add To Cart</button>
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
                  <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" onClick={()=>{
                      dispatch(getId(`${product.id}`))
                      router.push(`/ProductDetails`)
                      }}>
                      <VisibilityIcon className="text-gray-600"  />
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
          </Grid>
        ))}
      </Grid>
      <OffCanvasSignUp isOpen={isOffCanvasOpen} onClose={() => setIsOffCanvasOpen(false)} />
      {!isLoading && <div className="text-center py-8  w-full flex justify-center">
        <Link href={'/AllProducts'} className="bg-[#DB4444] w-[200px] h-11 text-white flex items-center justify-center rounded-md">View All Products</Link>
        </div>}
    </Box>
  );
};

export default MainProducts;