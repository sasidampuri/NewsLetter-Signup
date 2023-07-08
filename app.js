const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const https = require("https");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", function(req, res){
  res.redirect("/");
})
app.post("/", function(req, res) {
  const fname = req.body.Fname;
  const lname = req.body.Lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  }

  const jsondata = JSON.stringify(data);

  console.log(jsondata);
  const url = "https://us8.api.mailchimp.com/3.0/lists/8a6c93c210";

  const options = {
    method: "POST",
    auth: "Sasi:d636e9f275f725f9f41f685c8e6880c5-us8"
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      if(response.statusCode == 200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }
      console.log(JSON.parse(data));
    });
  });

  request.write(jsondata);
  request.end();

});

app.listen(process.env.PORT||3000, function() {
  console.log("Server running on port 3000.");
});



// api key
// d636e9f275f725f9f41f685c8e6880c5-us8

//listid
//8a6c93c210
