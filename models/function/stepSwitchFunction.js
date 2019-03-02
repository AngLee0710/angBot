const FUNC = require('../function/function.js');
const Gfunc = require('../function/gameFuction.js');

module.exports = {
    stepSwitchForBD: ((step, event) => {
        console.log('stepSwitchForBD');
        switch(step) {
          case 1:
            FUNC.saveBodyDetailStep2(event);
            break;
          case 2:
            FUNC.saveBodyDetailStep3(event);
            break;
          case 3:
            FUNC.saveBodyDetailStep4(event);
            break;
        }
      }),
      stepSwitchForU: ((step, event) => {
        console.log('stepSwitchForU');
        switch(step) {
          case 1:
            FUNC.registerStep2(event);
            break;
          case 2:
            FUNC.registerStep3(event);
            break;
        }
      }),
      //廣播
      stepSwitchForBC: ((step, event) => {
        console.log('stepSwitchForBC');
        switch(step) {
          case 1:
            FUNC.broadcastStep2(event);
            break;
        }
      }),
      //設定天氣地點
      stepSwitchForWTL: ((step, event) => {
        console.log('stepSwitchForWTL');
        switch(step) {
          case 1:
            FUNC.setLocationStep2(event);
            break;
          case 2:
            FUNC.setLocationStep3(event);
        }
      }),
      //記錄血壓
      stepSwitchForBP: ((step, event) => {
        console.log('stepSwitchForBP');
        switch(step) {
          case 1:
            FUNC.bloodPressureStep2(event);
            break;
          case 2:
            FUNC.bloodPressureStep3(event);
            break;
          case 3:
            FUNC.bloodPressureStep4(event);
            break;
        }
      }),
      //回憶一下今天吃什麼?
      stepSwitchForEat: ((step, event) => {
        console.log('stepSwitchForEat');
        switch(step) {
          case 1:
            FUNC.remindFoodStep2(event);
            break;
          case 2:
            FUNC.remindFoodStep3(event);
            break;
        }
      }),
      //修改今天吃啥?
      stepSwitchForFixEat: ((step, event) => {
        console.log('stepSwitchForFixEat');
        switch(step) {
          case 1:
            FUNC.fixRemindFoodStep2(event);
            break;
        }
      }),
      //媽媽算帳
      stepSwitchForMMC: ((step, event) => {
        console.log('stepSwitchForMMC');
        switch(step) {
          case 1:
            FUNC.mamaCountStep2(event);
            break;
          case 2:
            FUNC.mamaCountStep3(event);
            break;
          case 3:
            FUNC.mamaCountStep4(event);
            break;
          case 4:
            FUNC.mamaCountStep5(event);
            break;
          case 5:
            FUNC.mamaCountStep6(event);
            break;
          case 6:
            FUNC.mamaCountStep7(event);
            break;
          case 7:
            FUNC.mamaCountStep8(event);
            break;
          
        }
      }),
      //筆記
      stepSwitchForNote: ((step, event) => {
        console.log('stepSwitchForNote');
        switch(step) {
          case 1:
            FUNC.noteStep2(event);
            break;
          case 2:
            FUNC.noteStep3(event);
            break;
        }
      }),
      //查詢筆記
      stepSwitchForSearchNote: ((step, event) => {
        console.log('stepSwitchForSearchNote');
        switch(step) {
          case 1:
            FUNC.findNoteStep2(event);
            break;
        }
      }),
      //pk
      stepSwitchForPK: ((step, event) => {
        console.log('stepSwitchForPK');
        switch(step) {
          case 1:
            Gfunc.pkStep2(event);
            break;
          case 2:
            Gfunc.pkStep3(event);
            break;
        }
      }),
      stepSwitchForPkRequest: ((step, event) => {
        console.log('stepSwitchForPkRequest');
        switch(step) {
          case 1:
            Gfunc.pkRequest(event);
            break;
        }
      }),
      stepSwitchForReName: ((step, event) => {
        console.log('stepSwitchForReName');
        switch(step) {
          case 1:
            Gfunc.setGameNameStep2(event);
            break;
        }
      }),
      stepSwitchForCallMonster: ((step, event) => {
        console.log('stepSwitchForCallMonster');
        switch(step) {
          case 1:
            callMonsterStep2(event);
            break;
          case 2: 
            break;
        }
      }),
      stepSwitchForCreateMonster: ((step, event) => {
        console.log('stepSwitchForCreateMonster');
        switch(step) {
          case 1:
            Gfunc.createMonsterStep2(event);
            break;
          case 2:
            Gfunc.createMonsterStep3(event);
            break;
        }
      }),
      stepSwitchForGameRegister: ((step, event) => {
        console.log('stepSwitchForRigester');
        switch(step) {
          case 1:
            Gfunc.registerStep2(event);
          case 2:
            Gfunc.registerStep3(event);
        }
      }),
      waitForPk: ((step, event) => {
        console.log('waitForPk');
        switch(step) {
          case 1:
            Gfunc.waitForPk(event);
        }
      })
}