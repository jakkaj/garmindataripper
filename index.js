var request = require('request');
var Cookie = require('request-cookies').Cookie;
var fs = require('fs');
require('dotenv').config();

// var initialHit = "https://connect.garmin.com/modern/ ";

// var baseRequest = request.defaults({
//     'headers':{
//         'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
//     },
//     // 'proxy':'http://localhost:8888',
//     // 'rejectUnauthorized': 'false'
    
// })

// var headers = {    
//     'Accept-Language': 'en-AU',
//     'Accept': 'text/html, application/xhtml+xml, image/jxr, */*'
// }
var initialLogin1 = 'https://connect.garmin.com/en-US/signin?service=https://connect.garmin.com/modern/';
var initialLogin2 = 'https://sso.garmin.com/sso/login?service=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&webhost=olaxpw-conctmodern011.garmin.com&source=https%3A%2F%2Fconnect.garmin.com%2Fen-US%2Fsignin&redirectAfterAccountLoginUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&redirectAfterAccountCreationUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&gauthHost=https%3A%2F%2Fsso.garmin.com%2Fsso&locale=en_US&id=gauth-widget&cssUrl=https%3A%2F%2Fstatic.garmincdn.com%2Fcom.garmin.connect%2Fui%2Fcss%2Fgauth-custom-v1.2-min.css&privacyStatementUrl=%2F%2Fconnect.garmin.com%2Fen-US%2Fprivacy%2F&clientId=GarminConnect&rememberMeShown=true&rememberMeChecked=false&createAccountShown=true&openCreateAccount=false&usernameShown=false&displayNameShown=false&consumeServiceTicket=false&initialFocus=true&embedWidget=false&generateExtraServiceTicket=false&globalOptInShown=false&globalOptInChecked=false&mobile=false&connectLegalTerms=true';
var postAuth = 'https://connect.garmin.com/modern/?';
var grabTemplate = "https://connect.garmin.com/modern/proxy/userstats-service/wellness/daily/nzigel?fromDate=2017-06-07&untilDate=2017-06-07";

var form = {
    'username': process.env.USER,
    'password': process.env.PASS,
    'embed':'false',    
};

class garminGetter{

   constructor(){
       this.cookies = [];
       this.loginTicket = "";
       
   }

   get(uri){
        console.log(uri);
         return new Promise((good, bad)=>{
            var headers ={
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/1337 Safari/537.36' 
            }

            var cookieString = "";
            
            for(var cookie in this.cookies)
            {
                
                if(this.cookies[cookie].key == 'JSESSIONID'){
                   cookieString = cookieString.replace('JSESSIONID', 'sdff');
                   //console.log('No send session')
                }

                 cookieString += this.cookies[cookie].getCookieHeaderString() +"; ";
                
               
            }

            if(cookieString!=''){
                headers['Cookie'] = cookieString;
                console.log(cookieString)
            }
            

            var getObj = {
                    uri: uri, 
                    headers: headers,
                    followRedirect: false  
                                  
            }

            request.get(getObj, (err, response, body)=>{
                if(err){
                    bad(err);
                    return;
                }
                
               // console.log(response.toJSON());
             //   fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output_new.html", response.body);
                var rawcookies = response.headers['set-cookie'];

                
                for (var i in rawcookies) {
                    var cookie = new Cookie(rawcookies[i]);
                    
                    this.cookies.push(cookie);
                    console.log(cookie.key, cookie.value, cookie.expires);
                }          

                good(response.body);
                
            });

         });
   }

