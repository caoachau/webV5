const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
      default: "",
    },
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdFiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    createdCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)

module.exports = User
