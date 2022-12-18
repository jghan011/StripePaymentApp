const express = require("express");
const stripe = require("stripe")(process.env.PRIVATE_APIKEYS);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();

// Handlebars Middleware
//Handlebars is a simple templating language. It uses a template and an input object to generate HTML or other text formats.
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" })); //the layout that wraps around uor views should be called main
app.set("view engine", "handlebars"); //setting the view engine to handlebar

// Body Parser Middleware for like post and what not
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // will create req.body
//req.body object allows you to access data in a string or JSON object from the client side

// It parses incoming requests with urlencoded payloads and is based on body-parser.

///Set Static Folder
app.use(express.static(`${__dirname}/public`)); //the ffolder name public will be set as static folder

//Index Route below
// Middleware is software that lies between an operating system and the applications running on it
app.get("/", (req, res) => {
  res.render("index"); //will render a template but before this can work you must add a middleware
});

// Charge Route
// Charge Route
app.post("/charge", (req, res) => {
  //when they click the charge button that we set up in he index.handlebars
  const amount = 2500;
  console.log(req.body);
  // will return something that looks like {
  // stripeToken: tok_1Blwvwfvlvlv...
  // strikeTokenType: card
  //stripeEmail: "whatevertheemailis@gmail.com"
  // }

  //we create the customer below and it gives backa promise whch we use
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Web Development Ebook",
        currency: "usd",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success"));
});
//the above will add the customer and then  charge the customer
const port = process.env.PORT || 5000;

// start the server to listen the encrypted connection.
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//we will have a index page and a success page