    post(uri, form){
         return new Promise((good, bad)=>{
            var headers ={
                'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/1337 Safari/537.36' 
            }

            var cookieString = "";

            for(var cookie in this.cookies)
            {
                cookieString += this.cookies[cookie].getCookieHeaderString() +"; ";
            }

            headers['Cookie'] = cookieString;

            var getObj = {
                    uri: uri, 
                    headers: headers                   
            }

            if(form){
                getObj.form = form;
            }

            request.post(getObj, (err, response, body)=>{
                if(err){
                    bad(err);
                    return;
                }
               // console.log(response.toJSON());
                fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output_new.html", response.body);

                var r = response.body.match(/ticket=(.*)\"/gm);
                var ticket = r[0].trim().replace("\"", "");
                this.loginTicket = ticket;
                var rawcookies = response.headers['set-cookie'];
                for (var i in rawcookies) {
                    var cookie = new Cookie(rawcookies[i]);
                    // if(cookie.key == 'CASTGC'){
                    //     this.loginTicket = cookie.value;
                    // }
                    this.cookies.push(cookie);
                   
                }          

                good(response.body);
                
            });

         });
   }

}

var g = new garminGetter();
g.get(initialLogin2).then(function(good){
        g.post(initialLogin2, form).then(function(good2){
            if(!g.loginTicket){
                console.log("No ticket!")
            }else{
                console.log("Ticket is good");
                var tix = g.loginTicket;
                console.log(tix);

                g.get(`${postAuth}${tix}`).then(function(good3){
                    g.get("https://connect.garmin.com/modern/").then(function(good4){
                        //console.log(good4);
                        g.get("https://connect.garmin.com/modern/proxy/userstats-service/wellness/daily/nzigel?fromDate=2017-06-07&untilDate=2017-06-07").then(function(good5){
                             console.log(good5);
                        });
                    });
                });
            }
        });
});




    // getInitial(){
    //     return new Promise((good, bad)=>{
            
    //         baseRequest.get({
    //                 uri: initialHit, 
    //                 headers: headers,
    //                 followRedirect:false,
    //                 form:form               
    //             }, (err, response, body)=>{
    //             if(err){
    //                 bad(err);
    //                 return;
    //             }
    //            // console.log(response.toJSON());
    //             fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output.html", response.body);
    //             var rawcookies = response.headers['set-cookie'];
    //             for (var i in rawcookies) {
    //                 var cookie = new Cookie(rawcookies[i]);
    //                 this.cookies.push(cookie);
    //                 console.log(cookie.key, cookie.value, cookie.expires);
    //             }

    //         //    this.redirectFirstStage = response.headers['location'];

    //             good();
                
    //         });
            
    //     });
    
    // }

    // doLogin(){
    //       return new Promise((good, bad)=>{

    //         var cookieString = "";
    //         for(var cookie in this.cookies)
    //         {
    //             cookieString += this.cookies[cookie].getCookieHeaderString() +"; ";
    //         }

    //         headers['Cookie'] = cookieString;
    //         console.log(`>> ${this.redirectFirstStage}`)
    //         baseRequest.get({
    //                 uri:  this.redirectFirstStage, 
    //                 headers: headers,
    //                 followRedirect:false,
    //                 cookies: cookieString                 
    //             }, (err, response, body)=>{
    //             if(err){
    //                 bad(err);
    //                 return;
    //             }
              
    //             fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output2.html", response.body);
    //             var rawcookies = response.headers['set-cookie'];
    //             for (var i in rawcookies) {
    //                 var cookie = new Cookie(rawcookies[i]);
    //                 this.cookies.push(cookie);
    //                 console.log(cookie.key, cookie.value, cookie.expires);
    //             }

                

    //             good();
                
    //         });
            
    //     });

        
    // }

    // doGetData(){
    //     return new Promise((good, bad)=>{

    //         var cookieString = "";
            
    //         for(var cookie in this.cookies)
    //         {
    //             cookieString += this.cookies[cookie].getCookieHeaderString() +"; ";
    //         }

    //         headers['Cookie'] = cookieString;            
           
    //         baseRequest.get({
    //                 uri:  this.grabTemplate, 
    //                 headers: headers,
    //                 followRedirect:false,
    //                 cookies: cookieString                 
    //             }, (err, response, body)=>{
    //             if(err){
    //                 bad(err);
    //                 return;
    //             }
                
    //             fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output3.html", response.body);
          

    //             good(response.body);
                
    //         });
            
    //     });
    // }