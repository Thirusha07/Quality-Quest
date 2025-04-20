import {Schema,model} from "mongoose";

const organizationSchema=new Schema({
    organizationId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    users: [{ type: Schema.Types.userId, ref: 'User' }],
    projects:[{type:Schema.Types.projectId,ref:'Project'}],

});

export default model("Organization",organizationSchema)