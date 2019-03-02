const SSFUNC = require('../function/stepSwitchFunction.js');


module.exports =  {
    typeSwitch: ((type, event) => {
        console.log('typeSwitch');
        switch(type.Type) {
          case '1': //儲存筆記
             SSFUNC.stepSwitchForNote(type.Step, event);
            break;
          case '2': //查詢筆記
            SSFUNC.stepSwitchForSearchNote(type.Step, event);
            break;
          case '3': //群體廣播
            SSFUNC.stepSwitchForBC(type.Step, event);
            break;
          case '4': //存取身體數值
            SSFUNC.stepSwitchForBD(type.Step, event);
            break;
          case '5': //註冊會員
            SSFUNC.stepSwitchForU(type.Step, event);
            break;
          case '6': //設定天氣地點
            SSFUNC.stepSwitchForWTL(type.Step, event);
            break;
          case '7': //設定血壓值
            SSFUNC.stepSwitchForBP(type.Step, event);
            break;
          case '8': //紀錄 今天吃啥
            SSFUNC.stepSwitchForEat(type.Step, event);
            break;
          case '9': //修改 今天吃啥
            SSFUNC.stepSwitchForFixEat(type.Step, event);
            break;
          case '10': //英文考試
            // SSFUNC.stepSwitchForEQ(type.Step, event);
            break;
          case '11': //媽媽算帳
            SSFUNC.stepSwitchForMMC(type.Step, event);
            break;
          case '12': //pk
            SSFUNC.stepSwitchForPK(type.Step, event);
            break;
          case '13': //pk請求
            SSFUNC.stepSwitchForPkRequest(type.Step, event);
            break;
          case '14': //修改遊戲名稱
            SSFUNC.stepSwitchForReName(type.Step, event);
            break;
          case '15': //召喚怪物
            SSFUNC.stepSwitchForCallMonster(type.Step, event);
            break;
          case '16': //創建怪物
            SSFUNC.stepSwitchForCreateMonster(type.Step, event);
            break;
          case '17': //註冊遊戲帳號
            SSFUNC.stepSwitchForGameRegister(type.Step, event);
            break;
          case '18': //等待pk
            SSFUNC.waitForPk(type.Step, event);
            break;
        }
    })
}