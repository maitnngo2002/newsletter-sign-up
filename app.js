const express = require("express");

const https = require("https");

const app = express();

require('dotenv').config();

console.log(process.env);

app.use(express.urlencoded({extended: true}));

// code to load static file
// app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendFile(__dirname  + "/signup.html");

});

app.post('/', function(req, res) {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const emailAddress = req.body.EmailAddress;

    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/a7d3226109";
    const API_KEY = process.env.API_KEY;
    
    const options = {
        method: "POST",

        // auth format: yourname + ":" + your api key
        auth: "maingo:" + API_KEY

    }
    
    console.log(options);
    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            receivedData = JSON.parse(data)
            console.log(receivedData);
        if (receivedData.error_count == 0) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        })
    });
    
    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server running at port 3000");
});
