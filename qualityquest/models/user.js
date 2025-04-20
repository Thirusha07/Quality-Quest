import {Schema,model,models} from "mongoose";

const userSchema=new Schema({
    userId: {
        type: String,
        required: true,
        unique:true
      },
    name: {
        type: String,
        required: true,
      },
      email:{
        type:String,
        required:true,

      },
      password:{
        type:String,
        required:true
      },
      role:{
        type:String,
        enum:['admin','product manager','developer','tester'],
        required:true
      },
      userType: {
        type: String,
        enum: ['individual', 'organization'],
        required: true
      },
      organizationId: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: function () {
          return this.userType === 'organization';
        },
      },

});
const User = models.User || model("User", userSchema);
export default User;