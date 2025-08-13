# Musicjournal

- [Project Summary](#project-summary)  
- [Tech Stack](#tech-stack)  
- [Running Locally](#running-locally)  
- [Bugs and Errors](#bugs-and-errors)  
- [Credits](#credits)  

## Project Summary 

Musicjournal acts as a digital journal that helps users process their emotions and thoughts. Whenever a user creates an entry, they select a mood and song that reflects their current emotions. The user can sign into their Spotify account and have a playlist generated based on a specific mood. 

Please note this is only a beta build. All images are placeholders and will be updated in the future. 

### Demo
      (Demo here) 



### Creating entries 

Create an account using your email. Once the account has been created it, sign in to gain access to the site. 

![Sign Up Page](https://github.com/MartinC2003/WebJournal/blob/528575ba45f18da70e22c7e21b340f27232ee429/SignUpSS.png) 

Use a valid email to create an account. **There is no account recovery function in the current build of the project**, so please remember login details. If the worst case scenario happens send a private message and I’ll have it sorted.

#### Create entry page
![Create Entry Page ](https://github.com/MartinC2003/WebJournal/blob/528575ba45f18da70e22c7e21b340f27232ee429/CreateEntrySS.png) 
Go to the "Create entry" page through the navigation bar. Fill in all the fields, otherwise the entry won’t be saved. **The song must exist in Spotify and and the track details must be spelt correctly**, otherwise the generator won’t work properly. 

Once finished you will be redirected to the "View Entry page" where you can view all the entries.  

### Creating playlist
![Browser Settings ](https://github.com/MartinC2003/WebJournal/blob/528575ba45f18da70e22c7e21b340f27232ee429/SettingsSS.png)
Before proceeding, enable “insecure content” in your browser’s site permissions. This is because the API calls use *Hypertext Transfer Protocol* instead of its secure version, *Hypertext Transfer Protocol Secure*. 

![Sign into Spotify](https://github.com/MartinC2003/WebJournal/blob/528575ba45f18da70e22c7e21b340f27232ee429/CreatePlaylistSignUpSS.png)
Sign into your spotify account and grant the requested permissions.

![Create Playlist](https://github.com/MartinC2003/WebJournal/blob/c7f412b215ded17e1623b91a90a7b129854d21c5/CreatePlaylistSS.png)
Select the mood you want the playlist to be based on. Then choose a month and year so the system can fetch the relevant entries for generating your playlist. **There must be at least one entry that fits these parameters**, otherwise the generator won’t work.  

![Playlist](https://github.com/MartinC2003/WebJournal/blob/c7f412b215ded17e1623b91a90a7b129854d21c5/PlaylistCreatedSS.png)
Once the playlist finishes generating, the playlist will be saved in the user's account. **Please note that all generated playlists are public upon creation**.
## Tech Stack 

### Frontend: Next.js, Javascript
The frontend was designed out in Figma and coded in manually using CSS. The website only has desktop support. 

### Database: Firebase
The user’s data is saved in a cloud storage hosted by *Firebase*. Firebase handles both user authentication and database management.  

### Backend: Express.js
Express.js is used to send requests to third-party APIs . The API components used in this application are the *Web Spotify API* and the *Last FM API*. When a user generates a playlist, the app queries Firebase to retrieve song data. That data is then passed to Last.fm, which returns recommended tracks based on the retrieved songs. A request is then made to Spotify to create a playlist based on the acquired data. 

### Hosting: Vercel 
Musicjournal is deployed as a monorepo, with both the frontend and backend contained within the same repository. The "vercel.json" file defines the build configuration for the application during deployment.
## Running Locally

### Download Dependencies 
Clone the repository and navigate to the project folder. The repo will have two folders which contain the frontend and backend project. You would need to install dependencies for both folders separately. 


```bash
git clone https://github.com/MartinC2003/WebJournal.git
```
Frontend:
```bash
cd WebJournal/application/webjournal
npm install
```
Backend:
```bash
cd WebJournal/application/server
npm install

```

### Change API routes to be ran locally 
Before starting the application, configure all API calls to use localhost. 

Navigate to the "createPlayList folder"

```bash
cd WebJournal/application/webjournal/src/app/createPlayList
```

In the file "page.js" and "spotify-request.js" replace the current API calls with localhost 

```js
//Example
    const response = await fetch("http://localhost:8080/api/home", 
    {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
      credentials: "include",
    });
```

Navigate to the ==server folder==
```bash
cd WebJournal\application\server
```
In the file "server.js" replace all API calls that use "redirect_uri" with "redirect_uri_local". 

```js
//Example
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri_local,
        client_id: client_id,
        client_secret: client_secret,
      }),
      {
```
Replace the production domain (Vercel) with localhost

```js
app.use(
  cors({
    credentials: true,
    origin: [ "http://localhost:3000" ],  
  })
);
```

### Running frontend and backend projects
Once all API requests are changed to use your local network, you can now run the application. You would need to run the frontend and backend projects separately. Start the frontend project first and then the backend. 

Frontend:
```bash
cd WebJournal\application\webjournal
npm run dev
```
Backend:
```bash
cd WebJournal/application/server
npm start
```
## Bugs and Errors

### 2025-08-12 

#### Album cover not showing up upon album creation  
The generated playlist would have a custom album cover upon its creation. This feature works locally but not on deployment.

#### Refresh token function not working 
The refresh token would expire when its not supposed to. 

### Future implementations
- Replacing placeholder images and texts with assests of my own
- Importing a frontend library to fix the CSS
- Mobile support
- Updating Node.js (This version uses Node.js 18)
- Speeding up the generator
- Implementing more exception handling 
## Credits

### Creator Links
- [LinkedIn](https://www.linkedin.com/in/-martincontreras-/)  
- [GitHub](https://github.com/MartinC2003)  

### APIs
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)  
- [Last.fm API](https://www.last.fm/api)  

### Fonts
- [Ethnocentric](https://www.dafont.com/ethnocentric.font)  
- [Nulshock](https://www.dafont.com/nulshock.font)  
- [Planet Kosmos](https://www.dafont.com/planet-kosmos.font)  
- [Ranger Force](https://www.dafont.com/ranger-force.font)  
