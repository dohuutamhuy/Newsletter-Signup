import express from 'express';
import got, {Options} from 'got';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("./"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", async function(req, res) {
  // console.log(req.body);
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;

  let data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  }


  const options = {
    username: 'anystring',
    password: 'put your api key here',
    body: JSON.stringify(data)
  };

  // Try-catch option:
  // try {
  //   const response = await got.post('https://us14.api.mailchimp.com/3.0/lists/d32c0c4a02', options);
  //   const body = JSON.parse(response.body);
  //   const {
  //     statusCode
  //   } = response;
  //   console.log(statusCode);
  // } catch (e) {
  //   if (e.response) {
  //     console.log("Error " + e.response.statusCode + ": " + e.response.statusMessage);
  //   } else {
  //     console.log("Error code: " + e.code);
  //   }
  // }

  // Promise option:
  const response = await got.post('https://{your_data_center}.api.mailchimp.com/3.0/lists/{your_list_id}', options)
    .then(
      ({body, statusCode}) => {
        const content = JSON.parse(body);
        if (statusCode == 200 && content.errors.length == 0) {
          res.sendFile(__dirname + "/success.html")
        } else {
          res.sendFile(__dirname + "/failure.html")
        }
      },
      error => {
        if (error.response) {
          console.log("Error " + error.response.statusCode + ": " + error.response.statusMessage);
        } else {
          console.log("Error code: " + error.code);
        }
        res.sendFile(__dirname + "/failure.html")
      });
});

app.listen(port, function() {
  console.log("Server is running on " + port);
});
