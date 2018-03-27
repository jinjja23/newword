module.exports.CheckPopularWord = function(msg, intent, flag){
    for(var i in intent){ // 질문이 유행, 최근에 자주 받는 지에 관한 것인지 검사
        if(msg.search(intent[i]) >= 0){
            if(msg.search("내가")<0 && msg.search("나는")<0 && msg.search("난")<0){
                flag = 3;
                console.log("popularWord 처리");
                break;            
            }
        }
    }
    return flag;
}