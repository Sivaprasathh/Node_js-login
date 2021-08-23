const express = require("express")
const app = express()
const mongoose = require("mongoose")
const allRoutes = require("./routes/index")
const session = require('express-session')
require("dotenv").config();

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}
const url = process.env.MONGODB_URL;
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
.then(()=>console.log("connected to db!"))
.catch((err)=>console.log(err));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(session(
    { secret: 'secret',
     cookie: { maxAge: 60000 },
     resave: false,
     saveUninitialized: false,
     name:"my-session"
    }))

app.use("/", allRoutes)
app.listen(process.env.PORT || 4000, ()=>console.log("Server is Running..."))