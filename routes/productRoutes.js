const express=require('express');
const { findById } = require('../models/product');
const router=express.Router();
const Product=require('../models/product');
const Review=require('../models/review');
const {isLoggedIn}=require('../middleware');


router.get('/products',async(req,res)=>{
   const products= await Product.find({});

    res.render('./products/index',{products});
});

router.get('/products/new', (req,res)=>{
    res.render('./products/new');
})

router.post('/products', isLoggedIn,async (req,res)=>{
    const newProduct={
        ...req.body
    }
    await Product.create(newProduct);
    req.flash('success','Successfully created new product');
    res.redirect('/products');
});

router.get('/products/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const product= await Product.findById(id).populate('reviews');
    console.log(product);
    res.render('./products/show',{product});
    }
    catch(e)
    {
        req.flash('error','Oops, Something went wrong!!');
        res.redirect('/error');
    }
});


router.get('/products/:id/edit', async(req,res)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    res.render('./products/edit',{product});
});

router.patch('/products/:id', async(req,res)=>{
    const updatedproduct=req.body;
    // const updatedproduct=
    const {id}=req.params;
    await Product.findByIdAndUpdate(id,updatedproduct);
    res.redirect('/products');
});

router.delete('/products/:id', async(req,res)=>{
    const {id}=req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products');
});

router.post('/products/:id/review',isLoggedIn,async(req,res)=>{
   
    const {id}=req.params;
    const product=await Product.findById(id);
    console.log(req.body);
    const {rating,comment}=req.body;
    const insertreview=new Review({rating,comment,user:req.user.username});
    product.reviews.push(insertreview);
    await product.save();
    await insertreview.save();
    req.flash('success','Successfully created review');
    res.redirect(`/products/${id}`);

})


module.exports=router;