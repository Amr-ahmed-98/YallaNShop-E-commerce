'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';


const MainSlider = () => {  
  return (
    <Swiper
    spaceBetween={15}
    slidesPerView={1}
    loop={true}
    autoplay
    modules={[Autoplay]}
    
  >
    <SwiperSlide className='cursor-pointer'>
      <img src="/images/slider1.png" alt="sale-1"   className='w-full h-full'/>
    </SwiperSlide>
    <SwiperSlide className='cursor-pointer'>
    <img src="/images/slider2.png" alt="sale-2" className='w-full h-full' />
    </SwiperSlide>
    <SwiperSlide className='cursor-pointer'>
    <img src="/images/slider3.jpg" alt="sale-3" className='w-full h-full' />
    </SwiperSlide>
  </Swiper>
  )
}

export default MainSlider