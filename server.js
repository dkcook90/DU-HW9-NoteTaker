const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid')

const app = express();
const PORT = 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/db/db.json'))
);

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body

    if (title && text) {

        const newNote = {
            title,
            text,
            id: uuid()
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFileSync('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) => writeErr ? 
                console.log(writeErr) : 
                console.log('Note Saved'));
            }
        });
    }

    res.sendFile(path.join(__dirname, '/db/db.json'))
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);