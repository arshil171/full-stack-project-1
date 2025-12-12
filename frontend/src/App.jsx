import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import { Toaster } from "react-hot-toast"
import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import ProblemPage from './pages/ProblemPage'


const App = () => {

  const { isSignedIn , isLoaded} = useUser()


 
  // this will get rid of the flickering effect
    if(!isLoaded) return null

    
  return (
    <>
      <Routes>


        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        
        <Route path='/problem/:id' element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />

      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  )
}

export default App

// tw , daisyui , react-router , react-hot-toast ,
// todo :  react-query aka tanstack query, axios