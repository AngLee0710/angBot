"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const reSchema = mongoose.Schema; 

let Schema = new reSchema({
    LineID: { type: String },
    Name: { type: String },
    maxHP: { type: Number, default: 200 },
    HP: { type: Number, default: 200 },
    maxMP: { type: Number, default: 100 },
    MP: { type: Number, default: 100 },
    Exp: { type: Number, default: 0},
    Lv: {type: Number, default: 1},
    Win: {type: Number, default: 0},
    Lose: {type:Number, default: 0},
    CT: { type: Number, default: Date.now }
}, {
	collection: 'charactor'
});

let ownerModel = dbAuth.owner.model('charactor', Schema);
let userModel = dbAuth.user.model('charactor', Schema);

function object(obj) {
    this.LineID = obj.LineID;
    this.Name = obj.Name;
}

object.prototype.save = function(cb) {
    let object = {
        LineID: this.LineID,
        Name: this.Name
    }

    let newOBJ = new ownerModel(object);

    newOBJ.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

object.isPlayer = function(selfLineId, cb) {
    userModel.findOne({ 'LineID': selfLineId }, (err, player) => {
        if(err) {
            return cb(err);
        } else {
            let boolen = false;
            if(player) {
                boolen = true;
            }
            return cb(null ,boolen);
        }
    })
}

object.getAnotherCharactor = function(cb) {
    userModel.find({}, {'LineID': true, 'Name': true}, (err, users) => {
        if(err) {
            cb(err);
        } else {
            cb(null, users);
        }
    })
}

object.getLineId = function(name, cb) {
    userModel.findOne({'Name': name}, {'LineID': true}, (err, player) => {
        if(err) {
            cb(err);
        } else {
            cb(null, player.LineID);
        }
    })
}

object.attack = function(enemyId, damage, cb) {
    userModel.findOne({'_id': enemyId}, {'HP': true}, (err, player) => {
        if(err) {
            console.log(err);
        } else {
            let newHP = player.HP - damage;
            ownerModel.updateOne({'_id': enemyId}, {$set: {HP: newHP}}, (err, doc) => {
                if(err) {
                    cb(err);
                } else {
                    userModel.findOne({'_id': enemyId}, {'HP': true}, (err, player) => {
                        let HP = player.HP;
                        if(err) {
                            cb(err);
                        } else {
                            cb(null, HP);
                        }
                    })
                }
            })
        }
    })
}

object.attackByLineID = function(LineID, damage, cb) {
    userModel.findOne({'LineID': LineID}, {'HP': true}, (err, player) => {
        if(err) {
            cb(err);
        } else {
            let newHP = player.HP - damage;
            ownerModel.updateOne({'LineID': LineID}, {$set: {HP: newHP}}, (err, doc) => {
                if(err) {
                    cb(err); 
                } else {
                    cb(null, newHP);
                }
            })
        }
    })
}

object.getName = function(enemyId, cb) {
    console.log(enemyId);
    userModel.findOne({'_id': enemyId}, {'Name': true}, (err, player) => {
        if(err) {
            cb(err);
        } else {
            cb(null, player.Name);
        }
    })
}

object.getNameByLineId = function(enemyId, cb) {
    console.log(enemyId);
    userModel.findOne({'LineID': enemyId}, {'Name': true}, (err, player) => {
        if(err) {
            cb(err);
        } else {
            cb(null, player.Name);
        }
    })
}

object.reliveByLineID = function(enemyId, cb) {
     userModel.findOne({'LineID': enemyId}, {'maxHP': true}, (err, player) => {
         if(err) {
             console.log(err);
         } else {
             ownerModel.updateOne({'LineID': enemyId}, {$set: {'HP': player.maxHP}}, (err) => {
                 if(err) {
                     cb(err);
                 } else {
                     cb(null);
                 }
             })
         }
     })
}

object.healByLineID = function(selfLineID, heal, cb) {
    userModel.findOne({'LineID': selfLineID}, (err, player) => {
        if(err) {
            cb(err);
        } else {
            let newHP = heal + player.HP;
            if(newHP > player.maxHP) {
                newHP = player.maxHP;
            }
            ownerModel.updateOne({'LineID': selfLineID}, {$set:{'HP': newHP}}, (err) => {
                if(err) {
                    cb(err);
                } else {
                    cb(null, newHP);
                }
            }) 
        }
    })
}

object.setName = function(LineId, Name, cb) {
    ownerModel.updateOne({'LineID': LineId}, {$set: {'Name': Name}}, (err) => {
        if(err) {
            cb(err);
        } else {
            cb(null);
        }
    })
}

object.recordPerformance = function(winLineID, loseLineID, cb) {
    ownerModel.updateOne({'LineID': winLineID}, {$inc: {'Win': 1}}, (err) => {
        if(err) {
            cb(err)
        } else {
            ownerModel.updateOne({'LineID': loseLineID}, {$inc: {'Lose': 1}}, (err) => {
                if(err) {
                    cb(err);
                } else {
                    cb(null);
                }
            })
        }
    })
}

module.exports = object;