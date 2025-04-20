import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  taskId: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['yetToStart', 'inProgress', 'completed'],
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  bugs: [{
    type: Schema.Types.ObjectId,
    ref: 'Bug',
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
}, { timestamps: true });

export default models.Task || model("Task", taskSchema);
