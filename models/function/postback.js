const FUNC = require('../function/function.js');

module.exports = {
    postbackSwitch: function(data, event) {
        switch(data) {
            case '筆記紀錄':
              FUNC.noteStep1(event);
              break;
            case '筆記索引查詢':
              FUNC.findNoteIndex(event);
              break;
            case '筆記查詢':
              FUNC.findNoteStep1(event);
              break;
          }
    }
}