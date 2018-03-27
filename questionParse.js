// import 참고 : https://theyoung2002.blog.me/220602390142
//               http://hakurei.tistory.com/208

// 질문 형식으로 묻는 거 문자열 파싱하는 함수
var cs = require("./myCountQuestion");

module.exports.QuestionParse = function(msg){ 
    string=["를 좀","을 좀","머","먼","멀","뭐","뭔","뭘","뭡","무","문","모","몬",
    "알려","갈켜","갈쳐","가르쳐","설명","대",""];

    for(var i in string){
        msg=internalQuestionParse(msg,string[i]);        
    }
    return msg;
}

module.exports.IncludeQuestion = function(msg){
    string=["를 좀","을 좀","머","먼","멀","뭐","뭔","뭘","뭡","무","문","모","몬","궁",
    "알려","갈켜","갈쳐","가르쳐","설명","대",""]; // ""은 갑분싸는? 같은 질문 처리
    exist = 0;

    for(var i in string){ 
        if(msg.search(string[i]) >= 2 && msg.search("자주")<0 && msg.search("유행")<0){
            comp = internalQuestionParse(msg, string[i]); 
            // 질문에서 질문의 대상만 추출하는 부분
            if(msg.length > comp.length){ // xx가 뭐xx 같은 질문 형식인지 검사, 추출된 게 길이 짧아야 정상
                exist = 1;
                break;    
            }
        }
    }
    return exist;
}

function internalQuestionParse(msg, string){
    // search는 문자열 찾아서 시작 index 반환, idx는 substring을 위한 변수
    if(msg.search("자주")<0 && msg.search("유행")<0){
        if(msg[msg.length-1]=="?" || msg[msg.length-1]=="!"){ // ?, !부터 cut           
            msg = msg.substring(0, msg.length-1);
        }
        else if(string=="알려" || string=="갈켜" || string=="갈쳐" || string=="가르쳐" || string=="설명" || string=="대")
        {
            idx = msg.search(string);
            middle1 = msg.search("좀");
            middle2 = msg.search("쫌");
            if(idx > 0){
                internalString = ["에 대","에 관","에대","에관","를 좀","을 좀"];
                for(var i in internalString){
                    if(msg.search(internalString[i])){
                        idx = msg.search(internalString[i]);
                        if(idx > 0){
                            msg = getSubString(msg,idx);
                            break;
                        }
                    }
                }
                if(middle1 > 0 || middle2 > 0){ // 좀,쫌 앞에 공백이 없거나 을,를이 있는 경우
                    if(msg[idx-2]=="을" || msg[idx-2]=="를")
                        msg = getSubString(msg,idx-2);
                    else{
                        flag = 0;
                        for(var i in internalString){ // ex) 갑분싸에 대해서 좀알려줘 - 처리
                            if(msg.search(internalString[i])){
                                idx = msg.search(internalString[i]);
                                if(idx > 0){
                                    msg = getSubString(msg,idx);
                                    flag=1;
                                    break;
                                }
                            }
                        }
                        if(flag==0){
                            if(middle1 > 0){
                                if(msg.search(string)-middle1 == 1)
                                    msg = getSubString(msg,middle1);
                                else if(msg.search(string)-middle1 == 2)
                                    msg = getSubString(msg,middle1 - 1);
                            }
                            if(middle2 > 0){
                                if(msg.search(string)-middle2 == 1)
                                    msg = getSubString(msg,middle2);
                                else if(msg.search(string)-middle2 == 2)
                                    msg = getSubString(msg,middle2 - 1);
                            }
                        }
                    }
                }
                else if(msg[idx-2]=="좀" || msg[idx-2]=="쫌"){ // 좀,쫌 앞에 공백이 있는 경우
                    msg = getSubString(msg,idx-3); // 이전 공백까지 substring 해야 하므로
                }
                else
                    msg = getSubString(msg,idx);
            }
        } 
        else if(msg.search("는 것은")>=0 || msg.search("은 것은")>=0  // logic 많이 빈약함...
                || msg.search("는것은")>=0 || msg.search("은것은")>=0
                || msg.search("는 건")>=0 || msg.search("은 건")>=0  
                || msg.search("는건")>=0 || msg.search("은건")>=0 
                || msg.search("한 것은")>=0 || msg.search("한것은")>=0 
                || msg.search("한 건")>=0 || msg.search("한건")>=0 ){
            
            if((msg[msg.length-1]=="다" && msg[msg.length-2]!="니") || msg[msg.length-1]=="야") // 궁금한 것은 XXX다,야
                msg = getSubString(msg,msg.length-1);
            else
                msg = getSubString(msg,msg.length-3) // 입니다, 라니까 등등 처리
        }
        else{
            idx = msg.search("은 "+string);
            if(idx > 0)
                msg = getSubString(msg,idx);
            idx = msg.search("는 "+string);
            if(idx>0)
                msg = getSubString(msg,idx);
            idx = msg.search("이 "+string);
            if(idx>0)
                msg = getSubString(msg,idx);
            idx = msg.search("가 "+string);
            if(idx>0)
                msg = getSubString(msg,idx);
    
            idx = msg.search("은"+string);
            if(idx>0)
                msg = getSubString(msg,idx);
            idx = msg.search("는"+string);
            if(idx>0)
                msg = getSubString(msg,idx);
            idx = msg.search("이"+string);
            if(idx>0)
                msg = getSubString(msg,idx);
            idx = msg.search("가"+string);
            if(idx>0)
                msg = getSubString(msg,idx);
          
        }
    }
    return msg;
}

module.exports.CountQuestionParse = function(msg){
    string=["을","를","가","은","는","에 대해 ","에 관해","에대해","에관해"," "];

    countString = cs.MyCountQuestion();
    cidx = flag = 0;
    
    for(var i in countString){
        cidx = msg.search(countString[i]);
        if(cidx >= 2){ // 메세지에 횟수에 대한 질문이 있다면
            flag=1;
            break;
        }
    }
    check = -1;
    if(flag == 1){
        for(var i in string){
            check = msg.search(string[i]);
            if(check >= 0 && check < cidx){
                msg = getSubString(msg, check);
                break;
            }
        }
    }

    if(check == -1) // 갑분싸몇번물어봤어? 이런 거 처리 - 띄어쓰기 없을 때 (logic 빈약함...)
        msg = getSubString(msg, cidx);

    return msg;
}

function getSubString(msg, idx){ // idx : 해당 단어 마지막 바로 다음 idx
    start = 0; // 질문하려는 언어 바로 이전 공백 index
  
    for(var i=0; i<idx; i++){
        if(msg[i]==' '){
            start = i+1;
        }
    }
    msg = msg.substring(start,idx);     
   
    return msg;
}


// flag = 0;
// if(msgTemp != msg) 
//     flag = 1;
 
// if(flag == 0){ // 존버? 존버는? 존버란? 존버는! <----- 처리
//     idx = msg.length-1;
//     if(msg[idx] == "?" || msg[idx]=="!"){
//         if(msg[idx-1] =="는" || msg[idx-1]=="란" || msg[idx-1]=="은"){
//             msg = getSubString(msg, idx-1)
//         }
//         else{
//             msg = getSubString(msg, idx);
//         }
//     }
// }