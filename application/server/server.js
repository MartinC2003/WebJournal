require('dotenv').config();

const express = require("express");
const cors = require("cors");
const admin = require("./firebase");  
const axios = require("axios");
const querystring = require("querystring");

const app = express();
const PORT = 8080;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

app.use(cors());
app.use(express.json());


const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized (No Token)" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized (Invalid Token)" });
  }
};


app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});


app.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
   
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = response.data;

    
    req.session = { spotifyAccessToken: access_token };

    res.json({
      message: "Successfully authenticated with Firebase and Spotify!",
      spotifyAccessToken: access_token,
      firebaseUser: req.user,
    });
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    res.status(500).json({ error: "Failed to get Spotify access token" });
  }
});

app.get("/api/home", verifyFirebaseToken, async (req, res) => {
  if (!req.session || !req.session.spotifyAccessToken) {
    return res.status(401).json({ error: "Spotify not authenticated" });
  }

  res.json({
    message: "Welcome! You are authenticated with Firebase and Spotify.",
    user: req.user,
    spotifyAccessToken: req.session.spotifyAccessToken,
  });
});


function generateRandomString(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
