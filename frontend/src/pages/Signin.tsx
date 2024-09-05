import { AuthSignin } from '../components/AuthSignin'
import { Quote } from '../components/Quote'


export const  Signin =()=>{
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 '>
        
       <AuthSignin />
        <Quote/>
        
    </div>
  )
}