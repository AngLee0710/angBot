"use strict"
const SE = require('../db/general/mySession.js');
const BD = require('../db/health/bodyDetail.js');
const U = require('../db/general/user.js');
const CT = require('../db/weather/city.js');
const BP = require('../db/health/bloodPressure');
const EAT = require('../db/health/eat.js');
const NOTE = require('../db/life/note.js');


const line = require('@line/bot-sdk');
const request = require('request');
const cheerio = require('cheerio');
const unidecode =  require('unidecode');

const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN1
});

const photoPATH = process.cwd() + '/upload/'

module.exports = {
    //儲存身體數值Step1 session = 4
    saveBodyDetailStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '4'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['進入身體數值儲存功能', '請輸入體重(純數字)'];
                event.reply(text);
            }
        });
    }),
    //儲存身體數值Step2
    saveBodyDetailStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不是text');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else {
                SE.pushSessionStep(event.source.userId, 2, { 'weigth': event.message.text }, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let text = ['體重為' + event.message.text +  'kg','請輸入體脂率(純數字)%','若只記錄純體重請輸入"save"'];
                        event.reply(text);
                    }
                });
            }
        }
    }),
    //儲存身體數值Step3
    saveBodyDetailStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不是text');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else if(event.message.text == 'save' || event.message.text == 'Save') {
                SE.isSession(event.source.userId, (err, doc) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let bd = new BD({
                            LineID: event.source.userId,
                            Weight: doc.Temp[0].weigth
                        }).save((err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        event.reply(['數據整合完畢', '您的體重為:' + doc.Temp[0].weigth + 'kg']);
                                    }
                                })
                            }
                        })
                    }
                });
            } else {
                SE.pushSessionStep(event.source.userId, 3, { 'fat': event.message.text }, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let text = ['體脂率為' + event.message.text +  '%','請輸入肌肉量(純數字)%','如果單純紀錄體重及體脂肪，請輸入"save"'];
                        event.reply(text);
                    }
                });
            }   
        }
    }),
    //儲存身體數值Step4
    saveBodyDetailStep4: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不是text');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else if (event.message.text == 'save' || event.message.text == 'Save') {
                SE.isSession(event.source.userId, (err, doc) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let bd = new BD({
                            LineID: event.source.userId,
                            Weight: doc.Temp[0].weigth,
                            Fat: doc.Temp[1].fat
                        }).save((err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        event.reply(['數據整合完畢','體重:' + doc.Temp[0].weigth + 'kg\n體脂肪率:' + doc.Temp[1].fat + '%']);
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                SE.isSession(event.source.userId, (err, doc) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        // console.log(doc);
                        let bd = new BD({
                            LineID: event.source.userId,
                            Weight: doc.Temp[0].weigth,
                            Fat: doc.Temp[1].fat,
                            Muscle: event.message.text
                        }).save((err) => {
                            if(err) {
                                ifErr(err);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err);
                                    } else {
                                        let text = ['數據整合完畢', '體重:' + doc.Temp[0].weigth + 'kg\n體脂肪率:' + doc.Temp[1].fat + '%\n肌肉量:' + event.message.text + '%', '資料儲存完畢'];
                                        event.reply(text);
                                    }
                                })
                            }
                        })
                    }
                });
            }
        }
    }),
    //註冊會員Step1 session = 5
    registerStep1: ((event) => {
        U.isExist(event.source.userId, (err, doc) => {
            if(err) {
                ifErr(err, event);
            } else if(!doc) {
                let se = new SE({
                    LineID: event.source.userId,
                    Type: '5'
                }).save((err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.source.profile().then((data) => {
                            let text = ['嗨囉~' + data.displayName, '由於資料庫上沒有你的資料，所以請依照提示輸入資料', '若未完成此步驟,之後的功能將會不完整~','現在請輸入你的身高(數字)cm'];
                            event.reply(text);
                        });
                    }
                });
            }
        });
    }),
    //註冊會員Step2
    registerStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不是text');
        } else {
            if(typeof(event.message.text == 'number')) {
                SE.pushSessionStep(event.source.userId, 2, { height: event.message.text }, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let text = ['請輸入生日年月日(yyyy/mm/dd)','小心隨便輸入可能導致該帳號無法使用此功能'];
                        event.reply(text);
                    }
                });
            } else {
                event.reply('你好像不是輸入純數字');
            }
        }
    }),
    //註冊會員Step3
    registerStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不是text');
        } else {
            SE.isSession(event.source.userId, (err, doc) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    let H = doc.Temp[0].height;
                    let BD = new Date(event.message.text).getTime();
                    event.source.profile().then((data) => {
                        //儲存進user
                        let u = new U({
                            LineID: event.source.userId,
                            Name: data.displayName,
                            Height: H,
                            Birthday: BD
                        }).save((err) => {
                            if(err) {
                                ifErr(err);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err);
                                    } else {
                                        let text = ['資料整合完畢','輸入?即可查看指令'];
                                        event.reply(text);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    }),
    //群體廣播Step1
    broadcastStep1: ((event) => {
        if(event.source.userId == 'U9e19e2b04f6f8d04e3eff75e32487dc6') {
            let createSE = new SE({
                LineID: event.source.userId,
                Type: '3'
            }).save((err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    let text = ['進入群體廣播功能','請輸入你想說的話'];
                    event.reply(text);
                }
            });
        } else {
            event.reply('需要管理員才能使用');
        }
    }),
    //群體廣播Step2
    broadcastStep2: ((event) => {
        event.message.text = '[AngLee]:' + event.message.text;
        let message = event.message;

        U.getAllId((err, docs) => {
            if(err) {
                ifErr(err, event);
            } else {
                let i = 0;
                function a() {
                    client.pushMessage(docs[i].LineID, message)
                    .then((data) => {
                        i++;
                        if(i == docs.length) {
                            SE.removeSession(event.source.userId, (err) => {
                                if(err) {
                                    ifErr(err, event);
                                } else {
                                    event.reply('廣播功能結束');
                                }
                            });
                        } else {
                            a();
                        }
                    })
                    .catch((err) => {
                        // error handling
                    });
                }
                a();
            }
        });
    }),
    //設定天氣地點Step1
    setLocationStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '6'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                CT.getCityNameGroup((err, docs) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let i = 0;
                        let textCity = '';
                        function a() {
                            
                            if(i < docs.length) {
                                textCity += (i + 1) + '.' + docs[i]._id + '\n';
                                i++;
                                a();
                            } else {
                                let text = ['進入設定氣候地點功能', '請輸入您住在下列哪個城市?(輸入代號即可)', textCity];
                                event.reply(text);
                            }
                        }    
                        a();               
                    }
                });
            }
        });
    }),
    //設定天氣地點Step2
    setLocationStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入!');
        } else {
            let cityName = '';
            switch(event.message.text) {
                case '1':
                    cityName = '台東';
                    break;
                case '2':
                    cityName = '屏東';
                   break;
                case '3':
                    cityName = '花蓮';
                    break;
                case '4':
                    cityName = '高雄';
                    break;
                case '5':
                    cityName = '澎湖';
                    break;
                case '6':
                    cityName = '嘉義';
                    break;
                case '7':
                    cityName = '台南';
                    break;
                case '8':
                    cityName = '連江';
                    break;
                case '9':
                    cityName = '新北';
                   break;
                case '10':
                    cityName = '金門';
                    break;
                case '11':
                    cityName = '台北';
                    break;
                case '12':
                    cityName = '基隆';
                    break;
                case '13':
                    cityName = '新竹';
                    break;
                case '14':
                    cityName = '桃園';
                    break;
                case '15':
                    cityName = '南投';
                    break;
                case '16':
                    cityName = '苗栗';
                    break;
                case '17':
                    cityName = '宜蘭';
                    break;
                case '18':
                    cityName = '台中';
                    break;
                case '19':
                    cityName = '雲林';
                    break;
                case '20':
                    cityName = '彰化';
                    break;
            }

            if(cityName == '') {
                event.reply('找不到對應的城市');
            } else {
                CT.getTownByCity(cityName, (err, docs) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let i = 0;
                        let textCity = '';
                        function a() {
                            if(i < docs.length) {
                                textCity += docs[i].CityID + '.' + docs[i].Town + '\n';
                                i++;
                                a();
                            } else {
                                SE.pushSessionStep(event.source.userId, 2, {City : cityName}, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        let text = ['請輸入您住在下列哪個地區?(輸入代號即可)', textCity];
                                        event.reply(text);
                                    }
                                })
                            }
                        }
                        a();
                    }
                });
            }
        }
    }),
    //設定天氣地點Step3
    setLocationStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入!');
        } else {
            if(parseInt(event.message.text) < 368 || parseInt(event.message.text) > 0) {
                U.updateLocation(event.source.userId, event.message.text, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let url = 'https://works.ioa.tw/weather/api/weathers/' + event.message.text + '.json';
                        request(url, (err, res, body) => {
                            if(!err & res.statusCode == 200) {
                                let $ = cheerio.load(body, {decodeEntities: false});
                                let json = JSON.parse($.text());
                                let text = '天氣：'　+ json.desc + '\n溫度：' + json.temperature + '°C\n濕度：' + json.humidity + '%';
                                let special = '';
                                if(json.specials.length) {
                                    special = '標題：'　+ json.specials[0].title + '\n狀態：' + json.specials[0].status + '\n發布時間：' + json.specials[0].at + '\n詳細說明：' + json.specials[0].desc;
                                }

                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        if(special.length) {
                                            event.reply([text, special]);
                                        } else {
                                            event.reply(text);  
                                        }
                                    }
                                })
                                
                            } else {
                                ifErr(err, event);
                            }
                        });
                    }
                })
            } else {
                event.reply('請重新輸入代號');
            }
        }
    }),
    //記錄血壓Step1
    bloodPressureStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '7'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['進入血壓紀錄功能', '請輸入收縮壓(純數字)mmHg'];
                event.reply(text);
            }
        });
    }),
    //記錄血壓Step2
    bloodPressureStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else {
                SE.pushSessionStep(event.source.userId, 2, {SBP: event.message.text}, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let text = ['請輸入舒張壓(純數字)mmHg'];
                        event.reply(text);
                    }
                });
            }
            
        }
    }),
    //記錄血壓Step3
    bloodPressureStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else {
                SE.pushSessionStep(event.source.userId, 3, {DBP: event.message.text}, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let text = ['請輸入脈搏一分鐘(純數字)下'];
                        event.reply(text);
                    }
                });
            }
            
        }
    }),
    //記錄血壓Step4
    bloodPressureStep4: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else {
                SE.isSession(event.source.userId, (err, doc) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let bp = new BP({
                            LineID: event.source.userId,
                            SBP: doc.Temp[0].SBP,
                            DBP: doc.Temp[1].DBP,
                            Pulse: event.message.text
                        }).save((err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        event.reply(['數據接收成功','收縮壓:' + doc.Temp[0].SBP + 'mmHg', '舒張壓:' + doc.Temp[1].DBP + 'mmHg', '脈搏每分鐘' + event.message.text + '下']);
                                    }
                                });
                            }
                        })
                    }
                })
            }
            
        }
    }),
    //紀錄今天吃啥Step1
    remindFoodStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '8'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['進入紀錄"今天吃什麼"功能', '請輸入今天吃了啥?(不可分段輸入)'];
                event.reply(text);
            }
        });
    }),
    //紀錄今天吃啥Step2
    remindFoodStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入');
        } else {
            EAT.isEat(event.source.userId, (err, doc) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    if(doc) {
                        EAT.pushEat(event.source.userId, event.message.text, (err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        event.reply(['數據接收成功', '您輸入的資料為:' + event.message.text]);
                                    }
                                })
                            }
                        })
                    } else {
                        let eat = new EAT({
                            LineID: event.source.userId,
                            Eat: event.message.text
                        }).save((err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        event.reply(['數據接收成功', '您輸入的資料為:' + event.message.text]);
                                    }
                                })
                            }
                        })   
                    }
                }
            });
        }
    }),
    //修改今天吃啥Step1
    fixRemindFoodStep1: ((event) => {
        EAT.isEat(event.source.userId, (err, doc) => {
            if(err) {
                ifErr(err, event);
            } else {
                if(doc) {
                    let createSE = new SE({
                        LineID: event.source.userId,
                        Type: '9'
                    }).save((err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            let text = ['進入紀錄"修改今天吃什麼"功能', '目前內容為:',  doc.Eat];
                            event.reply(text);
                        }
                    });
                } else {
                    event.reply('今日尚未紀錄');
                }
            }
        });
    }),
    //修改今天吃啥Step2
    fixRemindFoodStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確請重新輸入');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('功能已中斷');
                    }
                })
            } else {
                EAT.updateEat(event.source.userId, event.message.text, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        SE.removeSession(event.source.userId, (err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                event.reply(['數據接受完畢', '修改內容為:\n' + event.message.text]);
                            }
                        })
                    }
                })
            }
        }
        
    }),
    //老母算帳Step1
    mamaCountStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '11'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['2000幾張?'];
                event.reply(text);
            }
        });
    }),
    //老母算帳Step2
    mamaCountStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 2, {'2000': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['2000元' + event.message.text + '張', '1000幾張?']);
                }
            })
        }
    }),
    //老母算帳Step3
    mamaCountStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 3, {'1000': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['1000元' + event.message.text + '張', '500幾張?']);
                }
            })
        }
    }),
    //老母算帳Step4
    mamaCountStep4: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 4, {'500': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['500元' + event.message.text + '張', '250幾張?']);
                }
            })
        }
    }),
    //老母算帳Step5
    mamaCountStep5: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 5, {'250': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['250元' + event.message.text + '張', '100幾張?']);
                }
            })
        }
    }),
    //老母算帳Step6
    mamaCountStep6: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 6, {'100': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['100元' + event.message.text + '張', '50元幾個?']);
                }
            })
        }
    }),
    //老母算帳Step7
    mamaCountStep7: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 7, {'50': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['50元' + event.message.text + '個', '10元幾個?']);
                }
            })
        }
    }),
    //老母算帳Step8
    mamaCountStep8: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 8, {'10': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['10元' + event.message.text + '個', '5元幾個?']);
                }
            })
        }
    }),
    //老母算帳Step9
    mamaCountStep9: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.pushSessionStep(event.source.userId, 9, {'5': event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply(['5元' + event.message.text + '個', '1元幾個?']);
                }
            })
        }
    }),
    //老母算帳Step10
    mamaCountStep10: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            SE.isSession(event.source.userId, (err, doc) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    let sum = (2000 * doc.Temp[0]['2000']) + (1000 * doc.Temp[1]['1000']) + (500 * doc.Temp[2]['500']) + (250 * doc.Temp[3]['250']) + (100 * doc.Temp[4]['100']) + (50 * doc.Temp[5]['50']) + (10 * doc.Temp[6]['10']) + (5 * doc.Temp[7]['5']) + (1 * event.message.text);
                    SE.removeSession(event.source.userId, (err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            event.reply('總共' + sum + '元');
                        }
                    })
                }
            });
        }
    }),
    //筆記撰寫Step1
    noteStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '1'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['進入紀錄"筆記"功能', '請輸入索引'];
                event.reply(text);
            }
        });
    }),
    //筆記撰寫Step2
    noteStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else {
                NOTE.isExist(event.source.userId,  (err, doc) => {
                    if(err) {
                        ifErr(err, event);
                    } else if(doc) {
                        event.reply('標題已存在，請換一個標題');
                    } else {
                        SE.pushSessionStep(event.source.userId, 2, {'Title': event.message.text}, (err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                event.reply('輸入內容');
                            }
                        })
                    }
                })
                
            }
        }
    }),
    //筆記撰寫Step3
    noteStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('流程已取消');
                    }
                })
            } else {
                SE.isSession(event.source.userId, (err, doc) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        new NOTE({
                            LineID: event.source.userId,
                            Title: doc.Temp[0].Title,
                            Context: event.message.text
                        }).save((err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.removeSession(event.source.userId, (err) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else {
                                        event.reply('紀錄完畢');
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    }),
    //查詢筆記索引
    findNoteIndex: ((event) => {
        NOTE.findIdex(event.source.userId, (err, docs) => {
            if(err) {
                ifErr(err, event);
            } else if(docs) {
                let i = 0;
                let index = '';
                function a() {
                    if((docs.length) == i) {
                        event.reply(index);
                    } else {
                        index += '"' + docs[i].Title + '"\n';
                        i++;
                        a();   
                    }
                }
                a();
            } else {
                event.reply('暫無筆記');
            }
        })
    }),
    //查詢筆記Step1
    findNoteStep1: ((event) => {
        let createSE = new SE({
            LineID: event.source.userId,
            Type: '2'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['進入紀錄"查詢筆記"功能', '請輸入索引'];
                event.reply(text);
            }
        });
    }),
    //查詢筆記Step2
    findNoteStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('型態不正確');
        } else {
            NOTE.find(event.source.userId, event.message.text, (err, doc) => {
                if(err) {
                    ifErr(err, event);
                } else if(doc) {
                    SE.removeSession(event.source.userId, (err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            event.reply(doc.Context);
                        }
                    })
                } else {
                    event.reply('筆記不存在');
                }
            })
        }
    }),
    //歷史今天吃啥
    remindFoodHistory: ((event) => {
        EAT.getHistroy(event.source.userId, (err, docs) => {
            if(err) {
                ifErr(err, event);
            } else {
                let i = 0;
                let text = '';
                function a() {
                    if(i >= docs.length) {
                        event.reply(text);
                    } else {
                        text += getTwDate(docs[i].Date) + '\n' + docs[i].Eat + '\n\n';
                        i++;
                        a();
                    }
                }
                a();
            }
        });
    }),
    //讀出身體數值
    myBodyDetail: ((event) => {
        BD.getNewDetail(event.source.userId, (err, bd) => {
            if(err) {
                ifErr(err);
            } else {
                // console.log(bd);
                let BMR = 370 + 21.6 * ((100 - bd.Fat) * 0.01) * bd.Weight;
                let TDEE1 = BMR * 1.2;
                let TDEE2 = BMR * 1.375;
                let TDEE3 = BMR * 1.55;
                let TDEE4 = BMR * 1.725;
                let TDEE5 = BMR * 1.9;

                let text = [
                    '你的BMR(基礎代謝率)為' + Math.round(BMR) + 'kcal\n' + 
                    '請用活動量對應你的TDEE(每日總消耗熱量)\n' + 
                    '辦公室的工作，沒甚麼運動 -> ' + Math.round(TDEE1) + 'kcal\n' +
                    '每周輕鬆的運動3-5天 -> ' + Math.round(TDEE2) + 'kcal\n' +
                    '每周中度強等的運動3-5天 -> ' + Math.round(TDEE3) + 'kcal\n' +
                    '每周高強度的運動6-7天 -> ' + Math.round(TDEE4) + 'kcal\n' +
                    '勞力密集的工作或是每天訓練或是一天運練兩次以上 ->' + Math.round(TDEE5) + 'kcal'
                ];

                event.reply(text);
            }
        });
    }),
    //我幾歲
    howOldAreMe: ((event) => {
        U.getBirthDay(event.source.userId, (err, doc) => {
            if(err) {
                ifErr(err);
            } else {
                let nowaday = new Date().getTime();
                let bornday = doc.Birthday;
                let year = Math.round((nowaday - bornday) / (1000 * 60 * 60 * 24 * 365));
                
                let text = ['你今年' + year + '歲'];
                event.reply(text);
            }
        })
    }),
    //目前體重
    nowWeight: ((event) => {
        BD.getNewWeight(event.source.userId, (err, doc) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = ['你最新的體重為', doc.Weight + 'kg'];
                event.reply(text);
            }
        });
    }),
    //目前伺服器時間
    atTime: ((event) => {
        let date = new Date();

        event.reply('目前伺服器時間為 ' + date);
    }),
    //查看歷史身體數據
    getHistoryBodyDetail: ((event) => {
        BD.getHistoryBodyDetail(event.source.userId, (err, docs) => {
            if(err) {
                ifErr(err, event);
            } else {
                let i = 0;
                let text = '';
                function a() {
                    let date = getTwDate(docs[i].Date);
                    text += '日期:' + date + '\n體重:' + docs[i].Weight + 'kg\n';

                    if(docs[i].Fat < 100) {
                        text += '體脂肪:' + docs[i].Fat + '%(' + (docs[i].Weight * docs[i].Fat * 0.01).toFixed(2) + ')\n'
                    }

                    if(docs[i].Muscle < 100) {
                        text += '肌肉量:' + docs[i].Muscle + '%(' + (docs[i].Weight * docs[i].Muscle * 0.01).toFixed(2) + ')\n\n';
                    }

                    i++;

                    if(i == docs.length) {
                        event.reply(text);
                    } else {
                        a();
                    }
                }
                a();
            }
        })
    }),
    //我的體重變化
    myWeightChange: ((event) => {
        BD.getWeightChange(event.source.userId, (err, date, date2, doc, fat, fat2, muscle, muscle2) => {
            if(err) {
                ifErr(err, event);
            } else {
                if(doc >= 0) {
                    if(fat >= 100)
                        fat = '未紀錄';
                    else
                        fat += '%';
                    if(fat2 >= 100)
                        fat2 = '未紀錄';
                    else 
                        fat2 += '%';
                    if(muscle >= 100)
                        muscle = '未紀錄';
                    else 
                        muscle += '%'
                    if(muscle2 >= 100)
                        muscle2 = '未紀錄';
                    else 
                        muscle2 += '%'
                    event.reply(['從' + getTwDate(date2) + '到' + getTwDate(date), '體重減輕了' + doc.toFixed(2) + 'kg\n體脂肪變化:' + fat + '->' + fat2 + '\n肌肉量變化:' + muscle + '->' + muscle2]);
                } else {
                    if(fat >= 100)
                        fat = '未紀錄';
                    else
                        fat += '%';
                    if(fat2 >= 100)
                        fat2 = '未紀錄';
                    else 
                        fat2 += '%';
                    if(muscle >= 100)
                        muscle = '未紀錄';
                    else 
                        muscle += '%'
                    if(muscle2 >= 100)
                        muscle2 = '未紀錄';
                    else 
                        muscle2 += '%'
                    event.reply(['從' + getTwDate(date2) + '到' + getTwDate(date),, '體重增重了' + doc.toFixed(2) * -1 + 'kg\n體脂肪變化:' + fat + '->' + fat2 + '\n肌肉量變化:' + muscle + '->' + muscle2]);
                }
            }
        })
    }),
    //今天天氣如何?
    todayWeather: ((event) => {
        U.getLocation(event.source.userId, (err, doc) => {
            if(err) {
                ifErr(err);
            } else if(doc.Location) {
                let url = 'https://works.ioa.tw/weather/api/weathers/' + doc.Location + '.json';
                request(url, (err, res, body) => {
                    if(!err & res.statusCode == 200) {  
                        let $ = cheerio.load(body, {decodeEntities: false});
                        let json = JSON.parse($.text());
                        let text = '天氣：'　+ json.desc + '\n溫度：' + json.temperature + '°C\n濕度：' + json.humidity + '%';
                        let special = '';
                        if(json.specials.length) {
                            special = '標題：'　+ json.specials[0].title + '\n狀態：' + json.specials[0].status + '\n發布時間：' + json.specials[0].at + '\n詳細說明：' + json.specials[0].desc;
                        }

                        SE.removeSession(event.source.userId, (err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                if(special.length) {
                                    event.reply([text, special]);
                                } else {
                                    event.reply(text);  
                                }
                            }
                        })
                        
                    } else {
                        ifErr(err, event);
                    }
                });
            } else {
                event.reply('請先輸入a3,設定天氣地點');
            }
        })
    }),
    //血壓歷史
    readBloodPressureHistory: ((event) => {
        BP.getAllHistory(event.source.userId, (err, docs) => {
            if(err) {
                ifErr(err, event);
            } else {
                let i = 0;
                let text = '';
                function a() {
                    let date = getTwDate(docs[i].Date);
                    text += '日期:' + date + '\n收縮壓:' + docs[i].SBP + 'mmHg\n舒張壓:' + docs[i].DBP + 'mmHg\n心跳每分鐘:' + docs[i].Pulse + '下\n\n';
                    i++;

                    if(i == docs.length) {
                        event.reply(text);
                    } else {
                        a();
                    }
                }
                a();
                
            }
        });
    }),
    //身體數據網頁
    bodyDetailWeb: ((event) => {
        event.reply('https://www.anglinebot2.ga/')
    }),
}

function ifErr(err, event) {
    SE.removeSession(event.source.userId, (err2) => {
        if(err2) {
            console.log(err2);
            event.reply('看一下你的伺服器');
        } else {
            console.log(err);
            event.reply('看一下你的伺服器');
        }
    });
}

function getTwDate(time) {
    let date = new Date();
    let epochTime = time

    let utc = epochTime + (date.getTimezoneOffset()* 60000);
    let nd = new  Date(utc + (3600000 * 8));

    let Y = nd.getFullYear();
    let M = (nd.getMonth() + 1 < 10)? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1;
    let D = (nd.getDate() < 10)? '0' + nd.getDate() : nd.getDate();
    let H = (nd.getHours() < 10)? '0' + nd.getHours() : nd.getHours() ;
    let Minu = (nd.getMinutes() < 10)? '0' + nd.getMinutes() : nd.getMinutes() ;
    let S = (nd.getSeconds() < 10)? '0' + nd.getSeconds() : nd.getSeconds() ;

    return (Y + '/' + M + '/' + D)
}

