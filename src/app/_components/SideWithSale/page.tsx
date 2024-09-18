import CategoryList from '../CategoriesList/page';
import MainSlider from '../MainSlider/page';

const SideWithSale = () => {
  return (
    <div className='container mx-auto px-4 my-5'>
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-3'>
        <CategoryList />
      </div>
      <div className='col-span-9'>
        <MainSlider />
      </div>
    </div>
  </div>
  );
};

export default SideWithSale;
