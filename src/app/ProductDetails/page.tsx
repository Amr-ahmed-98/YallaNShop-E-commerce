'use client';
import { productState } from "@/interfaces/productsState";
import { AppDispatch, RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useEffect, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { initializeToken } from "@/store/logicSlice";
import { addToCart, loadUserCart } from "@/store/cartSlice";
import OffCanvasSignUp from "../_components/OffCanvas/page";
import { addToFavorites, loadUserFavorites } from "@/store/favoriteSlice";
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductDetails = () => {
    const productId = useSelector((state:RootState) => state.logicReducer.id)
    const [count,setCount] = useState(1)
    const [isInStock,setIsInStock] = useState(false)
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

    const {data,isLoading} = useQuery<productState>({
        queryKey:['productDetails'],
        queryFn:async ()=>{
            const response = await axios.get<productState>(`https://fakestoreapi.com/products/${productId}`)
            return response.data;
        }
    })

    useEffect(()=>{
      setIsInStock(Math.random() < 0.5)
    },[])

    const increase = () => {
      if(count < 10) setCount(count + 1)
    }
    const decrease = () => {
      if (count > 1) setCount(count - 1)
    }

    const handleAddingProduct = async (productId: number) => {
      console.log('Adding product:', productId);
      if (!token) {
        setIsOffCanvasOpen(true); 
      } else {
        try {
          console.log('Dispatching addToCart');
          const result = await dispatch(addToCart({ productId, quantity:count }));
          console.log('addToCart result:', result);
          await dispatch(loadUserCart());
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
        {!isLoading && <>
       <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="bg-gray-50 w-full md:w-1/2 h-[300px] sm:h-[400px] flex items-center justify-center">
            <img src={`${data?.image}`} alt='product image' className="max-w-full max-h-full object-contain" />
        </div>
          <div className="w-full md:w-1/2">
          <Typography variant="h4" gutterBottom className="line-clamp-2 text-xl sm:text-2xl md:text-3xl">
             {data?.title}
           </Typography>
           <div className="flex justify-between items-center">
           <div className="flex items-center">
              <StarIcon className="text-orange-400"/>
              <span className="ps-2">{data?.rating.rate}</span>
           </div>
            <span>|</span>
            <span className="text-[#DB4444] font-bold">{isInStock ? 'In Stock' : 'Out of Stock'}</span>
           </div>
            <div className="my-5 text-xl sm:text-2xl font-bold">${data?.price}</div>
            <p className="mb-5 text-sm sm:text-base">
              {data?.description}
            </p>
            <hr className="border-2" />
            <div className="my-5">
              <div className="flex items-center">
               {isInStock ? <div className="flex items-center">
                
               <button className="w-[40px] h-8 border-2 border-black hover:bg-[#DB4444] hover:text-white hover:border-0" onClick={()=>{increase()}}>
                  <AddIcon/>
                </button>
                <div className="mx-5">{count}</div>
                <button className="w-[40px] h-8 border-2 border-black hover:bg-[#DB4444] hover:text-white hover:border-0"  onClick={()=>{decrease()}}>
                  <RemoveIcon/>
                </button>
                <button className="w-[200px] py-3 mx-4 text-white bg-[#DB4444] rounded-md hover:bg-[#B33636]" onClick={()=>handleAddingProduct(productId)}>Add To Cart</button>
               </div> : null}
               <button 
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => handleAddToFavorites(data?.id)}
                      >
                        {isProductFavorite(data?.id) ? (
                          <FavoriteIcon className="text-red-500" />
                        ) : (
                          <FavoriteBorderIcon className="text-gray-600" />
                        )}
                      </button>
              </div>
              <div className="my-5 border-2 border-black w-[400px]">
                <div className="flex items-center gap-4 px-3 py-2">
                  <div>
                    <LocalShippingIcon sx={{fontSize:'40px'}}/>
                  </div>
                  <div>
                    <p className="font-bold">Free Delivery</p>
                    <p>Note that you will provide us with your address</p>
                  </div>
                </div>
                <hr  className="border-2 border-black"/>
                <div>
                <div className="flex items-center gap-4 px-3 py-2">
                  <div>
                    <AutorenewIcon sx={{fontSize:'40px'}}/>
                  </div>
                  <div>
                    <p className="font-bold">Return Delivery</p>
                    <p>Free 30 Days Delivery Returns. Details</p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
       </div>
        </>}
        <OffCanvasSignUp isOpen={isOffCanvasOpen} onClose={() => setIsOffCanvasOpen(false)} />
    </div>
  )
}

export default ProductDetails