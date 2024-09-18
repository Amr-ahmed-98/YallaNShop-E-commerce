
import Link from "next/link"
const CategoryList = () => {
  return (
    <div className="w-full"> 
        <ul className="flex flex-col gap-4 px-5 my-5 relative after:absolute after:w-1 after:h-full after:right-0 after:bg-black ">
            <Link href={'/AllProducts'} className="cursor-pointer">{`All Products`}</Link>
            <Link href={'/AllProducts/Men'} className="cursor-pointer">{`men's fashion`}</Link>
            <Link href={'/AllProducts/Woman'} className="cursor-pointer">{`women's fashion`}</Link>
            <Link href={'/AllProducts/Electronics'} className="cursor-pointer">{`electronics`}</Link>
            <Link href={'/AllProducts/Jewelery'} className="cursor-pointer">{`jewelery`}</Link>
        </ul>
    </div>
  )
}

export default CategoryList