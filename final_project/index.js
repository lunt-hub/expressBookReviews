const express = require('express');
const jwt = require('jsonwebtoken');
const jwt_secret = "377dcaeeae11ac29e1ac973f4929c73c3c97b0f3abe0ed6c4b04e41dfac1654800d499e7085b24d0d4fdebfb20e7a150fddb6b6de37873933663d38418d5926f2c8b73556d9829a4bcc251eab247c82b06ffb9201b4ee563bb6275c796e57e9d0d77bb314d8aec09a4187147a21f6703039d3b48a8ba492554ea0250607c7023bcbea1db693ea086cad2e2d827b74c14831d149640fa88e386a41363eba554e0fe5876ba001d1b3feb9b8cf112ca6a39a51a43cbad21190bc771f0cff75e6a48b5c01dded1a3efafc8ac4d73c046b2b571383e1ab901465b093f4938f08d6ce691d07bb3d6481acdac5a99f170ec428a1b6b96850fa3a3e4a689d108747b31ab"
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const data = jwt.decode(req.headers.authorization, jwt_secret);
    req.body = {
        ...req.body,
        username: data.username,
        password: data.password
    }
    next();
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
