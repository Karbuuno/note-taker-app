// all dependencies
const fs = require("fs");
const express = require("express");
const path = require("path");
const { uuid } = require("uuidv4");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// reading data
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// getting data json json file
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
// creating data using post request
app.post("/api/notes", (req, res) => {
  let newNote = {
    id: uuid(),
    title: req.body.title,
    text: req.body.text,
  };
  // reading dta form json file
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;

    let newData = JSON.parse(data);

    newData.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(newData), err => {
      if (err) throw err;

      res.send("successfully added");
    });
  });
});
// deleting data
app.delete("/api/notes/:id", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let id = req.params.id.toString();

  deletedNote = notes.filter(note => {
    return note.id != id;
  });

  fs.writeFileSync("./db/db.json", JSON.stringify(deletedNote));
  res.json(deletedNote);
});

//Server listening
app.listen(PORT, () => console.log(`Server listening on port ${PORT} `));
