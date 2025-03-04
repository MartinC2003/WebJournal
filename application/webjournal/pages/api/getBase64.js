import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { imagePath } = req.query;

  if (!imagePath) {
    return res.status(400).json({ error: "Missing imagePath parameter" });
  }

  try {
    const filePath = path.join(process.cwd(), "public", imagePath);
    const fileStats = fs.statSync(filePath);  // Get file stats to check size

    // Check if the file exceeds 256 KB (262144 bytes)
    if (fileStats.size > 262144) {
      return res.status(400).json({ error: "Image exceeds the 256 KB size limit" });
    }

    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    // Return only the base64-encoded image data in the response body
    res.status(200).json({ base64: base64Image });
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Failed to read image file" });
  }
}
