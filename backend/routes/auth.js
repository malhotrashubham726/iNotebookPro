const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'J$W%T S9E/C6R4E*T';
let success;

//Route 1: Create a user using POST request '/api/auth/createuser'. Doesn't require Auth
router.post('/createuser', [
    body('name',"Enter a valid name").isLength({min : 3}),
    body('email',"Enter a valid email").isLength({min : 5}),
    body('password',"Length of password must be 5 characters").isLength({min : 5}),
] , async(req,res) => {
    success=false;
    //If there are errors,return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()});
    }

    //Check whether the user with this email already exists
    try {
        let user = await User.findOne({ email : req.body.email});
        if(user) {
            return res.status(400).json({error : "Sorry the user with this email id already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password , salt);

        //Create a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        /*.then((user) => {
            res.json(user);
        }).catch((err) => {
            console.log(err);
            res.json({error : "Please enter a unique value for email", message : err.message})
        })*/

        const data = {
            user:{
                id : user.id
            },
        }
        const authToken = jwt.sign(data, JWT_SECRET);

        success = true;
        res.json({success,authToken });
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }


})

//Route 2: Authenticate a User using: POST "/api/auth/login".No login required
router.post("/login",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
], async(req,res) => {
    success=false;

    const errors = validationResult(req);
    if(!errors.isEmpty) {
        return res.status(400).json({errors : errors.array()})
    }

    const {email , password} = req.body;
    try {
        let user = await User.findOne({email : email });
        if(!user) {
            return res.status(400).json({error : "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        console.log(passwordCompare);
        if(!passwordCompare) {
            return res.status(400).json({ success, error : "Please try to login with correct credentials2"});
        }

        const payload = {
            user : {
                id : user.id
            }
        }

        const authToken = jwt.sign(payload,JWT_SECRET);
        success=true;
        res.json({ success, authToken });
    }

    catch(error) {
        return res.status(500).send("Internal server error occured");
    }
})

//Route 3: Get loggedin user details using POST '/api/auth/getuser'.Login required
router.post('/getuser',fetchuser,async(req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router