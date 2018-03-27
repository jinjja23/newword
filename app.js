// 신조어 챗봇 프로젝트 2018.03.22 - 최성진
console.log('NewWord start!!!');

// 기본 설정 모듈 세팅
var express = require('express');
var http=require('http');
var bodyParser = require('body-parser');
var url = "mongodb://localhost/newword"; 
var MongoClient = require('mongodb').MongoClient;

// 진행 기능 모듈
var progress1 = require("./findMostNewWord"); // 실제 실행용 모듈
var progress2 = require("./findMostOldWord");
var progress3 = require("./findPopularWord");
var progress4 = require("./findCountWord");
var progress5 = require("./findBeforeTalk");
var progress6 = require("./findManyWord");
var progressEnd = require("./controlExtraAnswer");

var check1 = require("./checkMostNewWord"); // 검사용 모듈
var check2 = require("./checkMostOldWord");
var check3 = require("./checkPopularWord");
var check4 = require("./checkCountWord");
var check5 = require("./checkBeforeTalk");
var check6 = require("./checkMyManyWord");

// 인텐트용(intent) 모듈
var moduleAC = require("./answerControl"); 
var moduleQP = require("./questionParse"); 
var moduleMCQ = require("./myCountQuestion");
var moduleNB = require("./newBirthWord");
var moduleOB = require("./oldBirthWord");
var modulePW = require("./popularWord");
var moduleMBT = require("./myBeforeTalk");

// 부가 기능 모듈
var moduleLog = require("./setLog");
var moduleDate = require("./controlDateLog");
var moduleGetFre = require("./getFrequencyIdx");


var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// req : 사용자, res : 챗봇
// req.body.user_key : 사용자 카카오톡 id
// req.body.content : 사용자 질문
// res.send : 챗봇이 보내는 말


// http://110.11.195.77:9090 사용해서 포트포워딩
// localhost:9090/keyboard에 대한 get 라우팅 처리 - 챗 시작할 때
app.get('/keyboard', function(req,res){
    MongoClient.connect(url,function (err, db) {   
        db.collection("newword").find({}).toArray(function (err, items) {   
            // items는 msg와 같은 title로 읽은 후 추출한 튜플들을 저장한 배열                  
       
            if(err){ // TypeError 등 에러 처리
                callback(err,null);
                return;
            }       
            if(items.length > 0){ // DB에 속한 title에 관한 intent 처리
                buttons = [];
                for(var i in items)
                    buttons.push(items[i].title);

                var data={
                    'type':'buttons',
                    'buttons':['직접 질문하시려면 \'여기\'를 눌러주세요~',buttons[buttons.length-1],buttons[buttons.length-2]
                        ,buttons[buttons.length-3],buttons[buttons.length-4],buttons[buttons.length-5]]
                };
                res.json(data); // JSON 형식으로 웹에 표시(응답)
            }
            db.close();
        });
    });  
});
    


// localhost:9090/keyboard에 대한 post 라우팅 처리 - chat 질문할 때
app.post('/message',function(req,res){
    var msg = req.body.content; // 질문받은 내용 msg에 저장
    console.log('전달받은 메세지 : ' + msg);

    moduleLog.setUserLog(req.body.user_key, msg); // 사용자 로그 기록

    var send={};
    flag = 0;

    // 가장 최신의 신조어 탐색
    intent = moduleNB.NewBirthWord();
    flag = check1.CheckMostNewWord(msg, intent, flag);
    if(flag == 1){ progress1.FindMostNewWord(res, send); }


    // 가장 오래된 신조어 탐색
    intent = moduleOB.OldBirthWord();
    flag = check2.CheckMostOldWord(msg, intent, flag);
    if(flag == 2){ progress2.FindMostOldWord(res, send); }


    // 유행하거나 최근에 자주 질문받은 신조어 탐색
    intent = modulePW.PopularWord();
    flag = check3.CheckPopularWord(msg, intent, flag);
    if(flag == 3){ progress3.FindPopularWord(res, send); }


    // 해당 신조어를 몇 번 물어봤는 지를 탐색
    intent = moduleMCQ.MyCountQuestion();
    flag = check4.CheckCountWord(msg, intent, flag);
    if(flag == 4){ progress4.FindCountWord(req, res, msg); }


    // 사용자가 바로 이 전에 말한 말이 무엇인지 탐색
    intent = moduleMBT.MyBeforeTalk();
    flag = check5.CheckBeforeTalk(msg, intent, flag);
    if(flag == 5){ progress5.FindBeforeTalk(req, res); }


    // 사용자 본인이 많이 묻는 신조어가 무엇인지에 대한 탐색
    intent = modulePW.PopularWord();
    flag = check6.CheckMyManyWord(msg, intent, flag);
    if(flag == 6){ progress6.FindManyWord(req, res, msg);}

    
    // 기타 응답(일반 단어에 관한 질문, 시작, 기타) 처리
    if(flag == 0){
        msg = moduleQP.QuestionParse(msg); // 질문인지 검사   ex) xx는 뭐야?, xx가 뭐야?, xx 좀 알려줘, xx는? 등등
        console.log("Extra 처리");

        progressEnd.ControlExtraAnswer(req, res, msg);
    }
});

http.createServer(app).listen(9090,function(){
    console.log('9090 포트 서버 실행 중...');
});










// my IP : 110.11.195.77  -   http://www.findip.kr/
// http://110.11.195.77:9090




// -------- MongoDB 연동 기본 --------
// MongoClient.connect(url,
//     function (err, db) {
//         db.collection("newword").find({"title":"ㅇㄱㄹㅇ"}).toArray(function (err, items) {
//         console.log(items.length);
        
//         for (var i in items)
//             console.log(i + ":" + items[i].text);
          
//         db.close();
//     });
// });