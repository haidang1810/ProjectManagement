const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('../config/database.config');
const route = require('./routes/index.router');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 3000;
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: null } }));

route(app);
db.connect();

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
