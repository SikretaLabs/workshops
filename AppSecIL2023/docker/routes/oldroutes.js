const express = require('express');
const Model = require('../models/model');
const Posts = require('../models/posts');
const Comments = require('../models/comments');
const Categories = require('../models/categories');
const jwt = require('jsonwebtoken');
const router = express.Router()

const DetectCORSOriginBug = async (req ,res, next) => {
    const authHeader = req.get('Origin');
    if (authHeader) {
        res.json({"flag": "Flag{You_F0und_CORS_Vuln_Super4b}"});
    }else{
        next();
    }
}

router.get('/blog/users', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.find({}, { __v: 0, ccexp: 0, ccnumber:0, cvc:0});
        res.json(data);
    }
    catch(error){
        res.json({error: "unable to process request."});
    }
});

router.get('/me/profile/card/:uid', DetectCORSOriginBug, async (req, res) => {
    try{
        const data = await Model.findOne({
            _id: req.params.uid
        }, {_id: 0, __v: 0, password:0, email:0, subscribers:0,level:0,username:0});
        if(data){
            let masked = data.ccnumber;
            res.json({masked: "****" + masked.substr(-4), flag: "Flag{That2_R3lly_C00l_S7ff_Legac7}", ccnumber: data.ccnumber, cvc: data.cvc, exp: data.ccexp})
        }else{
            res.json({error: "user billing profile do not exsit."});
        }
    }
    catch(error){
        res.json({error: "user do not exsit."});
    }
});

module.exports = router;