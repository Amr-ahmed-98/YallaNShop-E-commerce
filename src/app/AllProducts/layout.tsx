import CategoryList from '../_components/CategoriesList/page';

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='new-page-layout'>
      <main>
        <div className='container mx-auto px-4 my-5'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-3'>
              <CategoryList />
            </div>
            <div className='col-span-9'>{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
