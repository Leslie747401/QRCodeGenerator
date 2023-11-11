import express from "express";
import bodyParser from "body-parser";
import q from "qr-image";
import fs from "fs";
import urlparse from "url-parse";

const app = express();
const port = 3000;
var url_link , parsedUrl , domain , parts ,extractedDomain ;


app.use(bodyParser.urlencoded({extended : true}));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.use(express.static("public"));

app.post("/submit" , (req,res) => {

  url_link = req.body["URL"];          // https://www.youtube.com

  parsedUrl = urlparse(url_link);    // https://www.youtube.com/

  domain = parsedUrl.hostname;       //www.youtube.com

  parts = domain.split(".");        // [www,youtube,com]

  extractedDomain = parts[1];       // youtube

  var url_image = q.image(url_link);
  url_image.pipe(fs.createWriteStream(`./public/${extractedDomain}_QR_Code.png`));

  res.render("index.ejs" , {
    New_QR : `./${extractedDomain}_QR_Code.png`,
  });

});


app.get("/download" , (req,res) => {
  
  res.download(`./public/${extractedDomain}_QR_Code.png`);

});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
