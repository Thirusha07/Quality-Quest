// models/Project.ts
import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  environment: {
    type: String,
    required: true,
    enum: ['prod', 'non-prod', 'staging'],
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  }],
});

export default model('Project', projectSchema);
