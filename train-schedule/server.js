const express = require("express");

const app = express();

const port = 5000;
const router = require("./routes/router");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const cache = {};

app.use((req, res, next) => {
    req.app.locals.cache = cache;
    next();
  });

app.use('/', router);
app.listen(port,()=>{
    console.log(`Server started at ${port}`);
})