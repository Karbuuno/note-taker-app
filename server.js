const fs = require("fs");
const express = require("express");
const path = require("path");
const { uuid } = require("uuidv4");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", (req, res) => {
  let newNote = {
    id: uuid(),
    title: req.body.title,
    text: req.body.text,
  };

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

app.delete("/api/notes/:id", (req, res) => {
  let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let id = req.params.id.toString();

  noteList = noteList.filter(selected => {
    return selected.id != id;
  });

  fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
  res.json(noteList);
});

//listen tot he port when deployed
app.listen(PORT, () => console.log(`Server listening on port ${PORT} `));
