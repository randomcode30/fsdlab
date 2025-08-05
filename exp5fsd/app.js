
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const { Http2ServerRequest } = require('http2');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
 host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'eventdb'});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.redirect('/form.html');
});

app.post('/create', (req, res) => {
    const { name,date,location} = req.body;
    const sql = 'INSERT INTO events (name, date, location) VALUES (?, ?, ?)';
    db.query(sql, [name, date, location], (err, result) => {
        if (err) throw err;
        res.redirect('/events');
    });
});

app.get('/events', (req, res) => {
    db.query('SELECT * FROM events', (err, results) => {
        if (err) throw err;
        let html = '<h2>All Events</h2> <a href="/form.html">Add New Event</a><ul>';
        results.forEach(event => {
            html += `<li>
            ${event.name} - ${event.date} - ${event.location}
            <a href="/edit/${event.id}">Edit</a> |
            <a href="/delete/${event.id}">Delete</a>
            </li>`;
        });
        html += '</ul>';
        res.send(html);
    });
}); 

// Edit event form
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM events WHERE id = ?', [id], (err, results) => {
    if (err) throw err;

    const event = results[0];
    const html = `
      <h2>Edit Event</h2>
      <form action="/update/${event.id}" method="POST">
        <input type="text" name="name" value="${event.name}" required><br>
        <input type="date" name="date" value="${event.date.toISOString().split('T')[0]}" required><br>
        <input type="text" name="location" value="${event.location}" required><br>
        <button type="submit">Update</button>
      </form>
    `;
    res.send(html);
  });
});

// Update event
app.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, date, location } = req.body;
  db.query(
    'UPDATE events SET name = ?, date = ?, location = ? WHERE id = ?',
    [name, date, location, id],
    (err) => {
      if (err) throw err;
      res.redirect('/events');
    }
  );
});

// Delete event
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM events WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/events');
  });
});

// Server start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
