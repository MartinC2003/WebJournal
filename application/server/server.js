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


const {getAuth} = require("firebase-admin/auth") 

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
    cookie: { secure: false },
  })
);



const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "Unauthorized (No Token Provided)" });
  }

  try {
    // Verify the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Extract user UID
    const userUid = decodedToken.uid;
    
    console.log("Authenticated User UID:", userUid); // Log UID for debugging

    req.user = decodedToken; // Attach user data to request
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return res.status(401).json({ error: "Unauthorized (Invalid Token)" });
  }
};

// Spotify Login Route
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  const scope =
    "user-read-private user-read-email playlist-modify-private playlist-modify-public ugc-image-upload";  // Added ugc-image-upload scope

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
//Runs after Login 
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
        client_id: client_id,
        client_secret: client_secret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Spotify Token Response:", response.data);

    const { access_token, refresh_token, expires_in, scope } = response.data;

    // Store tokens in session
    req.session.spotifyAccessToken = access_token;
    req.session.spotifyRefreshToken = refresh_token;
    req.session.spotifyScopes = scope; // Store the granted scopes

    console.log("Granted Scopes:", scope);

    res.redirect("http://localhost:3000/createPlayList");
  } catch (error) {
    console.error("Error getting Spotify token:", error.response?.data || error);
    res.status(500).json({ error: "Failed to get Spotify access token" });
  }
});


// Protected API Route (Requires Firebase & Spotify Auth)
//Runs after callback
app.get("/api/home", verifyFirebaseToken, async (req, res) => {
  if (!req.session.spotifyAccessToken) {
    return res.status(401).json({ error: "Spotify not authenticated" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { 
        Authorization: `Bearer ${req.session.spotifyAccessToken}`,
        "Content-Type": "application/json"
      },
    });

    res.json({
      message: "Welcome! You are authenticated with Firebase and Spotify.",
      user: req.user,
      spotifyAccessToken: req.session.spotifyAccessToken,
      spotifyRefreshToken: req.session.spotifyRefreshToken
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Spotify token expired. Please refresh the token." });
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
app.get('/refresh_token', async function(req, res) {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'client_credentials'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        }
      }
    );

    if (response.status === 200) {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token || req.session.refresh_token;
      
      // Store both the access_token and refresh_token in session
      req.session.spotifyAccessToken = access_token;
      req.session.spotifyRefreshToken = refresh_token; // Save the refresh token in session as well

      // Send both tokens back in the response
      res.send({
        access_token: access_token,
        refresh_token: refresh_token
      });
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    console.error("Error requesting Spotify token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get access token" });
  }
});

// Endpoint to get LastFM API Key
app.get("/getLastFMKey", ( res) => {
  res.json({ lastfm_key: lastfm_key });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Session Test Route
app.get("/session-test", (req, res) => {
  res.json({ session: req.session });
});
