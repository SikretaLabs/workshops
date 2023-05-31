const express = require('express');
const Model = require('../models/model');
const Posts = require('../models/posts');
const Comments = require('../models/comments');
const Logs = require('../models/logging');
const Categories = require('../models/categories');
const jwt = require('jsonwebtoken');
const router = express.Router()

const DetectCORSOriginBug = async (req ,res, next) => {
    const authHeader = req.get('Origin');
    if (authHeader) {
        if(authHeader == "http://localhost:3000" || authHeader == "https://localhost:3000" || authHeader == "http://localhost:3000/" || authHeader == "https://localhost:3000/"){
            next();
        }else{
            res.json({"flag": "Flag{You_F0und_CORS_Vuln_Super4b}"});
        }
    }else{
        next();
    }
}

router.get('/blog/users', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.find({}, { __v: 0, password: 0, ccexp: 0, ccnumber:0, cvc:0});
        res.json(data);
    }
    catch(error){
        res.json({error: "unable to process request."});
    }
});

router.get('/blog/users/:uid', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.findOne({
            _id: req.params.uid
        }, {_id: 0, __v: 0, password:0, ccexp:0, ccnumber:0, cvc:0 });
        if(data){
            res.json(data);
        }else{
            res.json({error: "user profile do not exsit."});
        }
    }
    catch(error){
        res.json({error: "user profile do not exsit."});
    }
});

router.get('/me/profile', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.findOne({
            username: req.auth.username
        }, {_id: 0, __v: 0, password:0});
        if(data){
            res.json(data);
        }else{
            res.json({error: "user profile do not exsit."});
        }
    }
    catch(error){
        res.json({error: "user do not exsit."});
    }
});

router.get('/me/profile/card/:uid', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.findOne({
            _id: req.params.uid
        }, {_id: 0, __v: 0, password:0, email:0, subscribers:0,level:0,username:0});
        if(data){
            let masked = data.ccnumber;
            res.json({ccnumber: "****" + masked.substr(-4), cvc: data.cvc, exp: data.ccexp})
        }else{
            res.json({error: "user billing profile do not exsit."});
        }
    }
    catch(error){
        res.json({error: "user do not exsit."});
    }
});

router.post('/me/profile', DetectCORSOriginBug, async (req, res) => {
    // simulate Mass Assignment here but with restrection to avoid password reset
    try{
        const data = await Model.findOneAndUpdate({
            username: req.auth.username
        }, req.body);
        if(req.body.level || req.body.subscribers){
            res.json({message: "profile has been updated.", flag: "Flag{Ma4ss_Assim3nt_!s_Easy}"});
        }else{
            res.json({message: "profile has been updated."});
        }
    }
    catch(error){
        res.json({error: "unable to process request."});
    }
});

router.post('/me/password', DetectCORSOriginBug, async (req, res) => {
    // simulate Mass Assignment here but with restrection to avoid password reset
    try{
        if(req.body.pwd == ""){
            res.status(200).json({error: "invalid password provided."});
        }else{
            const data = await Model.findOneAndUpdate({
                email: req.body.email
            }, {'pwd': req.body.pwd});
            res.json({message: "password has been updated."});
        }
    }
    catch(error){
        res.json({error: "unable to process request."});
    }
});

router.post('/me/profile/card', DetectCORSOriginBug, async (req, res) => {
    try{
        if(req.body.ccnumber == "" || req.body.cvc == "" || req.body.ccexp == ""){
            res.status(200).json({error: "invalid card information provided."});
        }else{
            const data = await Model.findOneAndUpdate({
                username: req.auth.username
            }, {ccnumber: req.body.ccnumber, ccexp: req.body.ccexp, cvc: req.body.cvc});
            res.json({message: "billing has been updated."});
        }
    }
    catch(error){
        res.json({error: "unable to process request."});
    }
});

router.post('/signup', DetectCORSOriginBug, async (req, res) => {
        try {
            const currentReq = await Model.findOne({
                username: req.body.username,
            }, {_id: 0, __v: 0});
            if(currentReq){
                res.status(200).json({error: "user already exsit."});
            }else{
                const data = new Model({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    subscribers: 0,
                    level: "user"
                })
                const dataToSave = await data.save();
                res.status(200).json({message: "ok"});
            }
        }
        catch (error) {
            res.status(400).json({error: "unable to process request."});
        }
});

router.post('/dev/token', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.findOne({
            username: req.body.username
        }, {_id: 0, __v: 0});
        var token = jwt.sign({ username: req.body.username, level: 'user' }, 'secret', { expiresIn: '1h' });
        res.json({"token": token, "data": data, "expiresIn": Math.floor(Date.now() / 1000) + (60 * 60)});
    }
    catch(error){
        res.json({error: "user do not exsit."})
    }
});

