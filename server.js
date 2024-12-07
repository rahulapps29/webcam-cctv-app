const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const NodeWebcam = require("node-webcam");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Webcam configuration
const webcamOptions = {
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  saveShots: false,
  output: "jpeg",
  device: false,
  callbackReturn: "base64",
};

const Webcam = NodeWebcam.create(webcamOptions);

// Serve static files
app.use(express.static(__dirname + "/public"));

// Route to load the CCTV page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Stream webcam feed
setInterval(() => {
  Webcam.capture("shot", (err, data) => {
    if (!err) {
      io.emit("image", data);
    }
  });
}, 100); // Capture every 100ms

// Start the server
const PORT = 4031;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
