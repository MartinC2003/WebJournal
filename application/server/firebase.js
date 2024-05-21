const admin = require('firebase-admin');
const serviceAccount = require('./credentials/webjournal-f20ab-firebase-adminsdk-b6jty-1a364b0b08.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
