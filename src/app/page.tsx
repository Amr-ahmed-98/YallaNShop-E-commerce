
import FlashSale from "./_components/FlashSale/page";
import MainCategories from "./_components/MainCategories/page";
import MainProducts from "./_components/MainProducts/page";
import SideWithSale from "./_components/SideWithSale/page";

export default function Home() {
  return (
    <main>
      {/* there's another way to  */}
      <SideWithSale />
      <FlashSale/>
      <MainCategories/>
      <MainProducts/>
    </main>
  );
}
