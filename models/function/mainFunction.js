const FUNC = require('../function/function.js');
const LBM = require('../linebotMenu/lineBotMenu.js');
const Gfunc = require('../function/gameFuction.js');


module.exports = {
    mainSwitch: ((event) => {
        console.log('mainSwitch');
        let text = event.message.text;
        switch(text) {
          case 'a1':
          case '紀錄身體數值':
            FUNC.saveBodyDetailStep1(event);
            break;
          case 'a2':
          case '紀錄血壓':
            FUNC.bloodPressureStep1(event);
            break;
          case 'a3':
          case '記錄今天吃啥?':
            FUNC.remindFoodStep1(event);
            break;
          case 'a4':
          case '修改今天吃啥?':
            FUNC.fixRemindFoodStep1(event);
            break;
          case 'b1':
          case '每日消耗熱量計算':
            FUNC.myBodyDetail(event);
            break;
          case 'b2':
          case '血壓記錄歷史':
            FUNC.readBloodPressureHistory(event);
            break;
          case 'b3':
          case '身體數值歷史數據':
            FUNC.getHistoryBodyDetail(event);
            break;
          case 'b4':
          case '我的體重變化':
            FUNC.myWeightChange(event);
            break;
          case 'b5':
          case '我都吃了啥?':
            FUNC.remindFoodHistory(event);
            break;
          case '算帳':
            FUNC.mamaCountStep1(event);
            break;
          case '目前體重':
            FUNC.nowWeight(event);
            break;
          case '伺服器時間':
            FUNC.atTime(event);
            break;
          case '今天天氣如何?':
            FUNC.todayWeather(event);
            break;
          case '廣播':
            FUNC.broadcastStep1(event);
            break;
          case '筆記':
            event.reply(LBM.note);
            break;
          case '查詢筆記索引':
            FUNC.findNoteIndex(event);
            break;
          case '查詢筆記':
            FUNC.findNoteStep1(event);
            break;
          case 'pk':
            Gfunc.pkStep1(event);
            break;
          case '註冊遊戲':
            Gfunc.registerStep1(event);
            break;
          case '修改遊戲名稱':
            Gfunc.setGameNameStep1(event);
            break;
          case 'system call calling monster':
          case '召喚魔物':
            Gfunc.callMonsterStep1(event);
            break;
          case '新增魔物':
            if(event.source.userId == 'U9e19e2b04f6f8d04e3eff75e32487dc6') {
              Gfunc.createMonsterStep1(event);
            } else {
              event.reply('需要管理權');
            }
            break;
          case 'load':
            if(event.source.userId == 'U9e19e2b04f6f8d04e3eff75e32487dc6') {
              Gfunc.load(event);
            } else {
              event.reply('需要管理權');
            }
            break;
          case 'test':
            Gfunc.promiseTest(event);
            break;
          case '？':
          case '?':
            let text = ['輸入代號即可', '紀錄類:\na1.記錄身體數值\na2.記錄血壓\na3.紀錄今天吃啥?\na4.修改今天吃啥?','查詢類:\nb1.每日消耗熱量計算\nb2.血壓記錄歷史\nb3.身體數值歷史數據\nb4.我的體重變化\nb5.我都吃了啥', 'iBody網頁:\n https://www.anglinebot2.ga/'];
            event.reply(text);
            break;
          default:
            console.log(event);
            break;
        }
    })
}