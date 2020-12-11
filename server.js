const express = require('express');
const app = express()
const PORT = process.env.PORT || 3001;
const path = require('path');
const notes = require('./db/db.json')
const fs = require("fs")
const uniqid = require('uniqid');

// parse inc. string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// make data in 'public' available to the server
app.use(express.static('public'));

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

// API routes
app.get('/api/notes', (req, res) => {
  const result = notes
  res.json(result)
});

app.post('/api/notes', (req, res) => {
  req.body.id = uniqid();

  const note = req.body
  notes.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({notes}, null, 2)
  )
  res.json(note)
})

app.delete('/api/notes/:id',function(req,res){
  const id = req.params.id;
  for (i = 0; i < notes.length; i++){
    if (notes[i].id === id) {
      notes.splice(i,1);
    }
  }
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({notes}, null, 2)
  )
  res.send(notes)
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
})

