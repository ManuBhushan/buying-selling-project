import { BrowserRouter , Route,Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Layout } from './pages/Layout'
import { HomePage } from './pages/HomePage'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { MyAds } from './pages/MyAds'
import { AddItem } from './pages/AddItem'
function App() {

  return (
    <>
     <BrowserRouter>
      <Routes >
        
        <Route path='/' element={<Layout/>}> 
        {/* // just show header and all its children */}
          <Route index element={<HomePage/>}/>  
          {/* // to show in homepage  */}
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/signup' element={<Signup/>}/>

          {/* protected route only when login*/}
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/myads/' element={<MyAds/>}/>  
          <Route path='/additem' element={<AddItem/>}/> 
          {/* protected route only when login*/}

        </Route>

      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
