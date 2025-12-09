import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    problem: {
        type: String,
        require: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        require: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    participant :{
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default : null
    },
    status :{
         type: String,
         enum : ["active" , "completed"],
         default : "active"
    },
    // stream vidio call id 
    callId :{
        type : String,
        default:"",

    }
    
},{timestamps : true})

const Session = mongoose.model("session", sessionSchema)

export default Session