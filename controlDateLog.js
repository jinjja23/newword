module.exports.getTodayLog = function(items){
    date = new Date().getDate(); // getDay()는 요일에 대한 index

    purpose = [];
    for(var i in items){
        if(items[i].time.getDate() == date){
            purpose.push(items[i]);
        }
    }
    return purpose;
}

module.exports.getThisMonthLog = function(items){
    purpose = [];
    for(var i in items){
        if(items[i].time.getDate() >=1)
            purpose.push(items[i]);
    }
    return purpose;
}

module.exports.getInMonthLog = function(items){
    date = new Date();
    date.setMonth(date.getMonth()-1);

    purpose = [];
    for(var i in items){
        if(items[i].time >= date)
            purpose.push(items[i]);
    }
    return purpose;
}
