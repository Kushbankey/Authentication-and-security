//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose"
import encrypt from "mongoose-encryption";

const port=3000;
const app= express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema= new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User= new mongoose.model("User", userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", async function(req,res){
    const newUser= new User({
        email: req.body.username,
        password: req.body.password
    });

    try{
        await newUser.save();

        res.render("secrets");
    }
    catch(error){
        console.log(error);
    }
});

app.post("/login", async function(req,res){
    const username= req.body.username;
    const password= req.body.password;

    try{
        const foundUser= await User.findOne({email: username});
        //console.log(foundUser.email);

        if(foundUser.password === password){
            console.log(`${username} User verified.`);
            res.render("secrets");
        }
        else{
            console.log(`Error authentication failed!`);
        }
    }
    catch(error){
        console.log(error);
    }
})

app.listen(port, function(){
    console.log(`Server started on port ${port}.`);
});