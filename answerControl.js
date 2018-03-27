// 기타 문장에 대한 intent 제어하는 함수
module.exports.ExtraIntentControl = function(msg){
    bintent1 = ["신조어"];
    bintent2 = ["뉴워드","뉴 워드","new word","newword","New Word","NewWord"];
    bintent3 = ["안녕","안뇽","hi","하이","하여","오랜만"];
    bintent4 = ["고마","고맙","땡큐","thank","굿","수고","good","고생","쉬어"];
    bintent5 = ["저는","나는","난"];
    bintent6 = ["잘가","잘 가","bye","잘있어"];
    bintent7 = ["뭐하냐","뭐하는","뭐하니","뭐해"];

    eintent1 = ["넌","닌","너는","니는","너","니"];

    oneEintent1 = ["앵","엥","오","이런","젠장","싫어","바보","아 뭐야","앗"];

    if(msg== '직접 질문하시려면 \'여기\'를 눌러주세요~')
        send={
            'message':{'text':'안녕하세요! 궁금하신 것에 대해 질문해 주세요~'}
        }
    else if(msg.search("알겠") == 0 || msg.search("오키") == 0
        || msg.search("ok") == 0 || msg.search("네 ") == 0
        || msg.search("야야") == 0
        || msg.search("그래 ") == 0 || msg.search("그래") == 0 || msg.search("야 ") >= 0
        || (msg.search("야") == 0 && msg.length == 1) || msg.search("응 ") >= 0
        || (msg.search("응") == 0 && msg.length == 1) || msg.search("뭐 ") >= 0
        || (msg.search("뭐") == 0 && msg.length == 1) || msg.search("ㅇ ") >= 0
        || (msg.search("ㅇ") == 0 && msg.length == 1) || msg.search("ㅇㅇ ") >= 0
        || (msg.search("ㅇㅇ") == 0 && msg.length == 2))
        send={
            'message':{'text':'네!'}
        }
 
    // 요즘 유행하는 신조어가 뭐야?
    // xxx는 얼마나 자주 사용해?
    // xxx에 대한 질문은 몇 번이나 받았어?
    // ---> 이런 질문들에 대한 처리가 부족함. 그래서 일단 예외 처리
    else if(msg.search("몇")>=0 || msg.search("자주") >= 0
        || msg.search("유행") >= 0 || msg.search("얼마나") >= 0)       
        send={
            'message':{'text':'죄송합니다.. 그건 모르겠어요..'}
        }
    else{
        send={
        'message':{'text':'죄송합니다.. 말씀을 이해 못하겠어요ㅠㅠ'}
        }  
    }    
    
    // send 할당 순서는 주 대화 순서를 따름   ex) 너 뭐해?
    send = internalControl1(msg, bintent1, "\'신조어\'란 요즘 신세대들이 많이 사용하는 새로운 언어를 말합니다!");
    send = internalControl1(msg, bintent2, "\'뉴워드\'란 \'new word\' 즉, 새로운 언어인 신조어를 말합니다~");
    send = internalControl1(msg, bintent3, "안녕하세요!");
    send = internalControl1(msg, bintent4, "감사합니다!");
    send = internalControl1(msg, bintent5, "반가워요!!");
    send = internalControl2(msg, eintent1, "저는 신조어 지킴이 뉴워드에요!");
    send = internalControl1(msg, bintent6, "안녕히 가세요! 만나서 반가웠습니다!!");
    send = internalControl1(msg, bintent7, "열심히 신조어를 공부하는 중입니다!");
    send = internalControl3(msg, oneEintent1, "앗!");
    
    return send; 
}

// 이 단어들이 속하는지 검사
function internalControl1(msg,intent,answer){
    for(var i in intent){
        if(msg.search(intent[i]) >= 0)
            send={'message':{'text':answer}}
    }
    return send;
}

// 이 단어들이 처음에 위치하는지 검사
function internalControl2(msg,intent,answer){
    for(var i in intent){
        if(msg.search(intent[i]) == 0)
            send={'message':{'text':answer}}
    }
    return send;
}

// 이 단어들이 유일하게 쓰였거나 가장 처음에 쓰였을 때
function internalControl3(msg,intent,answer){
    for(var i in intent){
        if((msg.search(intent[i]) == 0 && msg.length == intent[i].length) 
        || msg.search(intent[i]+" ") == 0)
            send={'message':{'text':answer}}
    }
    return send;
}

// 이 단어들이 유일하게 쓰였는지 검사
function internalControl3(msg,intent,answer){
    for(var i in intent){
        if(msg.search(intent[i]) == 0 && msg.length == intent[i].length)
            send={'message':{'text':answer}}
    }
    return send;
}