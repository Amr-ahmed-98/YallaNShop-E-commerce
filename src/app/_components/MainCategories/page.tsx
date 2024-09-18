
import { Box, Typography, Grid, Paper } from '@mui/material';
import CableIcon from '@mui/icons-material/Cable';
import DiamondIcon from '@mui/icons-material/Diamond';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import styles from '@/app/styles/index.module.scss';
import Link from 'next/link';

const categories = [
  { icon: <CableIcon fontSize="large" />, name: 'Electronics',link:'/AllProducts/Electronics' },
  { icon: <DiamondIcon fontSize="large" />, name: 'Jewelery',link:'/AllProducts/Jewelery' },
  { icon: <MaleIcon fontSize="large" />, name: "Men's Clothing",link:'/AllProducts/Men' },
  { icon: <FemaleIcon fontSize="large" />, name: "Women's Clothing",link:'/AllProducts/Woman' },
];

const CategoriesSection = () => {
  return (
    <Box component="section" className="container mx-auto px-4 py-8">
           <div className={`${styles.title}`}>{`Categories`}</div>
      <Typography
        variant="h3"
        gutterBottom
        className="font-bold text-2xl sm:text-3xl md:text-4xl mb-6 text-center sm:text-left"
      >
        Browse By Categories
      </Typography>
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={6} sm={3} key={index}>
          <Link href={categories[index].link}>
          <Paper
              elevation={3}
              className="p-4 h-full flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <Box className="text-primary mb-3">{category.icon}</Box>
              <Typography variant="h6" component="div" className="text-center">
                {category.name}
              </Typography>
            </Paper>
          </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CategoriesSection;