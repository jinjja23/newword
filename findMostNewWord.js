var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

module.exports.FindMostNewWord = function(res, send){
    MongoClient.connect(url,function (err, db) { 
        db.collection("newword").find({}).sort({"_id":-1}).limit(1).toArray(function (err, items) {                  
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ // DB에 속한 가장 최근에 추가된 거
                send={
                    'message':{'text':"가장 최신의 신조어는 "+items[0].title+"입니다!\n" + items[0].text}
                }   
            }
            res.json(send);
            console.log("전송한 메세지 : " + send.message.text);
            db.close();    
        });
    });  
}
