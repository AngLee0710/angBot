"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const SCHEMA = mongoose.Schema; 

let Schema= new SCHEMA({
    LineID: { type: String },
    Date: { type: Number, default: Date.now },
    Title: { type: String },
    Context: { type: String }
}, {
	collection: 'note'
});

let OwnerModel = dbAuth.owner.model('note', Schema);
let UserModel = dbAuth.user.model('note', Schema);

function Construct(construct) {
    this.LineID = construct.LineID;
    this.Title = construct.Title;
    this.Context = construct.Context;
}

Construct.prototype.save = function(cb) {
    let construct = {
        LineID: this.LineID,
        Title: this.Title,
        Context: this.Context,
    }

    new OwnerModel(construct).save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

Construct.findIdex = function(id, cb) {
    UserModel.find({'LineID': id}, {'Title': true}, (err, docs) => {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    })
}

Construct.isExist = function(id, cb) {
    UserModel.findOne({'LineID': id}, {'Title': true}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    })
}

Construct.find = function(id, index, cb) {
    UserModel.findOne({'LineID': id, 'Title': index}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    })
}


module.exports = Construct;