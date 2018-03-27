module.exports.CheckCountWord = function(msg, intent, flag){
    for(var i in intent){ // 내가 이 신조어에 대해 몇 번 물었는 지에 대한 검사
        if(msg.search(intent[i]) >= 0){
            flag = 4;
            console.log("myCountQuestion 처리");
            break;
        }
    }
    return flag;
}