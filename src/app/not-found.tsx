import Link from "next/link"

const NotFound = () => {
  return (
    <div className="container my-4  min-h-[500px]">
        <div >
            <span className="mx-3 md:mx-0  "><Link href={'/'} className="text-gray-500">Home</Link> / Page Not Found</span>
        </div>
        <div className="flex flex-col justify-center items-center h-[500px]">
            <p className="text-5xl font-bold mb-3">404 Not Found</p>
            <p>Your visited page not found. You may go home page.</p>
            <button className="bg-[#e50914] text-white py-2 px-4 rounded mt-4 hover:bg-[#f6121d]"><Link href={'/'}>Back to Home Page</Link></button>
        </div>
    </div>
  )
}

export default NotFound