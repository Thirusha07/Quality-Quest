import { Schema, model, models } from "mongoose";

const inviteSchema = new Schema({
  inviteId: {
    type: String,
    unique: true,
    required: true,
  },
  status: {
    type: string,
    required: true,
    enum: ['pending', 'accepted', 'rejected'],
  },
  sentTo: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  sentBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }]
}, { timestamps: true });

export default models.Invite || model("Invite", inviteSchema);
