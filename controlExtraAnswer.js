var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

var moduleAC = require("./answerControl");

module.exports.ControlExtraAnswer = function(req, res, msg){
    var send={};

    MongoClient.connect(url,function (err, db) {   
        db.collection("newword").find({"title":msg}).toArray(function (err, items) {   
            // items는 msg와 같은 title로 읽은 후 추출한 튜플들을 저장한 배열                  
       
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ // DB에 속한 title에 관한 intent 처리
                if(msg.search("ㅇㅋ")>=0 || msg.search("ㅎㅇ")>=0)
                    send={'message':{'text':'네!'}}    
                else{
                    send={
                        'message':{'text':items[0].text}
                    }        
                }
            }
            else{ // msg가 DB에 없을 때
                send = moduleAC.ExtraIntentControl(msg);                                 
            }
            res.json(send);
            console.log("전송한 메세지 : " + send.message.text);
            db.close();
        });
    });  
}