const express=require('express');
const passport = require('passport');
const router=express.Router();
const User=require('../models/user');


// router.get('/fakeuser',async (req,res)=>{
//     const user=new User({
//         username:'sabeel',
//         email:'manan0044.cse19@chitkara.edu.in'
//     });
//     const newUser=await User.register(user,'1234');
//     res.send(newUser);
// });

router.get('/register',(req,res)=>{
    res.render('auth/signup');
});


router.post('/register',async (req,res)=>{
    try{
        const {username,email,password}=req.body;
    const user=new User({
        username:username,
        email:email
    });
    await User.register(user,password);
    req.flash('success',`Welcome ${username},Please Login`)
    res.redirect('/products');
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
});

router.get('/login',(req,res)=>{
    res.render('auth/login');
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login',
                                   failureFlash: true }),(req,res)=>{
                                       const {username}=req.user;
                                       console.log(username);
                                       req.flash('success','Welcome Back again!');
                                       res.redirect('/products');
                                   }
);


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Successfully LogOut');
    res.redirect('/login');
});

module.exports=router;