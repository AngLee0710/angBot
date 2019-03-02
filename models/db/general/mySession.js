"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const Schema = mongoose.Schema; 

let sessionSchema = new Schema({
    LineID: { type: String },
    Temp:[ {} ],
    Type: { type: String },
    Step: { type: Number, default: 1 },
    CT: {type: Number, default: Date.now}
}, {
	collection: 'mySession'
});

let sessionOwnerModel = dbAuth.owner.model('mySession', sessionSchema);
let sessionUserModel = dbAuth.user.model('mySession', sessionSchema);

function Session(session) {
    this.LineID = session.LineID;
    this.Temp = session.Temp;
    this.Type = session.Type;
    this.Step = session.Step;
}

Session.prototype.save = function(cb) {
    let session = {
        LineID: this.LineID,
        Temp: this.Temp,
        Type: this.Type,
        Step: this.Step
    }

    let newSession = new sessionOwnerModel(session);

    newSession.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}
//globel
let attackSkill = ['卸除防禦', '奮力一擊', '防禦', '治癒'];

// Session是否存在
Session.isSession = function(id, cb) {
    sessionUserModel.findOne({'LineID': id}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

// 刪除Session
Session.removeSession = function(id, cb) {
    sessionOwnerModel.deleteOne({'LineID': id}, (err) => {
        if(err) {
            cb(err);
        } else {
            cb(null);
        }
    });
}

// 修改Session Step
Session.pushSessionStep = function(id, step, push, cb) {
    sessionOwnerModel.updateOne({'LineID': id}, { $set: {'Step': step}, $push: {'Temp': push} }, (err) => {
        if(err) {
            cb(err);
        } else {
            cb(null);
        }
    });
}

// 暫時紀錄
Session.recordSession = function(id, ans ,cb) {
    sessionOwnerModel.updateOne({'LineID': id}, { $set: {'Temp': ans} }, (err) => {
        if(err) {
            cb(err);
        } else {
            cb(null);
        }
    });
}

Session.attack = function(selfLineID, enemyLineID, attack, cb) {
    sessionUserModel.findOne({ 'LineID': selfLineID }, (err, selfSessionInfo) => {
        if(err) {
            cb(err)
        } else {
            sessionOwnerModel.findOne({ 'LineID': enemyLineID }, (err, enemySessionInfo) => {
                if(err) {
                    cb(err);
                } else {
                    if(selfSessionInfo.Temp[0].attackStatus && enemySessionInfo.Temp[0].attackStatus) { //先攻會進入此
                        let selfTemp = {
                            id: enemyLineID, //敵人ID
                            attack: attack,  //自己的攻擊
                            attackStatus: false //狀態改成不可攻擊
                        }
                        sessionOwnerModel.updateOne({'LineID': selfLineID}, 
                        { $set: { 'Temp': selfTemp, } }, (err, doc) => {
                            if(err) {
                                cb(err);
                            } else {
                                cb(null, 10);
                            }
                        })  
                    } else { //後功進入此
                        let beforettack = enemySessionInfo.Temp[0].attack;
                        let afterTemp = {
                            id: enemyLineID,
                            attack: 'unknow',
                            attackStatus: true
                        }
                        sessionOwnerModel.updateOne({'LineID': selfLineID}, 
                        { $set: { 'Temp': afterTemp, } }, (err, doc) => {
                            if(err) {
                                cb(err);
                            } else {
                                let beforeTemp = {
                                    id: selfLineID,
                                    attack: 'unknow',
                                    attackStatus: true
                                }
                                sessionOwnerModel.updateOne({'LineID': enemyLineID}, 
                                { $set: { 'Temp': beforeTemp, } }, (err, doc) => {
                                    if(err) {
                                        cb(err);
                                    } else {
                                        if(beforettack == attackSkill[0]) {
                                            cb(null, attackCharge1(attack))
                                        } else if(beforettack == attackSkill[1]) {
                                            cb(null, attackCharge2(attack))
                                        } else if(beforettack == attackSkill[2]) {
                                            cb(null, attackCharge3(attack))
                                        } else if(beforettack == attackSkill[3]) {
                                            cb(null, attackCharge4(attack))
                                        }
                                    }
                                })
                            }
                        })  
                    }
                }
            })
        }
    })
}

module.exports = Session;


//[0]
//輕敲試探
function attackCharge1(selfAttack) {
    if(selfAttack == attackSkill[0])
        return 1;
    else if(selfAttack == attackSkill[1])
        return 2;
    else if(selfAttack == attackSkill[2])
        return 3;
    else if(selfAttack == attackSkill[3])
        return 11;
}

//[1]
//奮力一擊
function attackCharge2(selfAttack) {
    if(selfAttack == attackSkill[0])
        return 4;
    else if(selfAttack == attackSkill[1])
        return 5;
    else if(selfAttack == attackSkill[2])
        return 6;
    else if(selfAttack == attackSkill[3])
        return 12;
}

//[2]
//防禦
function attackCharge3(selfAttack) {
    if(selfAttack == attackSkill[0])
        return 7;
    else if(selfAttack == attackSkill[1])
        return 8;
    else if(selfAttack == attackSkill[2])
        return 9;
    else if(selfAttack == attackSkill[3])
        return 13;
}

//[3]
//治癒
function attackCharge4(selfAttack) {
    if(selfAttack == attackSkill[0])
        return 14;
    else if(selfAttack == attackSkill[1])
        return 15;
    else if(selfAttack == attackSkill[2])
        return 16;
    else if(selfAttack == attackSkill[3])
        return 17;
}