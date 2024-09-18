'use client';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import styles from '@/app/styles/index.module.scss';
import InfiniteTimer from '../InfiniteTimer/page';
import FlashSaleSwiper from '../FlashSaleSwiper/page';

const FlashSale = () => { 
  return (
    <Box component='section'>
      <div className={`${styles.title}`}>{`Today's`}</div>
      <Box sx={{display:{xs:'flex-col',md:'flex'}}}>
        <Typography
          variant='h3'
          gutterBottom
          sx={{ marginInline: '20px', marginBlock: '10px', fontWeight: 'bold' }}
        >
          Flash Sales
        </Typography>
        <InfiniteTimer />
        <FlashSaleSwiper/>
      </Box>
    </Box>
  );
};

export default FlashSale;
