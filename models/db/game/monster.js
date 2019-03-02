"use strict"
const mongoose = require('mongoose');
const dbAuth = require('../cfg/db.js');
const reSchema = mongoose.Schema; 

let Schema = new reSchema({
    ID: { type: Number },
    Name: { type: String },
    maxHP: { type: Number, default: 100 },
    HP: { type: Number, default: 100 },
    maxMP: { type: Number, default: 50 },
    MP: { type: Number, default: 50 },
    Exp: { type: Number, default: 0 },
    Lv: { type: Number, default: 1 },
    Skill: [],
    CT: { type: Number, default: Date.now }
}, {
	collection: 'monster'
});

let ownerModel = dbAuth.owner.model('monster', Schema);
let userModel = dbAuth.user.model('monster', Schema);

function object(obj) {
    this.Name = obj.Name;
    this.maxHP = obj.maxHP;
    this.HP = this.maxHP;
}

object.prototype.save = function(cb) {

    userModel.count({}, (err, count) => {
        if(err) {
            return cb(err);
        } else {
            let object = {
                ID: count + 1,
                Name: this.Name,
                maxHP: this.maxHP,
                HP: this.HP,
            }

            let newOBJ = new ownerModel(object);

            newOBJ.save(function(err) {
                if(err) {
                    return cb(err);
                }
                return cb(null);
            });

        }
    })

}

object.generate = function(cb) {
    userModel.findOne({}, {'Name': true, 'HP': true, 'MP': true, 'Skill': true}, (err, monster) => {
        if(err) {
            cb(err);
        } else {
            cb(null, monster);
        }
    })
}

module.exports = object;