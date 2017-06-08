const phantom = require('phantom');
require('dotenv').config();
var fs = require('fs');
var loginUrl = "https://sso.garmin.com/sso/login?service=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&webhost=olaxpw-conctmodern011.garmin.com&source=https%3A%2F%2Fconnect.garmin.com%2Fen-US%2Fsignin&redirectAfterAccountLoginUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&redirectAfterAccountCreationUrl=https%3A%2F%2Fconnect.garmin.com%2Fmodern%2F&gauthHost=https%3A%2F%2Fsso.garmin.com%2Fsso&locale=en_US&id=gauth-widget&cssUrl=https%3A%2F%2Fstatic.garmincdn.com%2Fcom.garmin.connect%2Fui%2Fcss%2Fgauth-custom-v1.2-min.css&privacyStatementUrl=%2F%2Fconnect.garmin.com%2Fen-US%2Fprivacy%2F&clientId=GarminConnect&rememberMeShown=true&rememberMeChecked=false&createAccountShown=true&openCreateAccount=false&usernameShown=false&displayNameShown=false&consumeServiceTicket=false&initialFocus=true&embedWidget=false&generateExtraServiceTicket=false&globalOptInShown=false&globalOptInChecked=false&mobile=false&connectLegalTerms=true";

var user = process.env.USER;
var pass = process.env.PASS;



    (function(){
        phantom.create().then(function(instance){
             console.log("Start")

            instance.createPage().then(function(page){
                   page.setting('userAgent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063')
                page.setting('javascriptEnabled', true);
                page.setting('webSecurityEnabled', false);

                page.on("onResourceRequested", function(requestData) {
                    
                      //  console.info('Requesting', requestData.url)
                        
                    
                });

                // page.on("loaded", function(){
                //     console.log(await page.evaluate(function(){
                //         return window.location.href;
                //         })
                //     );
                // });

                page.open(loginUrl).then(function(status){
                      console.log(status);               
               

                    setTimeout(function(){
                                page.evaluateJavaScript(`function(){document.getElementById('username').value = '${user}';}`);
                                page.evaluateJavaScript(`function(){document.getElementById('password').value = '${pass}';}`);
                                page.evaluateJavaScript(`function(){document.getElementById('login-form').submit();}`);

                                console.log(">>>>>> written login");
                                
                                setTimeout(function(){
                                    instance.createPage().then(function(page2){
                                        console.log("get data");
                                        page2.open("https://connect.garmin.com/modern/proxy/userstats-service/wellness/daily/nzigel?fromDate=2017-06-07&untilDate=2017-06-07 ").
                                            then(function(status2){
                                                
                                                console.log(status2);
                                                page2.property('content').then(function(content2){
                                                    console.log(content2);
                                                });
                                            });
                                    });
                                    
                                }, 10000);

                        }, 1000);
                });
                
              
            });

         

        });

       
     
    }());