router.post('/reset_pwd', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Model.findOne({ username: req.body.username });
        if(currentReq){
            res.status(200).json({message: "reset email sent."});
        }else{
            res.status(200).json({error: "could not find such user."});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.post('/login', DetectCORSOriginBug, async (req, res) => {
    try {
        const checkUser = await Model.findOne({username: req.body.username });
        if(checkUser){
            const currentReq = await Model.findOne({ $and: [{ username: req.body.username }, { password: req.body.password }] });
            if(currentReq){
                // The JWT doesn't expire
                var token = jwt.sign({ uid: currentReq._id, username: req.body.username, level: 'user' }, 'secret', { expiresIn: '365d' });
                res.json({"token": token, uid: currentReq._id, expiresIn: '365d'});
            }else{
                res.status(200).json({error: "The password is incorrect."});
            }
        }else{
            res.status(200).json({error: "User not found."});
        }
        
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.get('/posts', DetectCORSOriginBug, async (req, res) => {
    try {
        if(req.query.limit > 50){
            res.status(200).json({flag: "Flag{vEryLargeStuff}"});
        }else{
            if(!req.query.limit){
                currentReq = await Posts.find({}, {__v:0}, {});
            }else{
                currentReq = await Posts.find({}, {__v:0}, {limit: req.query.limit});
            }
            res.status(200).json(currentReq);
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.get('/categories', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Categories.find({}, {__v:0}, {limit: req.query.limit});
        res.status(200).json(currentReq);
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.post('/admin/categories', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Categories.findOne({
            title: req.body.title,
        }, {_id: 0, __v: 0});
        if(currentReq){
            res.status(200).json({error: "category already exsit."});
        }else{
            const data = new Categories({
                title: req.body.title
            });
            const dataToSave = await data.save();
            res.status(200).json({message: "ok"});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.post('/publish', DetectCORSOriginBug, async (req, res) => {
    console.log(req.auth.username);
    try {
        const currentReq = await Posts.findOne({
            title: req.body.title,
        }, {_id: 0, __v: 0});
        if(currentReq){
            res.status(200).json({error: "post already published."});
        }else{
            const data = new Posts({
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                author: req.auth.username,
                authorId: req.auth.uid,
                published: req.body.published
            })
            const dataToSave = await data.save();
            res.status(200).json({message: "ok"});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.delete('/posts/:id', DetectCORSOriginBug, async (req, res) => {
    res.status(200).json({flag: "Flag{Classi7_Brok3n_Lvl_F3nction}"});
});

router.get('/posts/:id', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Posts.findOne({
            _id: req.params.id,
        }, {_id: 0, __v: 0});
        if(currentReq){
            res.status(200).json(currentReq);
        }else{
            res.status(200).json({error: "no post was found."});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.get('/posts/comments/:id', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Comments.find({
            postId: req.params.id,
        }, {_id: 0, __v: 0});
        if(currentReq.length < 1){
            res.status(200).json({error: "no comments were found."});
        }else{
            res.status(200).json(currentReq);
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

/** Here you can delete other's users posts even if JWT is yours! */
router.delete('/admin/posts/:id', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Posts.findByIdAndDelete({
            _id: req.params.id,
        });
        if(currentReq){
            res.status(200).json({message: "ok"});
        }else{
            res.status(200).json({error: "could not find such post."});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.post('/logging', async (req, res) => {
    try {
        // const data = new Logs({
        //     event: req.body.event,
        // })
        // const dataToSave = await data.save();
        var whitelist = ['user profile updated','user password updated','new account has been created','logged in','user password updated','logged failed']
        if (whitelist.indexOf(req.body.event) !== -1) {
            res.status(200).json({message: "log updated."});
        }else{
            res.status(200).json({flag: "Flag{B4d_N0t_check_L0gs_In4gti7}"});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.post('/posts/:id/replay', DetectCORSOriginBug, async (req, res) => {
    try {
        const data = new Comments({
            postId: req.params.id,
            msg: req.body.msg,
            author: req.auth.username,
            authorId: req.auth.uid
        })
        const dataToSave = await data.save();
        res.status(200).json({message: "comment published."});
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

router.delete('/admin/posts/comments/:id', DetectCORSOriginBug, async (req, res) => {
    try {
        const currentReq = await Comments.deleteMany({
            postId: req.params.id,
        });
        if(currentReq){
            res.status(200).json({message: "ok"});
        }else{
            res.status(200).json({error: "could not find such comment."});
        }
    }
    catch (error) {
        res.status(400).json({error: "unable to process request."});
    }
});

module.exports = router;