import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import {Toaster} from "react-hot-toast"
import ProblemsPage from '../pages/ProblemsPage'


const App = () => {

  const {isSignedIn} = useUser()
  return (
    <>
    <Routes>
     

      <Route path='/' element={<HomePage />} />
      <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"}/> } />

    </Routes>

    <Toaster  toastOptions={{duration:3000}} />
    </>
  )
}

export default App

// tw , daisyui , react-router , react-hot-toast ,
// todo :  react-query aka tanstack query, axios