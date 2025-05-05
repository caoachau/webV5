const express = require("express")
const cors = require("cors")
const config = require("./config/config")
const authRoutes = require("./routes/auth.routes")
const fileRoutes = require("./routes/file.routes")
const courseRoutes = require("./routes/course.routes")
const errorMiddleware = require("./middleware/error.middleware")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/courses", courseRoutes)

// Error handling middleware
app.use(errorMiddleware)

// Start the server
app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`)
})
