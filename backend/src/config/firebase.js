const { initializeApp } = require("firebase/app")
const { getStorage } = require("firebase/storage")
const { getAuth } = require("firebase/auth")
const config = require("./config")

// Initialize Firebase
const firebaseApp = initializeApp(config.FIREBASE_CONFIG)
const firebaseStorage = getStorage(firebaseApp)
const firebaseAuth = getAuth(firebaseApp)

module.exports = { firebaseApp, firebaseStorage, firebaseAuth }
