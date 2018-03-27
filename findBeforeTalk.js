var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

module.exports.FindBeforeTalk = function(req, res){
    var send = {};

    MongoClient.connect(url,function(err, db) {  
        db.collection("questionLog").find({"user":req.body.user_key}).sort({"_id":-1}).skip(1).toArray(function (err, items) {                  
            // db는 근 1달간 사용자 user_key, msg, time 전부 가짐
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ 
                send={
                    'message':{'text':'이전에 하신 말씀은 \"'+items[0].msg+'\"입니다!'}
                }  
            }
            res.json(send);
            console.log("전송한 메세지 : " + send.message.text);
            db.close();    
        });
    });     
}