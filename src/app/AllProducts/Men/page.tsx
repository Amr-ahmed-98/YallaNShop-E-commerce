'use client';
import { productState } from "@/interfaces/productsState"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const Men = () => {

    const {data} = useQuery({
        queryKey: ['allProducts'],
        queryFn: async () => {
          const response = await axios.get<productState[]>(`https://fakestoreapi.com/products/category/men's clothing`)
          return response.data
        }
      })
  return (
    <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {data?.map((product) => (
        <div key={product.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
          <div className="h-48 w-full">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-contain bg-gray-100"
            />
          </div>
          <div className="p-4 flex-grow flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h2>
            <p className="text-xl font-bold text-[#DB4444] mt-auto">${product.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Men