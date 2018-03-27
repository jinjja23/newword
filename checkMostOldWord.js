module.exports.CheckMostOldWord = function(msg, intent, flag){
    for(var i in intent){ // 질문이 최신인지에 관한 것인지 검사
        if(msg.search(intent[i]) >= 0){
            flag = 2;
            console.log("oldBirthWord 처리");
            break;
        }
    }
    return flag;
}