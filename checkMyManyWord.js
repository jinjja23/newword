module.exports.CheckMyManyWord = function(msg, intent, flag){
    for(var i in intent){ // 내가 많이 묻는 신조어가 무엇인지에 대한 검사
        if(msg.search(intent[i]) >= 0){
            if(msg.search("내가")>=0 || msg.search("나는")>=0 || msg.search("난")>=0){
                flag = 6;
                console.log("myManyQuestion 처리");
                break;
            }
        }
    }
    return flag;
}