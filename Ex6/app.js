const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/webTech").then(()=>{console.log("Connection success");}).catch((e)=>{console.log("Error in connecction");});
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: Number,
    gender: String,
    dob: String,
    address: String,
    createdAt: {type: Date, default: Date.now}
});
const User = mongoose.model('User',userSchema);

async function registerFn(fname,lname,emailID,pass,num,gen,dateOfBirth,add){
    const newUser = await User.create({
        firstName: fname,
        lastName: lname,
        email: emailID,
        password: pass,
        phoneNumber: num,
        gender: gen,
        dob: dateOfBirth,
        address: add
    });
}

async function loginFn(emailId, password){
    const isUser = await User.find({email: emailId, password: password});
    return isUser.length>=1;
}

async function changePassword(fname, emailId, dob, password){
    const isUser = await User.find({email: emailId, firstName: fname, dob: dob});
    if(isUser.length<1){return false;}
    const result = await User.updateOne({email: emailId, firstName: fname, dob: dob}, {$set: {password: password}});
    return true;
}

async function deleteUser(email){
    const isUser = await User.find({email: email});
    if(isUser.length<1){return false;}
    await User.deleteOne({email: email});
    return true;
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/', (request, response)=>{
    response.sendFile(path.join(__dirname, "login.html"));
});
app.get('/login', (request, response)=>{
    response.sendFile(path.join(__dirname, "login.html"));
});
app.get('/register', (request, response)=>{
    response.sendFile(path.join(__dirname,"register.html"));
});
app.post('/submitLogin', async (request, response)=>{
    var emailId = request.body.email;
    var password = request.body.password;
    var isUser = await loginFn(emailId, password);
    if (isUser) {
        response.redirect('/login?status=success&message=User logged in successfully!');
    } else {
        response.redirect('/login?status=error&message=Invalid emailID or password. Try again!');
    }

});
app.post('/submitRegister', (request, response)=>{
    var fname = request.body.fname;
    var lname = request.body.lname;
    var emailId = request.body.email;
    var password = request.body.password;
    var phoneNumber = request.body.pnumber;
    var gender = request.body.gender;
    var dob = request.body.dob;
    var address = request.body.address;
    registerFn(fname,lname,emailId,password,phoneNumber,gender,dob,address);
    response.redirect("/register?status=success&message=User registered successfully");
});
app.get('/forgetPassword', (request, response)=>{
    response.sendFile(path.join(__dirname, "forgetPassword.html"));
});
app.post('/submitForgetPassword', async (request, response)=>{
    var fname = request.body.fname;
    var emailId = request.body.email;
    var dob = request.body.dob;
    var password = request.body.password;
    var ischanged = await changePassword(fname, emailId, dob, password);
    if (ischanged) {
        response.redirect('/forgetPassword?status=success&message=Password changed successfully!');
    } else {
        response.redirect('/forgetPassword?status=error&message=Invalid emailID or Name. Try again!');
    }
});
app.get('/thankyou', (reqeust, response) => {
    response.send('<h1>User registered successfully!</h1><a href="/">Go to Home</a>');
});

app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
});