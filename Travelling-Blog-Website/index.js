import express from "express";
import bodyParser from "body-parser";
import { dirname} from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";


const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));
//whenever we set the parameter _method in any form it's going to override the method that we put

app.get("/", (req,res) => {
    res.render("home.ejs" ); 
});

app.get("/about", (req,res) =>{
    res.render("about.ejs");
});

var articles = [];
//we want to pass all of our articles to this index
app.get("/posts", (req,res) => {
    //to do that we'll pass an object to render
    res.render("posts.ejs",{articles: articles});//this object will be available in posts.ejs
});

app.get("/new", (req,res) => {
    res.render('new.ejs');
});

app.get('/cancel', (req,res) => {
    res.redirect("/");
});

app.post('/new-post', (req,res) =>{
    const newArticle = {
        //id: req.body.id++,
        title: req.body.title,
        createDate: new Date(),
        paragraph: req.body.post
    };
    articles.push(newArticle);
    console.log("articles", articles);
    res.redirect("/posts");
});

app.post('/delete-article/:index', (req, res) => {
    const index = parseInt(req.params.index); // Extract index from request parameters
    if (index >= 0 && index < articles.length) {
        articles.splice(index, 1);
        res.redirect('/posts');
    } else {
        res.status(404).send('Article not found.'); // Send a not found response
    }
});

app.post('/edit-article/:index', (req, res) => {
    const index = parseInt(req.params.index); // Extract index from request parameters
    if (index >= 0 && index < articles.length) {
        // Update the article with the edited data from the form
        articles[index].title = req.body.title;
        articles[index].paragraph = req.body.paragraph;
        res.redirect('/posts'); // Redirect to the posts page
    } else {
        res.status(404).send('Article not found.'); // Send a not found response
    }
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});