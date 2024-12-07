const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 4031;

app.use(express.static(path.join(__dirname, "public")));

app.get("/stream", (req, res) => {
  res.set({
    "Content-Type": "video/webm",
    "Cache-Control": "no-cache",
  });

  const ffmpeg = spawn("ffmpeg", [
    "-f",
    "v4l2", // Input format
    "-i",
    "/dev/video0", // Webcam device path
    "-c:v",
    "libvpx", // Video codec
    "-f",
    "webm", // Output format
    "pipe:1", // Send output to STDOUT
  ]);

  ffmpeg.stdout.pipe(res);

  req.on("close", () => {
    ffmpeg.kill("SIGINT");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
