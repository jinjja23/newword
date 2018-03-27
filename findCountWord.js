var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

var moduleQP = require("./questionParse");
var moduleDate = require("./controlDateLog");

module.exports.FindCountWord = function(req, res, msg){
    var send={};

    MongoClient.connect(url,function(err, db) {  
        db.collection("questionLog").find({"user":req.body.user_key}).toArray(function (err, items) {                  
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ 
                purpose = [];

                answerCount = 0;

                // 날짜 관련 제어
                if(msg.search("오늘")>=0)
                    items = moduleDate.getTodayLog(items);                   
                if(msg.search("이번 달")>=0 || msg.search("이번달")>=0 )
                    items = moduleDate.getThisMonthLog(items);               
                if(msg.search("한 달")>=0 || msg.search("한 달")>=0 )
                    items = moduleDate.getInMonthLog(items);

                for(var i in items)
                    purpose.push(items[i].msg);

                comp = moduleQP.CountQuestionParse(msg);
                for (var i in purpose){
                    if(purpose[i].search(comp) >= 0){ // log의 msg에 내가 물은 대상이 있는지
                        answerCount++;
                    }
                }

                send={
                    'message':{'text':"총 "+comp+"에 대해서 "+ (answerCount-1) +"번 질문하셨습니다!"}
                }  // -1한 이유 : 방금 물은 거는 제외
            }
            res.json(send);
            console.log("전송한 메세지 : " + send.message.text);
            db.close();    
        });
    });  
}