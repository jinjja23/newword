var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

var moduleQP = require("./questionParse");
var moduleGetFre = require("./getFrequencyIdx");

module.exports.FindPopularWord = function(res, send){
    date = new Date();
    date.setMonth(date.getMonth()-1); // 한 달 전 처리  getMonth()함수는 index형식. 그래서 현재 month는 +1 해야 함.
       
    MongoClient.connect(url,function(err, db) {  
        db.collection("questionLog").find({"time":{$gte:date}}).toArray(function (err, items) {                  
            // db는 근 1달간 사용자 user_key, msg, time 전부 가짐
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ 
                purpose = []; // javascript는 배열 요소 추가를 push()로도 가능함.

                for(var i in items){ // log의 msg에서 질문받은 대상을 parsing하는 for문
                    check = moduleQP.IncludeQuestion(items[i].msg);
                    if(check == 1){ // 어떤 대상을 물은 것이어야 함.
                        umsg = moduleQP.QuestionParse(items[i].msg);
                        purpose.push(umsg);
                    }
                }
                result = purpose[moduleGetFre.GetFrequencyIdx(purpose)];
                
                send={
                    'message':{'text':"바로 \"" + result +"\"입니다!"}
                }  
            }
            res.json(send);
            console.log("전송한 메세지 : " + send.message.text);
            db.close();    
        });
    });  
}