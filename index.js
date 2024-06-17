import express from "express";
import bodyParser from "body-parser";
import { dirname} from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import fs from 'fs';
import path from 'path';



const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const postsFilePath = path.join(__dirname, 'posts.json');
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));
//whenever we set the parameter _method in any form it's going to override the method that we put

// Function to read articles from posts.json
const readArticles = () => {
    try {
      const data = fs.readFileSync(postsFilePath, 'utf8');
      const articles = JSON.parse(data);
      return articles.map(article => ({
        ...article,
        createDate: new Date(article.createDate)
      }));
    } catch (err) {
      console.error("Error reading posts.json:", err);
      return [];
    }
  };
  
  // Function to write articles to posts.json
  const writeArticles = (articles) => {
    try {
      fs.writeFileSync(postsFilePath, JSON.stringify(articles, null, 2), 'utf8');
    } catch (err) {
      console.error("Error writing to posts.json:", err);
    }
  };
  
// Initialize articles from the JSON file
let articles = readArticles();

app.get("/", (req,res) => {
    res.render("home.ejs" ); 
});

app.get("/about", (req,res) =>{
    res.render("about.ejs");
});

//we want to pass all of our articles to this index
app.get("/posts", (req,res) => {
    //to do that we'll pass an object to render
    res.render("posts.ejs",{articles});//this object will be available in posts.ejs
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
        paragraph: req.body.post
    };
    articles.push(newArticle);  // Add the new article to the array
    writeArticles(articles);  // Write the updated array back to posts.json
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

app.get('/edit/:index', (req, res) => {
//This line defines a GET route in your Express application.
//When a user navigates to /edit/<some_index>,
// this route will be triggered.

/*:index is a route parameter,
 meaning it will capture whatever value is in that part of the URL 
 and make it available in req.params
*/
    const index = req.params.index; //This line extracts the index parameter from the request's URL
/*
req.params is an object containing all route parameters.
 Here, we specifically grab index.
 */

 /*This line uses the extracted index to find the corresponding
  article in the articles array.
 */
    const article = articles[index];
/*This line renders the edit.ejs template,
 passing the article and index as variables to the template.
 */
    res.render('edit.ejs', {article, index});
});

app.post('/save/:index', (req,res) => {
    const index = req.params.index;
    articles[index] = {
    title: req.body.title,
    paragraph: req.body.paragraph
  }; //This line updates the article at the specified index in the articles array.
  writeArticles(articles);
  res.redirect('/posts');
});

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});