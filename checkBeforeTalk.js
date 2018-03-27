module.exports.CheckBeforeTalk = function(msg, intent, flag){
    for(var i in intent){ // 내가 바로 이전에 한 질문이 무엇인지에 대한 처리
        if(msg.search(intent[i]) >= 0){
            flag = 5;
            console.log("myBeforeTalk 처리");
            break;
        }
    }
    return flag;
}