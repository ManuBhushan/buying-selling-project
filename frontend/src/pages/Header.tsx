import { Link } from "react-router-dom"

export const Header=()=>{
return (  
        <div className="flex justify-around">
                <Link to="/" className="text-2xl">LOGO</Link>
                <div className="flex justify-around  bg-red-200">
                        <Link to="/signin" className="text-2xl mr-5">Signin</Link>
                        <Link to='/signup' className="text-2xl ml-5">Signup</Link>     
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
