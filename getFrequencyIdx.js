// 가장 많이 등장한 단어의 idx 추출
module.exports.GetFrequencyIdx = function(str){ // str은 물음에 대한 대상 배열
    maxCount = 0;
    idx = 0;

    for(var i=0; i<str.length; i++){
        if(str[i] == "") // 공백 처리된
            continue;

        base = str[i];
        count = 0;
        
        for(var j=i+1; j<str.length; j++){
            if(base == str[j])
                count++;
        }
        if(count >= maxCount){
            maxCount = count; // maxCount는 가장 많이 등장한 단어 빈도 수
            idx = i;
        }
    }
    return idx;
}