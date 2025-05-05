const mongoose = require("mongoose")
const { Schema } = mongoose

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "restricted"],
      default: "public",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allowedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true },
)

// Add text indexes for search functionality
fileSchema.index({
  name: "text",
  description: "text",
  tags: "text",
})

const File = mongoose.model("File", fileSchema)

module.exports = File
