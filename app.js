const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main().then (() =>{
    console.log("connected to DB");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/", (req, res) =>{
    res.send("Hi, I am root");
});

// Sample Listings
// app.get("/testListing", async(req, res) =>{
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1000000,
//         location: "Patna, Bihar",
//         country: "India",
//     });
//     await sampleListing.save();  //.save return promises
//     console.log("Sample was Saved");
//     res.send("Successful testing");
// });

// index Route
app.get("/listings", async(req, res) =>{
    const allListings = await Listing.find({});
    console.log(allListings);
    res.render("listings/index.ejs", { allListings });
});

// New Route
app.get("/listings/new", async(req, res) =>{
    res.render("listings/new.ejs");
});

// Show Route
app.get("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});   // render -> Show or display
});

// Create Route
app.post("/listings", async(req, res) =>{
    // let {title, description, image, price, location, country} = req.body;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    console.log(listing);
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async(req, res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
});

// Update Route
app.put("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    let updateListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});   // Spread Operator
    // console.log(updateListing);
    res.redirect(`/listings/${id}`);
});

// Delete Route 
app.delete("/listings/:id", async(req, res) =>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

const port = 8080;
app.listen(8080, () =>{
    console.log(`Server is listening to port ${port}`);
});