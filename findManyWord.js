var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

var moduleQP = require("./questionParse");
var moduleDate = require("./controlDateLog");
var moduleGetFre = require("./getFrequencyIdx");

module.exports.FindManyWord = function(req, res, msg){
    var send = {};

    MongoClient.connect(url,function(err, db) {  
        db.collection("questionLog").find({"user":req.body.user_key}).toArray(function (err, items) {                  
            // db는 근 1달간 사용자 user_key, msg, time 전부 가짐
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ 
                purpose = []; 
                
                // 날짜 관련 제어
                if(msg.search("오늘")>=0)
                    items = moduleDate.getTodayLog(items);                   
                if(msg.search("이번 달")>=0 || msg.search("이번달")>=0 )
                    items = moduleDate.getThisMonthLog(items);               
                if(msg.search("한 달")>=0 || msg.search("한 달")>=0 )
                    items = moduleDate.getInMonthLog(items);
                

                for(var i in items){ // log의 msg에서 질문받은 대상을 parsing
                    check = moduleQP.IncludeQuestion(items[i].msg);
                    if(check == 1){ // 어떤 대상을 물은 것이어야 함.
                        umsg = moduleQP.QuestionParse(items[i].msg);
                        purpose.push(umsg);
                    }
                }
                result = purpose[moduleGetFre.GetFrequencyIdx(purpose)];

                send={
                    'message':{'text':"가장 많이 물어보신 단어는 \"" + result +"\"입니다!"}
                }  
            }
            res.json(send);
            console.log("전송한 메세지 : " + send.message.text);
            db.close();    
        });
    }); 
}