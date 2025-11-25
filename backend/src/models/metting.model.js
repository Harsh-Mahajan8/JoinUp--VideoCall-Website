import {Schema, model} from "mongoose";

const meetingSchema = new Schema({
    user_id:{type:String},
    meetingCode:{type:String, require:true},
    date:{type:Date, default:Date.now, required:ture}
});

const Meeting = model("Meeting", meetingSchema);

export {Meeting};