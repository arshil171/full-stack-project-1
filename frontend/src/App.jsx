import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'
import React from 'react'


const App = () => {
  return (
    <>
      <h1>Welcome to the app</h1>

      <SignedOut>
        <SignInButton mode='modal' >
           <button>Login</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
         <SignOutButton />
      </SignedIn>

      <SignedIn>
        <UserButton/>
      </SignedIn>
    </>
  )
}

export default App