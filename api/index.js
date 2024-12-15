// api/sms.js
const express = require("express");
const axios = require("axios");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// API routes
app.get("/", (req, res) => {
  res.status(200).json("Hello from SMS API");
});

app.post("/send-sms", async (req, res) => {
  // Log the entire request body for debugging
  console.log("Request body:", req.body);

  const { message, mobileNumber } = req.body;
  console.log("message", message);
  // Validate input
  if (!message || !mobileNumber) {
    return res
      .status(400)
      .json({ error: "Message and mobile number are required" });
  }

  // Optional: Validate mobile number format
  if (!mobileNumber.match(/^09\d{9}$/)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  try {
    // Send the SMS via Semaphore
    const response = await axios.post(
      "https://api.semaphore.co/api/v4/messages",
      {
        apikey: process.env.SEMAPHORE_API_KEY,
        number: mobileNumber,
        message: message,
        sendername: "OMSCApp",
      }
    );

    res
      .status(200)
      .json({ message: "SMS sent successfully", response: response.data });
  } catch (error) {
    console.error("SMS sending error:", error);
    res
      .status(500)
      .json({ error: "Error sending SMS", details: error.message });
  }
});

// Export the function for Vercel serverless
module.exports = app;
