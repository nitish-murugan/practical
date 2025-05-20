var http = require("http");
var url = require("url");
var queryString = require("querystring");
var server = http.createServer(function(request, response){
    var urlName = request.url.split('?')[0];
    if(urlName == '/login'){
        var path = url.parse(request.url).pathname;
        console.log("Request for "+path+" received");
        var query = url.parse(request.url).query;
        console.log(query);
        var email = queryString.parse(query)['email'];
        var password = queryString.parse(query)['password'];
        response.write("Hello "+email+" Your password is "+password);
        response.end();
    }
    else if(urlName == '/register'){
        var data1 = '';
        var qs,fname,lname,email,password,rpassword,contryCode,pnumber,gender,dob,address,declaration;
        request.on('data',function(chunk){
            console.log(chunk);
            data1+=chunk;
            console.log("data in string format: "+data1);
        });
        request.on('end',function(){
            var qs = queryString.parse(data1);
            console.log(qs);
            fname = qs['fname'];
            lname = qs['lname'];
            email = qs['email'];
            password = qs['password'];
            rpassword = qs['rpassword'];
            contryCode = qs['contryCode'];
            pnumber = qs['pnumber'];
            gender = qs['gender'];
            dob = qs['dob'];
            address = qs['address'];
            declaration = qs['declaration'];
            response.write("Hello "+fname+" "+lname);
            response.write("\nYour email id is "+email);
            //response.write("\nYour password is "+password);
            response.write("\nYour phone number  is "+contryCode+" "+pnumber);
            response.write("\nYour gender is "+gender);
            response.write("\nYour DOB is "+dob);
            response.write("\nYour address is "+address);
            response.end();
        })
    }
    else{
        response.end("Invalid request");
    }
}).listen(8000);
console.log("Server running");