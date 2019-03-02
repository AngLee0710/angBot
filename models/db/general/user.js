"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const Schema = mongoose.Schema; 

let USchema = new Schema({
    LineID: { type: String },
    Name: { type: String },
    Birthday: { type : Number },
    Height: { type: Number },
    Location: {type: Number},
    AT: { type: Number, default: new Date().getTime() },
    Display: { type: Boolean, default: true }
}, {
	collection: 'user'
});

let UOwnerModel = dbAuth.owner.model('user', USchema);
let UUserModel = dbAuth.user.model('user', USchema);

function U(u) {
    this.LineID = u.LineID;
    this.Name = u.Name;
    this.Birthday = u.Birthday;
    this.Height = u.Height;
}

U.prototype.save = function(cb) {
    let u = {
        LineID: this.LineID,
        Name: this.Name,
        Birthday: this.Birthday,
        Height: this.Height
    }

    let newU = new UOwnerModel(u);

    newU.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

U.isExist = function(id, cb) {
    UUserModel.findOne({'LineID': id}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

U.getBirthDay = function(id, cb) {
    UUserModel.findOne({'LineID': id}, {'Birthday': true}, (err, doc) => {
        if(err) {
            cb(err)
        } else {
            cb(null, doc)
        }
    });
}

U.getAllId = function(cb) {
    UUserModel.find({'Display': true},{'LineID': true} , (err, doc) => {
        if(err) {
            cb(err)
        } else {
            cb(null, doc)
        }
    });
}

//更新地點
U.updateLocation = function(id, location, cb) {
    UOwnerModel.updateOne({'LineID': id},{$set: {'Location': location}}, (err, doc) => {
        if(err) {
            cb(err)
        } else {
            cb(null, doc)
        }
    });
}

U.getLocation = function(id, cb) {
    UUserModel.findOne({'LineID': id}, {'Location': true}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

U.getHeight = function(id, cb) {
    UUserModel.findOne({'LineID': id}, {'Height': true}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            if(doc)
                cb(null, doc.Height);
            else 
                cb(null, null);
        }
    });
}

U.getName = function(id, cb) {
    UUserModel.findOne({'LineID': id}, {'Name': true}, (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc.Name);
        }
    })
}

U.getAll = function(cb) {
    UUserModel.find({}, (err, docs) => {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    })
}

module.exports = U;