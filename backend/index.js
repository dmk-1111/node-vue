const express = require('express');
const db = require('./src/config/db/connection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const userRouter = require('./src/routes/user.routes');
const contactRouter = require('./src/routes/contact.routes');

db(app); // Connect to the database

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use('/api/auth', userRouter); // Use the user routes
app.use('/api/contact', contactRouter); // Use the contact routes