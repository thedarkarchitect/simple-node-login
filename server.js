import express from 'express';
import morgan from 'morgan';
import * as path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;
const hardcodedPassword = 'Ineedajob'; // Replace with your actual password
const isLogined = false;
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

//middle ware
// Use Morgan for logging requests
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Create "Public" folder
app.use(express.static(path.join(__dirname, 'Public')));

// Route for "/" (serves login.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'login.html'));
});

// Route for "/login" (handles password verification)
app.post('/login', (req, res) => {
  const enteredPassword = req.body.password;
  console.log(enteredPassword)

  if (enteredPassword === hardcodedPassword) {
    // Password matches, redirect to /course
    isLogined = true;
    res.redirect('/course');
  } else {
    // Password doesn't match, send an error message
    res.status(401).send('Invalid password');
  }
});

// Route for "/course" (serves node-course.html, but requires authentication)
app.get('/node-course', (req, res) => {
  if (isLogined) {
    res.sendFile(path.join(__dirname, 'Public', 'node-course.html'));
} else {
  res.redirect('/');
}
});

// Redirect to /login if a user tries to access /course without authentication
// app.get('/node-course', (req, res) => {
//   res.redirect('/login');
// });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
