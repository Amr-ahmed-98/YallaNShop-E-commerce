'use client';
import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { loadUserFavorites, removeFromFavorites } from '@/store/favoriteSlice';
import { addToCart } from '@/store/cartSlice';
import { AppDispatch, RootState } from '@/store/store'; 

const Favourite: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { favoriteItems, isLoading, error } = useSelector((state: RootState) => state.favorite);

  useEffect(() => {
    dispatch(loadUserFavorites());
  }, [dispatch]);

  const handleRemoveFromFavorites = (productId: number) => {
    dispatch(removeFromFavorites(productId));
  };

  const handleAddToCart = (productId: number) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2 className="font-bold text-2xl my-5">Favorites ({favoriteItems.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        {favoriteItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
            <span className='bg-white absolute cursor-pointer rounded-md right-0' onClick={() => handleRemoveFromFavorites(item.id)}>
              <DeleteOutlineIcon sx={{fontSize:'40px'}}/>
            </span>
            <div>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <span className="flex justify-center gap-5 bg-black text-white py-3 cursor-pointer" onClick={() => handleAddToCart(item.id)}>
                <button>Add To Cart</button>
                <ShoppingCartIcon/>
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourite;