"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const Schema = mongoose.Schema; 

let ctSchema = new Schema({
    CityID: { type: Number },
    City: { type: String },
    Town: { type: String },
    Postal: { type : Number }
}, {
	collection: 'city'
});

let ctOwnerModel = dbAuth.owner.model('city', ctSchema);
let ctUserModel = dbAuth.user.model('city', ctSchema);

function CT(ct) {
    this.CityID = ct.CityID;
    this.City = ct.City;
    this.Town = ct.Town;
    this.Postal = ct.Postal;
}

CT.prototype.save = function(cb) {
    let ct = {
        CityID: this.CityID,
        City: this.City,
        Town: this.Town,
        Postal: this.Postal,
    }

    let newCt = new ctOwnerModel(ct);

    newCt.save(function(err) {
        if(err) {
            return cb(err);
        }
        return cb(null);
    });
}

CT.getCityNameGroup = function(cb) {
    ctUserModel.aggregate([
        {
            $group: {
                _id: '$City',
            }
        }
    ], (err, doc) => {
        if(err) {
            cb(err);
        } else {
            cb(null, doc);
        }
    });
}

CT.getTownByCity = function(city, cb) {
    ctUserModel.find({'City': city}, {'Town': true, 'CityID': true}, (err, docs) => {
        if(err) {
            cb(err);
        } else {
            cb(null, docs);
        }
    });
}

module.exports = CT;