const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"))

// connect to database 
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Articles = new mongoose.model("article", articleSchema)


// calling the api data 
app.route('/article')

    .get((req, res) => {
        Articles.find().then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err);
        });
    })

    .post((req, res) => {
        console.log(req.body);
        console.log(req.body.content);

        const add1 = Articles({
            title: req.body.title,
            content: req.body.content,
          });

        add1.save().then((result) => {
            console.log("added: "+result);
        }).catch((err) => {
            console.log(err);
        });
    })

    .delete((req, res) => {
        Articles.deleteMany().then((result) => {
            console.log("deleted");
        }).catch((err) => {
            console.log(err);
        });
    });

app.route('/article/:title')
    .get((req, res) => {
        Articles.findOne({
            title:req.params.title
        }).then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err)
        });
    })

    .put((req,res)=>{
        Articles.updateOne(
            {title:req.params.title},
            {title:req.body.title, content:req.body.content}
        ).then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err);
        });
    })
    
    .patch((req,res)=>{
        console.log(req.body);
        Articles.updateOne(
            {title:req.params.title},
            {$set: req.body}
        ).then((result) => {
            res.send(result)
        }).catch((err) => {
            console.log(err);
        });
    })

    .delete((req,res)=>{
        Articles.deleteOne({
            title:req.params.title
        }).then((result) => {
            console.log("deleted")
        }).catch((err) => {
            console.log("err");
        });
    })


app.listen(3000, () => {
    console.log("app is listen at port 3000");
})