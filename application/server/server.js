require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const admin = require("./firebase");
const axios = require("axios");
const querystring = require("querystring");

const app = express();
const PORT = 8080;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

// Debug logs to check if .env values are loaded
console.log("Client ID:", client_id);
console.log("Redirect URI:", redirect_uri);
console.log("Client Secret:", client_secret ? "Loaded" : "Missing");

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Firebase Token Verification Middleware
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

// Spotify Login Route
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

// Spotify Callback Route
app.get("/callback", async (req, res) => {
  const { code } = req.query;

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
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Store tokens in session and track the expiration time
    req.session.spotifyAccessToken = access_token;
    req.session.spotifyRefreshToken = refresh_token;
    req.session.spotifyTokenExpiration = Date.now() + (expires_in - 60) * 1000; // Store expiration time (subtracting 1 minute for safety)

    console.log("Spotify Access Token Received:", access_token);

    // Preemptively refresh the access token before it expires
    scheduleTokenRefresh(req.session.spotifyTokenExpiration);

    // Redirect back to frontend after successful login
    res.redirect("http://localhost:3000/createPlayList");
  } catch (error) {
    console.error("Error getting Spotify token:", error.response?.data || error);
    res.status(500).json({ error: "Failed to get Spotify access token" });
  }
});

// Protected API Route (Requires Firebase & Spotify Auth)
app.get("/api/home", verifyFirebaseToken, async (req, res) => {
  if (!req.session.spotifyAccessToken) {
    return res.status(401).json({ error: "Spotify not authenticated" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${req.session.spotifyAccessToken}` },
    });

    res.json({
      message: "Welcome! You are authenticated with Firebase and Spotify.",
      user: req.user,
      spotifyAccessToken: req.session.spotifyAccessToken,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Spotify token expired, attempting to refresh...");

      try {
        await refreshSpotifyToken(req);
        res.redirect("/api/home");
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        res.status(500).json({ error: "Failed to refresh Spotify token" });
      }
    } else {
      res.status(500).json({ error: "Failed to retrieve Spotify user data" });
    }
  }
});

// Function to generate random state string
function generateRandomString(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Refresh Token Route
async function refreshSpotifyToken(req) {
  const refresh_token = req.session.spotifyRefreshToken;

  if (!refresh_token) {
    throw new Error("No refresh token found.");
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );

    const { access_token, refresh_token: new_refresh_token, expires_in } = response.data;

    // Store the new access token and refresh token
    req.session.spotifyAccessToken = access_token;
    req.session.spotifyRefreshToken = new_refresh_token || refresh_token;
    req.session.spotifyTokenExpiration = Date.now() + (expires_in - 60) * 1000; // Update expiration time

    // Preemptively refresh the token again
    scheduleTokenRefresh(req.session.spotifyTokenExpiration);

    console.log("Spotify Access Token Refreshed:", access_token);
  } catch (error) {
    console.error("Error refreshing Spotify token:", error.response?.data || error);
    throw new Error("Failed to refresh Spotify token");
  }
}

// Schedule the token refresh before expiration
function scheduleTokenRefresh(expirationTime) {
  const timeUntilRefresh = expirationTime - Date.now();
  if (timeUntilRefresh > 0) {
    setTimeout(async () => {
      console.log("Refreshing Spotify token preemptively...");
      await refreshSpotifyToken(req);
    }, timeUntilRefresh);
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Session Test Route
app.get("/session-test", (req, res) => {
  res.json({ session: req.session });
});
