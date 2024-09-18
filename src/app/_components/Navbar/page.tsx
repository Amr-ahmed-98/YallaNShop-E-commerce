'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { initializeToken, logOut } from '@/store/logicSlice';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import axios from 'axios';
import { loadUserCart, setCartItems } from '@/store/cartSlice';
import { loadUserFavorites } from '@/store/favoriteSlice';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { token } = useSelector((state: any) => state.logicReducer);
  const dispatch = useDispatch<AppDispatch>();
  const emailInStorage = localStorage.getItem('email');
  const { countOfCartItems } = useSelector((state: any) => state.cart);
  const { favoriteItemsCount } = useSelector((state: RootState) => state.favorite);
 

  useEffect(() => {
    dispatch(initializeToken());
    dispatch(loadUserCart());
    dispatch(loadUserFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (emailInStorage) {
      const fetchCart = async () => {
        try {
          const sanitizedEmail = emailInStorage.replace(/\./g, ',');
          const response = await axios.get(`https://e-commerce-b469c-default-rtdb.europe-west1.firebasedatabase.app/carts/${sanitizedEmail}.json`);
          if (response.data && response.data.cartItems) {
            const cartQuantity = response.data.cartItems.length;
            dispatch(setCartItems(cartQuantity)); 
            console.log(countOfCartItems);
            
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      };
  
      fetchCart();
    }
  }, [emailInStorage, dispatch]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(initializeToken());
  };

  const staticPages = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/Contact' },
    { name: 'About', path: '/About' },
  ];

  const pages = token
    ? [...staticPages]
    : [
        ...staticPages,
        { name: 'Sign Up', path: '/SignUp' },
        { name: 'Log In', path: '/SignIn' },
      ];

  return (
    <AppBar position='static' sx={{ backgroundColor: 'white' }}>
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            YallaNShop
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              className='text-black'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link key={page.name} href={page.path} passHref>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{page.name}</Typography>
                  </MenuItem>
                </Link>
              ))}
              {token && (
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign='center'>Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Mobile logo */}
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            YallaNShop
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.name} href={page.path} passHref>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'black', display: 'block' }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
            {token && (
              <Button
                onClick={handleLogout}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                Logout
              </Button>
            )}
          </Box>

          {/* Search and icons */}
          <Box className='flex items-center gap-3'>
            <Search sx={{ display: 'flex' }}>
              <SearchIconWrapper>
                <SearchIcon sx={{ color: 'black', zIndex: 1 }} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='what are you looking for?'
                inputProps={{ 'aria-label': 'search' }}
                sx={{ backgroundColor: '#F5F5F5', color: 'black' }}
              />
            </Search>
            <div className='relative'>
          <span className='absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
            {token ? favoriteItemsCount : 0}
          </span>
          <Link href={'/Favourite'}>
            <FavoriteBorderIcon className='cursor-pointer z-10 text-black' />
          </Link>
        </div>
        <div className='relative'>
          <span className='absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
            {token ? countOfCartItems : 0}
          </span>
          <Link href={'/Cart'}>
            <ShoppingCartIcon className='cursor-pointer z-10 text-black' />
          </Link>
        </div>
            {token && (
              <Link href={'/Profile'}>
                <AccountBoxIcon className='cursor-pointer z-10 text-black' />
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
