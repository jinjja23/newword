var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

// log 기록 하는 함수
module.exports.setUserLog = function(key, msg){
    // 로그 삽입(사용자 user_key, 메세지, 메세지 질문 시간)
    MongoClient.connect(url,function (err, db) {   
        db.collection("questionLog").insert({      
            "user":key, // req.body.user_key : 카카오 사용자 고유 키 값
            "msg":msg,
            "time":new Date() // 현재 시간 dateTime형, 일자 얻는 메소드 : getDay()
        });
        db.close();
    });
}