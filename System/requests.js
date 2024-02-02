const { get, setMaxIdleHTTPParsers } = require('http');
const { resolve } = require('path');
const { exit } = require('process');
const Scloudjs = require('scloudjs');
const { promiseHooks } = require('v8');
const fs = require('fs');
const servercode = require('./server.ts');
const { syncBuiltinESMExports } = require('module');
let clouddata = new Object();

const Sprocess = (data)=>{
    var temp = Scloudjs.parsedata(data,clouddata); //受け取ったメッセージを整理する
    clouddata = temp.clouddatas; //クラウド変数のデータ
    const changedlists = temp.changedlists; //変更された変数一覧
    const httppost = getdata(clouddata["responce_post_type"].value); //変数を文字列にする
    const send_1 = getdata(clouddata["responce_send_1"].value);
    const send_2 = getdata(clouddata["responce_send_2"].value);
    const send_3 = getdata(clouddata["responce_send_3"].value);
    const okbinary = getbite("OK"); //変数をバイナリにする
    if(httppost=="new_user"){
        var user = servercode.new_user(send_1, send_2, send_3);
        var send_binary = {
            one: getbite(user.username),
            two: getbite(user.userid),
            three: getbite(user.password)
        }; //変数をバイナリにする
        Scloudjs.sendtocloud("responce_receive1", send_binary.one); //変数を変える
        clouddata["responce_receive1"].value = send_binary.one; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
        sleep(0.75);
        Scloudjs.sendtocloud("responce_receive2", send_binary.two); //変数を変える
        clouddata["responce_receive2"].value = send_binary.two; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
        sleep(0.75);
        Scloudjs.sendtocloud("responce_receive3", send_binary.three); //変数を変える
        clouddata["responce_receive3"].value = send_binary.three; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
    }else if(httppost=="userget"){
        var user = servercode.loaduser(send_1)
        var send_binary = {
            one: getbite(String(user.username)),
            two: getbite(String(user.userid)),
            three: getbite(String(user.password))
        }; //変数をバイナリにする
        Scloudjs.sendtocloud("responce_receive1", send_binary.one); //変数を変える
        if(clouddata["responce_receive1"] !== undefined){
            clouddata["responce_receive1"].value = send_binary.one; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
        }
        sleep(0.75);
        Scloudjs.sendtocloud("responce_receive2", send_binary.two); //変数を変える
        if(clouddata["responce_receive2"] !== undefined){
            clouddata["responce_receive2"].value = send_binary.two; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
        }
        sleep(0.75);
        Scloudjs.sendtocloud("responce_receive3", send_binary.three); //変数を変える
        if(clouddata["responce_receive3"] !== undefined){
            clouddata["responce_receive3"].value = send_binary.three; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
        }
    }
    sleep(0.75);
    Scloudjs.sendtocloud("responce_status", okbinary); //変数を変える
    clouddata["responce_status"].value = okbinary; //自分で設定したクラウド変数はメッセージとしてデータをもらうことができないので自分で設定する
    exit(0)
};
Scloudjs.setdatas("SaveMaster_Admin","savemaster0001","958914898",Sprocess);//いろいろデータを設定する

function getdata(binary){
    var json = fs.readFileSync("/workspaces/SaveMaster-Server/System/systemconfig.json", "utf-8");
    var json = JSON.parse(json);
    const textdata = json.textdata;
    let str = "";
    let s = "";
    for(i=0; i<binary.length; i=i+2){
        if(binary[i] = 0){
            s = binary[i+1];
        }else{
            s = binary[i] + binary[i+1];
        }
        str = str + textdata[s-1];
    }
    return str;
}

function getbite(text){
    var json = fs.readFileSync("/workspaces/SaveMaster-Server/System/systemconfig.json", "utf-8");
    var json = JSON.parse(json);
    const textdata = json.textdata;
    let bite = "";
    let s = "";
    let s2 = "";
    for(i=0; i<text.length; i++){
        s = textdata.indexOf(text[i])+1;
        if(s < 10){
            s2 = "0" + String(s);
        }else{
            s2 = String(s);
        }
        bite = bite + s2
    }
    return bite;
}

function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
}

const func = async()=>{
    await Scloudjs.login().catch((code) => { console.error("error:" + code); }); //scratchにログイン
    await Scloudjs.connect().catch((code) => { console.error("error:" + code); }); //scratchのクラウド変数サーバーに接続
    Scloudjs.handshake(); //プロジェクトに接続
};
func()