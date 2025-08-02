const express = require("express");
const { UserModel , TodoModel} = require("./db");           // Importing the Schema Models from db.js
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { auth , JWT_SECRET } = require("./auth");            // Importing auth middleware from auth.js
const bcrypt = require("bcrypt");

mongoose.connect("mongodb+srv://avshete100:sam23102001@cluster0.bktll1t.mongodb.net/todo_app_db");
const app = express();
app.use(express.json());

app.post("/signup", async (req, res)=> {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        const hashedPassword = await bcrypt.hash(password,5);

        await UserModel.create({
            email: email,
            password: hashedPassword,           // Using bcrypt lirary to hash the password.
            name: name
        })

        res.json({
            message:"You are Signed Up."
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error signing up user" });
      }
});


app.post("/signin", async (req, res)=> {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await UserModel.findOne({
            email: email,
        })

        if(!user){
            res.status(403).json({
            message:"User does not exist."
            })
            return
        }

        const passwordMatch = await bcrypt.compare(password,user.password);

        if(passwordMatch){
            const token = jwt.sign({
                id: user._id.toString()
            },JWT_SECRET);
            res.header("jwt",token);
            res.json({
                token: token
            });
        }
        else{
            res.status(403).json({
                message:"Invalid Credentials"
            })
        }}
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error signing in user" });
    }
});


app.post("/todo", auth, async (req, res)=> {
    try{    
        const userID = req.userID;
        const title = req.body.title;
        const done = req.body.done;

        await TodoModel.create({
            title,
            done,
            userID
        });
        res.json({
            userID: userID
        })
    } 
    catch(e){
        console.log(error);
        res.status(500).json({ error: "Couldn't create todo..." });
    }
});


app.get("/todos", auth, async (req, res) => {
    try {
      const userId = req.userId;
      const todos = await TodoModel.find({ userId });
  
      if (todos.length === 0) {
        res.status(404).json({ message: "No todos found for this user" });
      } else {
        res.json({ todos });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Couldn't get todos..." });
    }
  });

app.listen(3000);