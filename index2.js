const phantom = require('phantom');
require('dotenv').config();
var fs = require('fs');
var loginUrl = "https://sso.garmin.com/sso/login?service=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&webhost=olaxpw-conctmodern011.garmin.com&source=https%3A%2F%2Fconnect.garmin.com%2Fen-US%2Fsignin&redirectAfterAccountLoginUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&redirectAfterAccountCreationUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&gauthHost=https%3A%2F%2Fsso.garmin.com%2Fsso&locale=en_US&id=gauth-widget&cssUrl=https%3A%2F%2Fstatic.garmincdn.com%2Fcom.garmin.connect%2Fui%2Fcss%2Fgauth-custom-v1.2-min.css&privacyStatementUrl=%2F%2Fconnect.garmin.com%2Fen-US%2Fprivacy%2F&clientId=GarminConnect&rememberMeShown=true&rememberMeChecked=false&createAccountShown=true&openCreateAccount=false&usernameShown=false&displayNameShown=false&consumeServiceTicket=false&initialFocus=true&embedWidget=false&generateExtraServiceTicket=false&globalOptInShown=false&globalOptInChecked=false&mobile=false&connectLegalTerms=true";

var user = process.env.USER;
var pass = process.env.PASS;



    (async function(){
        var instance = await phantom.create(['--proxy=localhost:8888']);

        console.log("Start")

        var page = await instance.createPage();

        page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063')
        page.setting('javascriptEnabled', true);
        page.setting('webSecurityEnabled', false);

        page.on("onResourceRequested", function(requestData) {
            
                console.info('Requesting', requestData.url)
                  
            
         });

        page.on("loaded", async function(){
            console.log(await page.evaluate(function(){
                return window.location.href;
                })
            );
        });

        var status = await page.open(loginUrl);
         
        console.log(status);
        
        const content = await page.property('content');    
        fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\output5.html",content);

      setTimeout(async function(){
                    await page.evaluateJavaScript(`function(){document.getElementById('username').value = '${user}';}`);
                    await page.evaluateJavaScript(`function(){document.getElementById('password').value = '${pass}';}`);
                    await page.evaluateJavaScript(`function(){document.getElementById('login-form').submit();}`);

                console.log(">>>>>> written login");
                
                setTimeout(async function(){
                    var page2 = await instance.createPage();
                    var status = await page2.open("https://connect.garmin.com/modern/proxy/userstats-service/wellness/daily/nzigel?fromDate=2017-06-07&untilDate=2017-06-07 ");
                    
                    console.log(status);
                    const content2 = await page2.property('content');    
                    fs.writeFileSync("C:\\Users\\jak\\demo\\nigel\\data1.json",content2);
                }, 10000);

        }, 1000);

     
    }());

