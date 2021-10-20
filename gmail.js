require('dotenv').config()
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
var express=require('express');
var app=express();
// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.CLIENT_ID;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


  // Webapp settings
  app.use(express.urlencoded({
      extended: true
  }));
  app.use(express.json());
  
  // Server Port
  const PORT = process.env.PORT || 5000;
  
  // Home route
  app.get('/', (req, res) => {
      res.send(`Gmail Api For Sending Mail to entered email address`);
  });
  
  app.post('/', async (req, res) => {

    //let from = req.body.from;
    let to = req.body.to;
    //let subject = req.body.subject;
    //let text = req.body.text;
    //let html = req.body.html;

    async function sendMail() {
      try {
        const accessToken = await oAuth2Client.getAccessToken();
    
        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'adegbamiyestephen2018@gmail.com',
            clientId: CLIENT_ID
            ,
            clientSecret: CLEINT_SECRET
            ,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
    
        let mailOptions = 
        {
            from: "adegbamiyestephen2018@gmail.com",
            to:  to,
            subject: "Thanks for testing out my work",
            text:  "",
            html: "<h2>Gmail Api Testing</h2> <br> <p>You are receiving this mail because you just tested out my gmail api</p> "
      };
    
        const result = await transport.sendMail(mailOptions);
        return result;
      } catch (error) {
        return error;
      }
    }
    
    
    sendMail()
      .then((result) => console.log('Email sent...', result))
      .catch((error) => console.log(error.message));
    let info = "An email has been sent to your email address"
    res.send(JSON.stringify({info}));
});

  
  // Start the server
  app.listen(PORT, () => {
      console.log(`Server is up and running at ${PORT}`);
  });
  