const fs = require("fs");
const express = require("express");
var multer = require("multer");

const app = express();

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./data");
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage: storage }).single("jsonfile");

app.use(express.static("public"));

app.get("/:file", (req, res) => {
  const file = req.params["file"];
  fs.readFile(__dirname + "/data/" + file + ".json", (err, data) => {
    if (err) {
      return res.status(404).json({ message: "File not found" });
    }
    const jsonData = JSON.parse(data);
    res.status(200).json(jsonData);
  });
});

app.post("/upload", function(req, res) {
  upload(req, res, function(err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});

const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
