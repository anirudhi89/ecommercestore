var express = require('express');
var app = express();
var mongoose = require('mongoose');
// const product = require('./model/product');
var db = mongoose.connect('mongodb://localhost/shop');

var Product = require('./model/product');
const wishlist = require('./model/wishlist');
var Wishlist = require('./model/wishlist')


app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/product', (req, res)=>{
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function(err, savedProduct) {
        if (err) {
            res.status(500).send({error:"Could not save"})
        } else {
            res.send(savedProduct);
        }
    })
})

app.get('/product', (req, res) => {
    Product.find({}, function(err, success) {
        if (err) {
            res.status(500).send({error:"Error"})
        } else {
            res.send(success);
        }
    })
    //
})

app.post('/wishlist', (req, res) => {
    var wishlist = new Wishlist();
    
    wishlist.title = req.body.title;

    wishlist.save(function(err, savedList) {
        if (err) {
            res.status(580).send({error:"Can't create list"})
        } else {
            res.send(savedList)
        }
    })
})

app.put('/wishlist/add', (req, res) => {
    Product.findOne({_id: req.body.productId}, (err, product) =>{
        if (err) {
            res.status(580).send({error:"Can't add to list"})
        } else {
            Wishlist.updateOne({_id:req.body.wishlistID}, {$addToSet: {products: product._id}}, (err, savedList)=> {
                if (err) {
                    res.status(580).send({error:"Can't update list"})
                } else {
                    res.send(savedList)
                }
            })
            res.send(product)
        }
    })
    // wishlist.product.title = req.body.product.title;
    // wishlist.product.price = req.body.product.price;

    
})

app.get('/wishlist', (req, res) => {
    wishlist.find({}).populate({path:'products', model: 'Product'}).exec((err, wishlist) => {
        if (err) {
            res.status(580).send({error:"Can't fetch list"})
        } else {
            res.send(wishlist)
        }
    })
})


app.listen(3000, () => {
    console.log('Done - port 3000');
})
