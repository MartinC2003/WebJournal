const express = require("express");
const cors = require("cors");
const admin = require("./firebase");  // Import Firebase Admin SDK

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Protected route
app.get("/api/home", verifyToken, (req, res) => {
  res.json({ message: "Hello World", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
