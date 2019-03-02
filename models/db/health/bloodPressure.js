"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const Schema = mongoose.Schema; 

let bpSchema = new Schema({
    LineID: { type: String },
    Date: { type: Number, default: Date.now },
    SBP: { type: Number },
    DBP: { type : Number },
    Pulse: { type: Number }
}, {
	collection: 'bloodPressure'
});

let bpOwnerModel = dbAuth.owner.model('bloodPressure', bpSchema);
let bpUserModel = dbAuth.user.model('bloodPressure', bpSchema);

function BP(bp) {
    this.LineID = bp.LineID;
    this.SBP = bp.SBP;
    this.DBP = bp.DBP;
    this.Pulse = bp.Pulse;
}

BP.prototype.save = function(cb) {
    let bp = {
        LineID: this.LineID,
        SBP: this.SBP,
        DBP: this.DBP,
        Pulse: this.Pulse
    }

    let newBp = new bpOwnerModel(bp);

    newBp.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

BP.getAllHistory = function(id, cb) {
    bpUserModel.find({'LineID': id}, (err, docs) => {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    })
}

module.exports = BP;