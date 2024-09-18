import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { TextField, InputAdornment } from '@mui/material';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <>
      <div className='container mx-auto '>
        <div className='flex flex-col text-white bg-black p-5'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 bg- w-full min-h-[200px] gap-7 px-4 py-8'>
            <div className='col-span-1 sm:col-span-2 xl:col-span-3 mb-8 xl:mb-0'>
              <div className='flex flex-col gap-2'>
                <Link href={'/'} className='text-2xl font-bold'>
                  YallaNShop
                </Link>
                <p className='text-lg'>Subscribe</p>
                <span>Get 10% off your first order</span>
                <TextField
                  variant='outlined'
                  placeholder='Enter your email'
                  InputProps={{
                    style: { color: 'white' },
                    startAdornment: (
                      <InputAdornment position='start'>
                        <ArrowRightIcon
                          sx={{
                            fontSize: { xs: '30px', sm: '40px', md: '50px' },
                            color: 'white',
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  type='email'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                      },
                      '&:hover fieldset': {
                        borderColor: 'lightgray',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'gray',
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className='col-span-1 sm:col-span-2 xl:col-span-3 mb-8 xl:mb-0'>
              <div className='flex flex-col gap-3'>
                <h2 className='font-bold text-2xl'>Support</h2>
                <p className=''>
                  111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
                </p>
                <p className=''>exclusive@gmail.com</p>
                <p>+88015-88888-9999</p>
              </div>
            </div>
            <div className='col-span-1 sm:col-span-2 xl:col-span-3 mb-8 xl:mb-0'>
              <div className='flex flex-col gap-3'>
                <h2 className='font-bold text-2xl'>Account</h2>
                <Link href={'/Profile'}>My Account</Link>
                <Link href={'/Cart'}>Cart</Link>
                <Link href={'/'}>WishList</Link>
                <Link href={'/AllProducts'}>Products</Link>
                <Link href={'/Contact'}>Contact</Link>
              </div>
            </div>
            <div className='col-span-1 sm:col-span-2 xl:col-span-3 mb-8 xl:mb-0'>
              <div className='flex flex-col gap-3'>
              <h2 className='font-bold text-2xl'>Dawnload App</h2>
              <span>Save $3 with App New User Only</span>
              <div className='flex items-center gap-3'>
                <div>
                  <img src='/images/qrCode.png' className='w-[80px]'/>
                </div>
                <div>
                  <img src='/images/AppStore.png' className='w-[150px]'/>
                  <img src='/images/googlePlay.png' className='w-[150px]'/>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <FacebookIcon sx={{fontSize:'40px' , cursor:'pointer'}} />
                <TwitterIcon sx={{fontSize:'40px' , cursor:'pointer'}} />
                <InstagramIcon sx={{fontSize:'40px' , cursor:'pointer'}} />
                <LinkedInIcon sx={{fontSize:'40px' , cursor:'pointer'}} />
              </div>
              </div>
            </div>
          </div>
          <div className='text-center'>
            <p>Copyright © 2022 YallaNShop. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
