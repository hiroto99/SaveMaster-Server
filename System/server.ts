const fs = require('fs');

function new_user(username, userid, password){
    var json = fs.readFileSync("/workspaces/SaveMaster-Server/System/server.json", "utf-8");
    json = JSON.parse(json);
    var jsondata = json.user;
    var ondata = jsondata.filter(function (item) {
        return item.username = username;
    });
    if(ondata = []){
        const newuserobj = {
            username: username,
            userid: userid,
            password: password
        }
        jsondata.push(newuserobj)
        fs.writeFileSync("/workspaces/SaveMaster-Server/System/server.json", jsondata)
        return(newuserobj);
    }else{
        return(null) //アカウント登録済みの場合はここで止まる
    }
}

function loaduser(username){
    var json = fs.readFileSync("/workspaces/SaveMaster-Server/System/server.json", "utf-8");
    json = JSON.parse(json);
    var jsondata = json.user;
    var ondata = jsondata.filter(function (item) {
        return item.username = username;
    });
    if(ondata = [null]){
        const datareturn = {
            username: username,
            userid: null,
            password: null
        };
        return(datareturn)
    }
    const datareturn = {
        username: ondata.username,
        userid: ondata.userid,
        password: ondata.password
    };
    return(datareturn);
}
module.exports = {new_user,loaduser};