const express = require('express');
const db = require('./src/config/db/connection');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const userRouter = require('./src/routes/user.routes');
const contactRouter = require('./src/routes/contact.routes');

db(app); // Connect to the database

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})); // Enable CORS for all routes
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json()); // Parse JSON request bodies
app.use('/api/auth', userRouter); // Use the user routes
app.use('/api/contact', contactRouter); // Use the contact routes