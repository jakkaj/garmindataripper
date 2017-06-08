var request = require('request');
var Cookie = require('request-cookies').Cookie;
var fs = require('fs');
require('dotenv').config();

var initialHit = "https://connect.garmin.com/modern/ ";

var baseRequest = request.defaults({
    'headers':{
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    },
    // 'proxy':'http://localhost:8888',
    // 'rejectUnauthorized': 'false'
    
})

var headers = {    
    'Accept-Language': 'en-AU',
    'Accept': 'text/html, application/xhtml+xml, image/jxr, */*'
}


var form = {
    'username': process.env.USER,
    'password': process.env.PASS,
    'embed':'false',
    'rememberme': 'on'
};

class garminGetter{

   constructor(){
       this.cookies = [];
       this.redirectFirstStage = "https://sso.garmin.com/sso/login?service=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&webhost=olaxpw-conctmodern009.garmin.com&source=https%3A%2F%2Fconnect.garmin.com%2Fen-US%2Fsignin&redirectAfterAccountLoginUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&redirectAfterAccountCreationUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&gauthHost=https%3A%2F%2Fsso.garmin.com%2Fsso&locale=en_GB&id=gauth-widget&cssUrl=https%3A%2F%2Fstatic.garmincdn.com%2Fcom.garmin.connect%2Fui%2Fcss%2Fgauth-custom-v1.2-min.css&privacyStatementUrl=%2F%2Fconnect.garmin.com%2Fen-US%2Fprivacy%2F&clientId=GarminConnect&rememberMeShown=true&rememberMeChecked=false&createAccountShown=true&openCreateAccount=false&usernameShown=false&displayNameShown=false&consumeServiceTicket=false&initialFocus=true&embedWidget=false&generateExtraServiceTicket=false&globalOptInShown=false&globalOptInChecked=false&mobile=false&connectLegalTerms=true";
       this.grabTemplate = "https://connect.garmin.com/modern/proxy/userstats-service/wellness/daily/nzigel?fromDate=2017-06-07&untilDate=2017-06-07";
   }

    getInitial(){
        return new Promise((good, bad)=>{
            
            baseRequest.get({
                    uri: initialHit, 
                    headers: headers,
                    followRedirect:false,
                    form:form               
                }, (err, response, body)=>{
                if(err){
                    bad(err);
                    return;
                }
               // console.log(response.toJSON());
                fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output.html", response.body);
                var rawcookies = response.headers['set-cookie'];
                for (var i in rawcookies) {
                    var cookie = new Cookie(rawcookies[i]);
                    this.cookies.push(cookie);
                    console.log(cookie.key, cookie.value, cookie.expires);
                }

            //    this.redirectFirstStage = response.headers['location'];

                good();
                
            });
            
        });
    
    }

    doLogin(){
          return new Promise((good, bad)=>{

            var cookieString = "";
            for(var cookie in this.cookies)
            {
                cookieString += this.cookies[cookie].getCookieHeaderString() +"; ";
            }

            headers['Cookie'] = cookieString;
            console.log(`>> ${this.redirectFirstStage}`)
            baseRequest.get({
                    uri:  this.redirectFirstStage, 
                    headers: headers,
                    followRedirect:false,
                    cookies: cookieString                 
                }, (err, response, body)=>{
                if(err){
                    bad(err);
                    return;
                }
              
                fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output2.html", response.body);
                var rawcookies = response.headers['set-cookie'];
                for (var i in rawcookies) {
                    var cookie = new Cookie(rawcookies[i]);
                    this.cookies.push(cookie);
                    console.log(cookie.key, cookie.value, cookie.expires);
                }

                

                good();
                
            });
            
        });

        
    }

    doGetData(){
        return new Promise((good, bad)=>{

            var cookieString = "";
            
            for(var cookie in this.cookies)
            {
                cookieString += this.cookies[cookie].getCookieHeaderString() +"; ";
            }

            headers['Cookie'] = cookieString;            
           
            baseRequest.get({
                    uri:  this.grabTemplate, 
                    headers: headers,
                    followRedirect:false,
                    cookies: cookieString                 
                }, (err, response, body)=>{
                if(err){
                    bad(err);
                    return;
                }
                
                fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output3.html", response.body);
          

                good(response.body);
                
            });
            
        });
    }
}

var g = new garminGetter();
g.getInitial().then((good)=>{
    console.log(g.redirectFirstStage);
    g.doLogin().then((good)=>{
        
        g.doGetData((good)=>{
            console.log(good);
        })
    });
})