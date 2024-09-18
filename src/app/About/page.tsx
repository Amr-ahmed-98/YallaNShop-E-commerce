import Box from '@mui/material/Box';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
const page = () => {
  return (
    <>
   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="my-4">
      <span className="text-gray-500">
        <Link href="/">Home</Link> / About
      </span>
    </div>
    <Box component="section">
      <Box component="div" className="flex flex-col md:flex-row">
        <Box component="div" className="flex-1 order-2 md:order-1 md:pr-8">
          <Typography variant="h1" gutterBottom>
            Our Story
          </Typography>
          <Typography variant="body1" gutterBottom>
            Launced in 2015, Exclusive is South Asia`s premier online shopping
            makterplace with an active presense in Bangladesh. Supported by
            wide range of tailored marketing, data and service solutions,
            Exclusive has 10,500 sallers and 300 brands and serves 3 millioons
            customers across the region.
          </Typography>
          <Typography variant="body2" gutterBottom>
            Exclusive has more than 1 Million products to offer, growing at a
            very fast. Exclusive offers a diverse assotment in categories
            ranging from consumer.
          </Typography>
        </Box>
        <Box component="div" className="flex-1 order-1 md:order-2 mb-4 md:mb-0">
          <img
            src="/images/about.jpg"
            alt="meeting image"
            className="w-full md:w-[800px]"
          />
        </Box>
      </Box>
    </Box>
    <Box component="section" className="my-5">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      { icon: StorefrontIcon, title: "10.5K", description: "Sellers active on our site" },
      { icon: MonetizationOnIcon, title: "33K", description: "Monthly Product Sale" },
      { icon: OnlinePredictionIcon, title: "45.5K", description: "Customers active on our site" },
      { icon: AttachMoneyIcon, title: "25K", description: "Annual gross sale on our site" },
    ].map((item, index) => (
      <div key={index} className="border border-black flex flex-col justify-center items-center p-4 hover:bg-[#DB4444] hover:text-white hover:border-none group transition-colors duration-300">
        <div className="relative mb-2">
          <div className="absolute w-[60px] h-full right-0 -left-1 bg-gray-200 rounded-full -z-10 group-hover:bg-white transition-colors duration-300"></div>
          <item.icon sx={{ fontSize: '40px' }} />
        </div>
        <p className="font-bold text-lg">{item.title}</p>
        <p className="text-center">{item.description}</p>
      </div>
    ))}
  </div>
</Box>
  </div>
    </>
  );
};

export default page;
