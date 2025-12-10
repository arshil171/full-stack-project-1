import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

import React from 'react'
import toast from 'react-hot-toast'
import axiosInstance from '../src/lib/axios'

const HomePage = () => {
//  await   axiosInstance.get("/session/123")
  return (
     <div>
        <button className='btn btn-secondary' onClick={()=>toast.error("this is success")}>Click me</button>

    <SignedOut>
        <SignInButton mode='model'>
           <button>Login</button>
        </SignInButton>

    </SignedOut>

    <SignedIn>
        <SignOutButton/>
    </SignedIn>

    <UserButton/>
     </div>
  )
}

export default HomePage