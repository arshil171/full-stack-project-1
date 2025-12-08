import {  requireAuth } from '@clerk/express'
import { userModel } from '../models/User.js'
import { err } from 'inngest/types';

export const protectRoute = [
    requireAuth(),
    async (req , res , next) =>{
        try {
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({msg : "Unauthorized - invalid token"})
             
            const user = await userModel.findOne({clerkId})
            if(!user) return res.status(404).json({msg : "user not found"})

            req.user = user

            next()
        } catch (error) {
            console.log(error)
        }
    }
]