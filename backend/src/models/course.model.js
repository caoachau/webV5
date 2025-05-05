const mongoose = require("mongoose")
const { Schema } = mongoose

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    sections: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        files: [
          {
            type: Schema.Types.ObjectId,
            ref: "File",
          },
        ],
      },
    ],
    enrolledUsers: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number,
          default: 0,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
)

// Add text indexes for search functionality
courseSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  category: "text",
})

const Course = mongoose.model("Course", courseSchema)

module.exports = Course
