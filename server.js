const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000; // Use the environment port or 3000 as default

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json("Hello from SMS API");
});

// Send SMS route
app.post("/send-sms", async (req, res) => {
  // Log the entire request body for debugging
  console.log("Request body:", req.body);

  const { message, mobileNumber } = req.body;

  // Validate input
  if (!message || !mobileNumber) {
    return res
      .status(400)
      .json({ error: "Message and mobile number are required" });
  }

  // Validate mobile number format
  if (!/^09\d{9}$/.test(mobileNumber)) {
    return res.status(400).json({ error: "Invalid mobile number" });
  }

  try {
    // Send the SMS via Semaphore API
    const response = await axios.post(
      "https://api.semaphore.co/api/v4/messages",
      {
        apikey: process.env.SEMAPHORE_API_KEY, // Ensure SEMAPHORE_API_KEY is set in your environment
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

// Start the server if not in serverless mode
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export the app for Vercel serverless functions
module.exports = app;
