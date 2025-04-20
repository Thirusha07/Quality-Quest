import { Schema, model, models } from "mongoose";

const bugSchema = new Schema({
  bugId: {
    type: String,
    required: true,
    unique: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  assignedPersonDev: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  assignedPersonTest: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
}, { timestamps: true });

const Bug = models.Bug || model("Bug", bugSchema);
export default Bug;
