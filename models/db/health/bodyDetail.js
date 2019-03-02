"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const Schema = mongoose.Schema; 

let bdSchema = new Schema({
    LineID: { type: String },
    Date: { type: Number, default: Date.now },
    Weight: { type: Number },
    Fat: { type : Number, default: 9999 },
    Muscle: { type: Number, default: 9999 }
}, {
	collection: 'bodyDetail'
});

let bdOwnerModel = dbAuth.owner.model('bodyDetail', bdSchema);
let bdUserModel = dbAuth.user.model('bodyDetail', bdSchema);

function BD(bd) {
    this.LineID = bd.LineID;
    this.Weight = bd.Weight;
    this.Fat = bd.Fat;
    this.Muscle = bd.Muscle;
}

BD.prototype.save = function(cb) {
    let bd = {
        LineID: this.LineID,
        Weight: this.Weight,
        Fat: this.Fat,
        Muscle: this.Muscle
    }

    let newBd = new bdOwnerModel(bd);

    newBd.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

//最新的 體重 資訊
BD.getNewDetail = function(id, cb) {
    bdUserModel.findOne({'LineID': id}).sort({'Date': -1}).limit(1).exec((err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

//最新的體重
BD.getNewWeight = function(id, cb) {
    bdUserModel.findOne({'LineID': id}, {'Weight': true}).sort({'Date': -1}).limit(1).exec((err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

//所有身體數值
BD.getHistoryBodyDetail = function(id, cb) {
    bdUserModel.find({'LineID': id}, {'LineID': false}).sort({'Date': 1}).exec((err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

BD.limitWeek = function(id, cb) {
    bdUserModel.find({'LineID': id}, {'LineID' : false}).sort({'Date': -1}).limit(8).exec((err, docs) => {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    })
}

//目前的體重變化
BD.getWeightChange = function(id, cb) {
    bdUserModel.findOne({'LineID': id}, {'Date': true, 'Weight': true, 'Fat': true, 'Muscle': true}).sort({'Date': -1}).limit(1).exec((err, doc) => {
        if(err) {
            cb(err);
        } else {
            bdUserModel.findOne({'LineID': id}, {'Date': true, 'Weight': true, 'Fat': true, 'Muscle': true}).sort({'Date': 1}).limit(1).exec((err, doc2) => {
                if(err) {
                    cb(err);
                } else {
                    cb(null,doc.Date, doc2.Date, doc2.Weight - doc.Weight, doc2.Fat, doc.Fat, doc2.Muscle, doc.Muscle);
                }
            });
        }
    });
}

module.exports = BD;