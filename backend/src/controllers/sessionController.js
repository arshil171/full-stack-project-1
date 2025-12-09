import { chatClient, streamClient } from "../lib/stream.js"
import Session from "../models/Session.js"

export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body
        const userId = req.user._id
        const clerkId = req.user.clerkId

        if (!problem || !difficulty) {
            return res.status(400).json({ message: "Problem and Difficulty arerequired" })
        }

        // generate a unique call id for stream video
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

        // create session in db
        const session = await Session.create({ problem, difficulty, host: userId, callId })

        //create stream vidio call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: session._id.toString() },
            },
        })

        // chat messaging

        chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId]
        })

        await channel.create()

        res.status(201).json({ session })
    } catch (error) {
        console.log("Error in createSession controller:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getActiveSessions(_, res) {
    try {
        const sessions = await Session.find({ status: "active" }).populate("host", "name profileImage email clerkId").sort({ createdAt: -1 }).limit(20)

        res.status(200).json({ sessions })
    } catch (error) {
        console.log("Error in getActiveSessions controller:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id
        //where user is either host or participant

        const sessions = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }]
        }).sort({ createdAt: -1 }).limit(20)

        res.status(200).json({ sessions })
    } catch (error) {
        console.log("Error in getMyRecentSession controller:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function getSessionById(req, res) {
    try {
        const { id } = req.params

        const session = await Session.findById(id).populate("host", "name email profileImage clerkId").populate("participant", "name email profileImage clerkId")

        if (!session) return res.status(404).json({ message: "Session is not found" })

        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in getSessionById controller:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function joinSession(req, res) {
    try {
        const { id } = req.params
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)

        if (!session) return res.status(404).json({ message: "Session is not found" })

        //check if session is aleready full - has a participant
        if (session.participant) return res.status(404).json({ message: "Session is full" })

        session.participant = userId
        await session.save()

        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session})
    } catch (error) {
          console.log("Error in joinSession controller:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params
        const userId = req.user._id

         const session = await Session.findById(id)

          if (!session) return res.status(404).json({ message: "Session is not found" })

        //check if user is the host

        if(session.host.toString() !== userId.toString()){
            res.status(403).json({message : "Only the host can end the session"})
        }

        // check if alredy completed

          if(session.status === "completed"){
            res.status(400).json({message : "Session is already completed"})
        }

        session.status = "completed"
        await session.save()
       
        //delete strem vidio call
        const call = streamClient.video.call("default" , session.callId)
        await call.delete({hard:true})


        //delete stream chat channel
        const channel = chatClient.channel("messaging" , session.callId)
        await channel.delete()

        res.status(200).json({session , message : "Session ended successfully"})
    } catch (error) {
       console.log("Error in endSession controller:", error)
        res.status(500).json({ message: "Internal Server Error" }) 
    }
 }

