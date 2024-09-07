import { Link } from "react-router-dom"

export const Header=()=>{
return (  
        <div className="flex justify-around items-center  bg-zinc-400">
                <Link to="/" className="text-2xl font-bold text-slate-700 hover:text-sl-800 hover:text-slate-800">
                LOGO
                </Link>
                <div className="flex justify-around items-center ">
                        <Link to="/signin" className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                        focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 mr-5">Signin</Link>
                        <Link to='/signup' className=" text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 
                        focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mb-2 ml-5">Signup</Link>     
                </div>

      </div>
      
)


}













//  function Header() {  
   

  

//   return (
//     <header>
//     <Link to="/" className='logo'>MyBlog</Link>
//     <nav>
//       {username && (
//         <>
//          <Link to='/create'>Create New Post</Link>
//            <Link to={'/login'}  onClick={logout}>Logout</Link>
//         </>
//       )}
//       {!username && (
//         <>  
//         <Link to='/login' >Login</Link>
//       <Link to='/register'>Register</Link>
//         </>
//       )}
    
//     </nav>
//   </header>
//   )
// }

// export default Header
