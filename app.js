// api/sms.js
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// API routes
app.get("/sms", (req, res) => {
  res.status(200).json({ message: "Hello from SMS API" });
});

app.post("/sms/send-sms", (req, res) => {
  const message = req.body.message;
  const mobileNumber = req.body.mobileNumber;


  // Make sure the mobile number is valid
  if (!mobileNumber || !mobileNumber.match(/^\d{10}$/)) {
    res.status(400).json({ error: "Invalid mobile number" });
  } else {
    // Use semaphore to send the SMS
    const client = new semaphore.Client(
      process.env.SEMAPHORE_API_KEY, // Replace with your Semaphore API key
      "https://api.semaphore.co/api/v4/messages",
    );

    const messageOptions = {
      message: message,
      sender_id: 'OMSCApp',
      recipient: mobileNumber
    };
    client.sendMessage(messageOptions, (err, response) => {
      if (err) {
        res.status(500).json({ error: "Error sending SMS" });
      } else {
        res.status(200).json({ message: "SMS sent successfully" });
      }
    });
  }
});

// Export the function for Vercel serverless
module.exports = (req, res) => {
  app(req, res); // Make sure the express app handles the request
};

