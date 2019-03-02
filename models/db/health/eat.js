"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const Schema = mongoose.Schema; 

let eatSchema = new Schema({
    LineID: { type: String },
    Date: { type: Number, default: Date.now },
    Eat: { type: String },
}, {
	collection: 'eat'
});

let eatOwnerModel = dbAuth.owner.model('eat', eatSchema);
let eatUserModel = dbAuth.user.model('eat', eatSchema);

function EAT(eat) {
    this.LineID = eat.LineID;
    this.Eat = eat.Eat;
}

EAT.prototype.save = function(cb) {
    let eat = {
        LineID: this.LineID,
        Eat: this.Eat,
    }

    let newEat = new eatOwnerModel(eat);

    newEat.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

EAT.getHistroy = function(id, cb) {
    eatUserModel.find({'LineID': id}, (err, docs) => {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    });
}

EAT.isEat = function(id, cb) {
    let date = new Date().getTime();
    let dateD = date - date % (24 * 60 * 60 * 1000);
    let dateT = dateD + (24 * 60 * 60 * 1000);
    eatUserModel.findOne({'LineID': id, 'Date': { $gt: dateD, $lt: dateT }}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    })
}

EAT.pushEat = function(id, text, cb) {
    let date = new Date().getTime();
    let dateD = date - date % (24 * 60 * 60 * 1000);
    let dateT = dateD + (24 * 60 * 60 * 1000);
    eatUserModel.findOne({'LineID': id, 'Date': { $gt: dateD, $lt: dateT }}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            let text2 = doc.Eat + '\n' + text;
            eatOwnerModel.updateOne({'_id': doc._id}, {$set: {'Eat': text2}}, (err) => {
                if(err) {
                    cb(err);
                } else {
                    cb(null);
                }
            })
        }
    });
}

EAT.updateEat = function(id, text, cb) {
    let date = new Date().getTime();
    let dateD = date - date % (24 * 60 * 60 * 1000);
    let dateT = dateD + (24 * 60 * 60 * 1000);
    eatUserModel.findOne({'LineID': id, 'Date': { $gt: dateD, $lt: dateT }}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            eatOwnerModel.updateOne({'_id': doc._id}, {$set: {'Eat': text}}, (err) => {
                if(err) {
                    cb(err);
                } else {
                    cb(null);
                }
            })
        }
    });
}

module.exports = EAT;