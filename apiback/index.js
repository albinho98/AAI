const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User =require('./models/User.js');
const  bycrypt = require('bycryptjs');
const  jwt = require('jsonwebtoken');
const CookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();

const bycryptSalt = bycrypt.genSaltSync(10);
const jwtSecret = 'hfhdujkhsjghsdjkghjk'
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173/'
}));


mongoose.connect(process.env.MONGO_URL);

app.get('/test',(req,res) =>{
    res.json('test ok');
});

app.post('/register', async (req,res)=>{
    const {vorname,nachname,email,password,geburtsdatum} = req.body;
    try {
        const userDoc = await User.create({
            vorname,
            nachname,
            email,
            password: bycrypt.hashSync(password, bycryptSalt),
            Geburtsdatum,
        })
        res.json({userDoc});
    }catch (e) {
        res.status(422).json(e);
    }
});



app.post('/login',async (req, res) => {
    const {email, password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
        const passOk = bycrypt.compareSync(password, userDoc,password)
        if(passOk){
            jwt.sign({
                email:userDoc.email,
                id:userDoc._id,
                nachname:userDoc.nachname},
                jwtSecret,{},(err,token)=>{
                if(err)throw err;
                res.cookie('token',token).json('pass ok');
            });
        }else{
            res.status(422).json('pass not ok');
        }
    }else{
        res.json('not found');
    }

})


app.get('/profile',(req,res)=>{
    const {token} =req.cookies;
    if(token){
        jwt.verify(token,jwtSecret,{},async (err, userData) => {
            if (err) throw err;
            const {vorname,nachname,email,_id} = await User.findById(userData.id);
            res.json(vorname,nachname,email,_id);
        } );
    }else{

    }
})
app.listen(4000);