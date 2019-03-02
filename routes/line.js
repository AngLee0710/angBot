"use strict";
const FUNC = require('../models/function/function.js');
const MFUNC = require('../models/function/mainFunction.js');
const TFUNC = require('../models/function/typeFunction.js');
const SE = require('../models/db/general/mySession.js');
const PB = require('../models/function/postback.js');


module.exports = function(app, bot, linebotParser) {
  //
  //bot
  //

  app.post('/linewebhook', linebotParser);

  bot.on('follow', (event) => {
    FUNC.registerStep1(event);
  });

  bot.on('message', (event) => {
    SE.isSession(event.source.userId, (err, type) => {
      if(err) {
        ifErr(err, event);
      } else if(type) {
        TFUNC.typeSwitch(type, event);
      } else {
        MFUNC.mainSwitch(event);
      }
    });
  });

  bot.on('postback', (event) => {
    SE.isSession(event.source.userId, (err ,type) => {
      if(err) {
        ifErr(err, event);
      } else if(!type) {
        PB.postbackSwitch(event.postback.data, event);
      }
    })
  })  
}

function ifErr(err, event) {
  console.log(err);
  event.reply('看一下你的伺服器');
}