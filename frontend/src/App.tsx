import { BrowserRouter , Route,Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Layout } from './pages/Layout'
import { HomePage } from './pages/HomePage'
import { Signup } from './pages/Signup'
import { Profile } from './pages/Profile'
import { MyAds } from './pages/MyAds'
import { AddItem } from './pages/AddItem'
import SearchAds from './pages/SearchAds'
import { Ad } from './pages/Ad'
import { Setting } from './pages/Setting'

function App() {
  return (
    <>
     <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<Layout/>}> 
        {/* // just show header and all its children */}
          <Route index element={<HomePage/>}/>  
          {/* // to show in homepage  */}
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/search' element={<SearchAds/>}/>
          {/* protected route only when login*/}
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/myads' element={<MyAds/>}/>  
          <Route path='/additem' element={<AddItem/>}/> 
          <Route path='/ad/:id' element={<Ad/>}/>
          <Route path='/setting' element={<Setting/>}/>
          {/* protected route only when login*/}
        </Route>

      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
