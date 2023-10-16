//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
const saltRounds=10;

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

app.post("/register", function(req,res){
    bcrypt.hash(req.body.password, saltRounds,async function(err, hash) {
        const newUser= new User({
            email: req.body.username,
            password: hash
        });
    
        try{
            await newUser.save();
    
            res.render("secrets");
        }
        catch(error){
            console.log(error);
        }
    });
});

app.post("/login", async function(req,res){
    const username= req.body.username;
    const password= req.body.password;

    try{
        const foundUser= await User.findOne({email: username});
        //console.log(foundUser.email);

        /*if(foundUser.password === password){
            console.log(`${username} User verified.`);
            res.render("secrets");
        }
        else{
            console.log(`Error authentication failed!`);
        }*/

        bcrypt.compare(password, foundUser.password, function(err, result) {
            // result == true
            if(result==true){
                console.log(`${username} User verified.`);
                res.render("secrets");
            }
            else{
                console.log(`Error authentication failed!`);
            }
        });
    }
    catch(error){
        console.log(error);
    }
});

app.listen(port, function(){
    console.log(`Server started on port ${port}.`);
});