const charactor = require('../db/game/charactor.js');
const user = require('../db/general/user.js');
const SE = require('../db/general/mySession.js');
const monster = require('../db/game/monsterdb.js');

const line = require('@line/bot-sdk');
const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN1
});


module.exports = {
    waitForPk: ((event) => {
        if(event.message.type =! 'text') {
            event.reply('輸入型態不正確');
        } else {
            if(event.message.text === 'break') {
                const waitForPk = async () => {
                    let enemyLineID;
                    await SE.isSession(event.source.userId, (err, selfInfo) => {
                        if (err) {
                            ifErr(err, event);
                        } else {
                            enemyLineID = selfInfo.Temp[0].id;
                        }
                        SE.removeSession(enemyLineID, (err) => {
                            if (err) {
                                ifErr(err, event);
                                return;
                            }
                        })
                        SE.removeSession(event.source.userId, (err) => {
                            if (err) {
                                ifErr(err, event);
                                return;
                            }
                        })
                        let message = {
                            type: 'text',
                            text: '對方已取消對戰'
                        }

                        client.pushMessage(enemyLineID, message)
                            .then(() => {
                                event.reply('請求已取消');
                            })
                            .catch((err) => {
                                if (err) {
                                    ifErr(err, event);
                                    return;
                                }
                            })
                    })
                }
                waitForPk();
            }
        }
    }),
    createMonsterStep1: ((event) => {
        new SE({
            LineID: event.source.userId,
            Type: '16'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                event.reply('輸入魔物名稱');
            }
        })
    }),
    createMonsterStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入格式錯誤');
        } else {
            SE.pushSessionStep(event.source.userId, 2, { Name : event.message.text }, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply('輸入魔物HP最大值');
                }
            })
        }
    }),
    createMonsterStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入格式錯誤');
        } else {
            SE.isSession(event.source.userId, (err, selfInfo) => {
                if(err) {
                    ifErr(err, event);
                } else {
                     new monster({
                        Name: selfInfo.Temp[0].Name,
                        maxHP: event.message.text
                    }).save((err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            SE.removeSession(event.source.userId, (err) => {
                                if(err) {
                                    ifErr(err, event);
                                } else {
                                    event.reply('魔物新增成功');
                                }
                            })
                            
                        }
                    })
                }
            })
        }
    }),
    callMonsterStep1: ((event) => {
        new SE({
            LineID: event.source.userId,
            type: '15'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                let text = '請選擇想召喚的魔物\n';
                monster.showAll((err, monsters) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        let i = 0;
                        function loop() {
                            if(i < monster.length) {
                                text += '"' + monsters[i].Name + '"\n'
                                i++;
                                loop();
                            } else {
                                event.reply(text);
                            }
                        }
                        loop()
                    }
                })
            }
        })
    }),
    callMonsterStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入格式錯誤');
        } else {
            monster.isMonster(event.message.text, (err, monster) => {
                console.log(monster);
                if(err) {
                    ifErr(err, event);
                } else if(monster.length) {
                    SE.pushSessionStep(event.source.userId, 2, { monster: event.message.text }, (err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            event.reply('戰鬥開始');
                        }
                    })
                } else {
                    event.reply('找不到魔物');
                }
            })
        }
    }),
    setGameNameStep1: ((event) => {
        new SE({
            LineID: event.source.userId,
            Type: '14',
        }).save((err) => {
            if(err) {
                ifErr(err, event);
            } else {
                event.reply('輸入角色名稱');
            }
        })
    }),
    setGameNameStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reqly('輸入格式錯誤');
        } else {
            charactor.setName(event.source.userId, event.message.text, (err) => {
                if(err) {
                    ifErr(err, event)
                } else {
                    SE.removeSession(event.source.userId, (err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            event.reply('腳色已重新命名');
                        }
                    })
                }
            })
        }
    }),
    pkRequest: ((event) => {
        if(event.message.type != 'text') {
            event.reqly('輸入格式錯誤');
        } else {
            var enemyLineID;
            let selfLineID = event.source.userId;
            if(event.message.text == '是') {
                const pkRequest = async() => {
                    await SE.isSession(event.source.userId, (err, doc) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        } else {
                            enemyLineID = doc.Temp[0].id;
                        } 
                    })
                    
                    await SE.removeSession(selfLineID, (err) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        }
                    })
                    
                    await SE.removeSession(enemyLineID, (err) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        }
                    })
                    
                    await new SE({
                        LineID: event.source.userId,
                        Type: '12',
                        Step: 2,
                        Temp: [
                            {
                                id: enemyLineID,
                                attack: 'unknow',
                                attackStatus: true
                            }
                        ]
                    }).save((err) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        }
                    });
                    
                    await new SE({
                        LineID: enemyLineID,
                        Type: '12',
                        Step: 2,
                        Temp: [
                            {
                                id: event.source.userId,
                                attack: 'unknow',
                                attackStatus: true
                            }
                        ]
                    }).save((err) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        } else {
                            let message = {
                                type: 'text',
                                text: '戰鬥開始'
                            }
                        
                            client.pushMessage(enemyLineID, message)
                            .then(() => {
                                event.reply('戰鬥開始');
                            })
                            .catch((err) => {
                                event.reply('0.0');
                            });
                        }
                    })

                    


                } 
                pkRequest();
            } else if(event.message.text == '否') {
                const pkRequest2 = async() => {
                    await SE.isSession(selfLineID, (err, doc) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        }
                        enemyLineID = doc.Temp[0].id;
                    })

                    await SE.removeSession(event.source.userId, (err) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        }
                    })

                    await SE.removeSession(enemyLineID, (err) => {
                        if(err) {
                            ifErr(err, event);
                            return;
                        }
                    })

                    let message = {
                        type: 'text',
                        text: '對方拒絕了你的挑戰'
                    }
                    client.pushMessage(enemyLineID, message)
                    .then(() => {
                        event.reply('臭俗仔');
                    })
                    .catch((err) => {
                        ifErr(err, event);
                    });
                }
                pkRequest2();
            }
        }
    }),
    pkStep1: ((event) => {
        new SE({
            LineID: event.source.userId,
            Type: '12'
        }).save((err) => {
            if(err) {
                ifErr(err, event);
                return;
            }
        });

        charactor.getAnotherCharactor((err, docs) => {
            if(err) {
                ifErr(err, event);
            } else {
                let str = new String();
                let i = 0;

                function a () {
                    if(i < docs.length) {
                        str += docs[i].Name + '\n';
                        i++
                        a();
                    } else {
                        let text = ['進入"對戰"功能', '請輸入欲挑戰之對象', str];
                        event.reply(text);
                    }
                }
                a();
                
            }
        })

        
        
    }),
    pkStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('格式錯誤');
        } else {
            if(event.message.text == 'break') {
                SE.removeSession(event.source.userId, (err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('攻擊已取消');
                    }
                })
            } else {
                charactor.getLineId(event.message.text, (err, enemyLineId) => {
                    if(err) {
                        ifErr(err, event);
                    } else if(enemyLineId) {                        
                        SE.pushSessionStep(event.source.userId, 2, {id: enemyLineId}, (err) => {
                            if(err) {
                                ifErr(err, event);
                            } else {
                                SE.isSession(enemyLineId, (err, doc) => {
                                    if(err) {
                                        ifErr(err, event);
                                    } else if(doc) {
                                        SE.removeSession(event.source.userId, (err) => {
                                            if(err) {
                                                ifErr(err, event);
                                            } else {
                                                event.reply('對方忙碌中');
                                            }
                                        })
                                    } else {
                                        user.getName(event.source.userId, (err, selfName) => {
                                            if(err) {
                                                ifErr(err, event);
                                            } else {
                                                let message = {
                                                    type: 'text',
                                                    text: '是否接受' + selfName + '對你提出的挑戰請求(是or否)'
                                                }
        
                                                client.pushMessage(enemyLineId, message)
                                                .then(() => {
                                                    new SE({
                                                        LineID: enemyLineId,
                                                        Type: '13',
                                                        Temp: [
                                                            {id: event.source.userId}
                                                        ]
                                                    }).save((err) => {
                                                        if(err) {
                                                            ifErr(err, event);
                                                        } else {
                                                            SE.removeSession(event.source.userId, (err) => {
                                                                if(err) {
                                                                    ifErr(err, event);
                                                                } else {
                                                                    new SE({
                                                                        LineID: event.source.userId,
                                                                        Type: '18',
                                                                        Temp: {
                                                                            id: enemyLineId
                                                                        }
                                                                    }).save((err) => {
                                                                        if(err) {
                                                                            ifErr(err, event);
                                                                        } else {
                                                                            event.reply('已發出對戰請求');
                                                                        }
                                                                    })
                                                                }
                                                            })  
                                                        }
                                                    });
                                                    
                                                })
                                                .catch((err) => {
                                                    ifErr(err, event);
                                                }); 
                                            }
                                        })
                                    }
                                })                               
                            }
                        })
                    } else {
                        console.log(enemyLineId);
                        event.reply('找不到對戰者');
                    } 
                        
                })
            }
        }
    }),
    pkStep3: ((event) => {
        if(event.message.type != 'text') {
            event.reply('格式錯誤');
        } else {
            SE.isSession(event.source.userId, (err, selfInfo) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    let enemyLinedId = selfInfo.Temp[0].id;
                    SE.isSession(enemyLinedId, (err, enemyInfo) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            switch(event.message.text) {
                                case '卸除防禦':
                                    attack(event.source.userId, enemyLinedId, '卸除防禦', event);
                                    break;
                                case '奮力一擊':
                                    attack(event.source.userId, enemyLinedId, '奮力一擊', event);
                                    break;
                                case '防禦':
                                    attack(event.source.userId, enemyLinedId, '防禦', event);
                                    break;
                             //   case '治癒':
                               //     attack(event.source.userId, enemyLinedId, '治癒', event);
                                 //   break;
                                case 'break':
                                    charactor.reliveByLineID(event.source.userId, (err) => {
                                        if(err) {
                                            ifErr(err, event);
                                        } else {
                                            charactor.reliveByLineID(enemyLinedId, (err) => {
                                                if(err) {
                                                    ifErr(err, event);
                                                } else {
                                                    SE.removeSession(event.source.userId, (err) => {
                                                        if(err) {
                                                            ifErr(err, event);
                                                        } else {
                                                            SE.removeSession(enemyLinedId, (err) => {
                                                                if(err) {
                                                                    ifErr(err, event);
                                                                } else {
                                                                    let message = {
                                                                        type: 'text',
                                                                        text: '對方已離開戰鬥'
                                                                    }
                                                                    client.pushMessage(enemyLinedId, message)
                                                                    .then(() => {
                                                                        event.reply('已離開戰鬥');
                                                                    })
                                                                    .catch((err) => {
                                                                        ifErr(err, event);
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                    break;
                                default:
                                    let text = '招式表:\n"卸除防禦"(破防)\n"奮力一擊"(強攻)\n"防禦"'
                                    event.reply(text);
                                    break;
                            }
                        }
                    })
                    
                }
            })
        }       
    }),
    load: ((event) => {
        user.getAll((err, docs) => {
            if(err) {
                ifErr(err, event);
            } else {
                console.log(docs);
                let i = 0;
                docs.forEach(doc => {
                    new charactor({
                        LineID: doc.LineID,
                        Name: doc.Name
                    }).save((err) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            i++;
                            if(i == docs.length) {
                                event.reply('完成');
                            }
                        }
                    })
                });
            }
        })
    }),
    registerStep1: ((event) => {
        charactor.isPlayer(event.source.userId, (err, player) => {
            if(err) {
                ifErr(err, event);
            } else if(!player) {
                new SE({
                    LineID: event.source.userId,
                    Type: '17'
                }).save((err) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        event.reply('輸入角色名稱');
                    }
                })
            } else {
                event.reply('腳色已註冊');
            }
        })
    }),
    registerStep2: ((event) => {
        if(event.message.type != 'text') {
            event.reply('輸入型態不正確');
        } else {
            new charactor({
                LineID: event.source.userId,
                Name: event.message.text
            }).save((err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    event.reply('註冊完成');
                }
            })
        }
    }),
    promiseTest: ((event) => {
        console.log('asdd');
        let aaa = 'asd';
        let test = async () => {
            await user.getName(event.source.userId, (err, user) => {
                if (err) {
                    ifErr(err, event);
                } else {
                    aaa = user;
                }
                console.log(aaa);

                return 'done';
            })
        }
        test();
    })
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

function attack(selfLineID, enemyLineID, attack, event) {
    SE.isSession(selfLineID, (err, selfInfo) => {
        if(err) {
            ifErr(err, event);
        } else {
            if(selfInfo.Temp[0].attackStatus) {
                SE.attack(selfLineID, enemyLineID, attack, (err, result) => {
                    if(err) {
                        ifErr(err, event);
                    } else {
                        attackResultNumberCharge(selfLineID, enemyLineID, result, event);
                    }
                })
            } else {
                client.pushMessage(enemyLineID, event.message)
                .then(() => {


                })
                .catch((err) => {
                    ifErr(err, event);
                })
            }
        }
    })
}

function attackResultNumberCharge(selfLineID, enemyLineID, num, event) {
    switch(num) {
        case 1:
            fight(selfLineID, enemyLineID, event, 25, 25, 0, 0, '卸除防禦', '卸除防禦');
            break;
        case 2:
            fight(selfLineID, enemyLineID, event, 0, 50, 0, 0, '卸除防禦', '奮力一擊');
            break;  
        case 3:
            fight(selfLineID, enemyLineID, event, 50, 0, 0, 0, '卸除防禦', '防禦');
            break;
        case 11:
            fight(selfLineID, enemyLineID, event, 75, 0, 0, 0, '卸除防禦', '治癒');
            break;    
        case 4:
            fight(selfLineID, enemyLineID, event, 50, 0, 0, 0, '奮力一擊', '卸除防禦');
            break;
        case 5:
            fight(selfLineID, enemyLineID, event, 25, 25, 0, 0, '奮力一擊', '奮力一擊');
            break;
        case 6:
            fight(selfLineID, enemyLineID, event, 0, 50, 0, 0, '奮力一擊', '防禦');
            break;
        case 12:
            fight(selfLineID, enemyLineID, event, 75, 0, 0, 0, '奮力一擊', '治癒');
            break;
        case 7:
            fight(selfLineID, enemyLineID, event, 0, 50, 0, 0, '防禦', '卸除防禦');
            break;
        case 8:
            fight(selfLineID, enemyLineID, event, 50, 0, 0, 0, '防禦', '奮力一擊');
            break;
        case 9:
            fight(selfLineID, enemyLineID, event, 0, 0, 0, 0, '防禦', '防禦');
            break;
        case 13:
            fight(selfLineID, enemyLineID, event, 0, 0, 0, 50, '防禦', '治癒');
            break;
        case 7:
            fight(selfLineID, enemyLineID, event, 0, 50, 0, 0, '防禦', '卸除防禦');
            break;
        case 8:
            fight(selfLineID, enemyLineID, event, 50, 0, 0, 0, '防禦', '奮力一擊');
            break;
        case 9:
            fight(selfLineID, enemyLineID, event, 0, 0, 0, 0, '防禦', '防禦');
            break;
        case 13:
            fight(selfLineID, enemyLineID, event, 0, 0, 0, 50, '防禦', '治癒');
            break;
        case 14:
            fight(selfLineID, enemyLineID, event, 0, 75, 0, 0, '治癒', '卸除防禦');
            break;
        case 15:
            fight(selfLineID, enemyLineID, event, 0, 75, 0, 0, '治癒', '奮力一擊');
            break;
        case 16:
            fight(selfLineID, enemyLineID, event, 0, 0, 100, 0, '治癒', '防禦');
            break;
        case 17:
            fight(selfLineID, enemyLineID, event, 0, 0, 50, 50, '治癒', '治癒');
            break;
        case 10:
            event.reply('等待對方出招，請稍後');
            break;
        
        
        
    }
}

function fight(beforeLineID, afterLineID, event, beforeMakesDamage, afterMakesDamage, beforeMakesHeal, afterMakesHeal, beforeSkill, afterSkill) {
    charactor.attackByLineID(beforeLineID, afterMakesDamage, (err) => {
        if(err) {
            ifErr(err, event);
        } else {
            charactor.attackByLineID(afterLineID, beforeMakesDamage, (err) => {
                if(err) {
                    ifErr(err, event);
                } else {
                    charactor.healByLineID(beforeLineID, beforeMakesHeal, (err, enemyHp) => {
                        if(err) {
                            ifErr(err, event);
                        } else {
                            charactor.healByLineID(afterLineID, afterMakesHeal, (err, selfHp) => {
                                if(err) {
                                    ifErr(err, event);
                                } else {
                                    if(enemyHp <= 0 && selfHp <= 0) {
                                        charactor.reliveByLineID(beforeLineID, (err) => {
                                            if(err) {
                                                ifErr(err, event);
                                            } else {
                                                charactor.reliveByLineID(afterLineID, (err) => {
                                                    if(err) {
                                                        ifErr(err, event);
                                                    } else {
                                                        SE.removeSession(beforeLineID, (err) => {
                                                            if(err) {
                                                                ifErr(err, event);
                                                            } else {
                                                                SE.removeSession(afterLineID, (err) => {
                                                                    if(err) {
                                                                        ifErr(err, event);
                                                                    } else {
                                                                        let message = {
                                                                            type: 'text',
                                                                            text: '對方使出"' + beforeSkill + '"\n我方受到' + afterMakesDamage + '點傷害\n對方受到' + beforeMakesDamage + '點傷害\n雙方角色同時HP歸零\n戰鬥平手'
                                                                        }
                                                                        client.pushMessage(afterLineID, message)
                                                                        .then(() => {
                                                                            event.reply(message.text);
                                                                        })
                                                                        .catch((err) => {
                                                                            ifErr(err, event);
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })                                     
                                                    }
                                                })
                                            }
                                        })    
                                    } else if(enemyHp <= 0) {
                                        charactor.reliveByLineID(beforeLineID, (err) => {
                                            if(err) {
                                                ifErr(err, event);
                                            } else {
                                                charactor.reliveByLineID(afterLineID, (err) => {
                                                    if(err) {
                                                        ifErr(err, event);
                                                    } else {
                                                        SE.removeSession(beforeLineID, (err) => {
                                                            if(err) {
                                                                ifErr(err, event);
                                                            } else {
                                                                SE.removeSession(afterLineID, (err) => {
                                                                    if(err) {
                                                                        ifErr(err, event);
                                                                    } else {
                                                                        charactor.recordPerformance(afterLineID, beforeLineID, (err) => {
                                                                            if(err) {
                                                                                ifErr(err, event);
                                                                            } else {
                                                                                let message = {
                                                                                    type: 'text',
                                                                                    text: '對方使出"' + afterSkill + '"\n我方受到' + afterMakesDamage + '點傷害\n對方受到' + beforeMakesDamage + '點傷害\n角色HP歸零\n戰鬥失敗，角色已死亡'
                                                                                }
                                                                                client.pushMessage(afterLineID, message)
                                                                                .then(() => {
                                                                                    event.reply('對方使出"' + beforeSkill + '"\n我方受到' + beforeMakesDamage + '點傷害\n對方受到' + afterMakesDamage + '點傷害\n對方已死亡\n戰鬥勝利');
                                                                                })
                                                                                .catch((err) => {
                                                                                    ifErr(err, event);
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })                                     
                                                    }
                                                })
                                            }
                                        })   
                                    } else if(selfHp <= 0) {
                                        charactor.reliveByLineID(beforeLineID, (err) => {
                                            if(err) {
                                                ifErr(err, event);
                                            } else {
                                                charactor.reliveByLineID(afterLineID, (err) => {
                                                    if(err) {
                                                        ifErr(err, event);
                                                    } else {
                                                        SE.removeSession(beforeLineID, (err) => {
                                                            if(err) {
                                                                ifErr(err, event);
                                                            } else {
                                                                SE.removeSession(afterLineID, (err) => {
                                                                    if(err) {
                                                                        ifErr(err, event);
                                                                    } else {
                                                                        charactor.recordPerformance(beforeLineID, afterLineID, (err) => {
                                                                            if(err) {
                                                                                ifErr(err, event);
                                                                            } else {
                                                                                let message = {
                                                                                    type: 'text',
                                                                                    text: '對方使出"' + afterSkill + '"\n我方受到' + afterMakesDamage + '點傷害\n對方受到' + beforeMakesDamage + '點傷害\n對方已死亡\n戰鬥勝利'
                                                                                }
                                                                                client.pushMessage(afterLineID, message)
                                                                                .then(() => {
                                                                                    event.reply('對方使出"' + beforeSkill + '"\n我方受到' + beforeMakesDamage + '點傷害\n對方受到' + afterMakesDamage + '點傷害\n角色HP歸零\n戰鬥失敗，角色已死亡');
                                                                                })
                                                                                .catch((err) => {
                                                                                    ifErr(err, event);
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })                                     
                                                    }
                                                })
                                            }
                                        })   
                                    } else if(beforeMakesHeal || afterMakesHeal) {
                                        let message = {
                                            type: 'text',
                                            text: '對方使出"' + afterSkill + '"\n我方回復' + beforeMakesHeal + '點生命\n對方受到' + beforeMakesDamage + '點傷害\n角色目前HP:' + enemyHp  + '\n對方角色目前HP:' + selfHp
                                        }
                                        client.pushMessage(afterLineID, message)
                                        .then(() => {
                                            event.reply('對方使出"' + beforeSkill + '"\n我方受到' + beforeMakesDamage + '點傷害\n對方回復' + beforeMakesDamage + '點傷害\n角色目前HP:' + selfHp + '\n對方角色目前HP:' + enemyHp);
                                        })
                                        .catch((err) => {
                                            ifErr(err, event);
                                        })
                                    } else {
                                        let message = {
                                            type: 'text',
                                            text: '對方使出"' + afterSkill + '"\n我方受到' + afterMakesDamage + '點傷害\n對方受到' + beforeMakesDamage + '點傷害\n角色目前HP:' + enemyHp  + '\n對方角色目前HP:' + selfHp
                                        }
                                        client.pushMessage(afterLineID, message)
                                        .then(() => {
                                            event.reply('對方使出"' + beforeSkill + '"\n我方受到' + beforeMakesDamage + '點傷害\n對方受到' + afterMakesDamage + '點傷害\n角色目前HP:' + selfHp + '\n對方角色目前HP:' + enemyHp);
                                        })
                                        .catch((err) => {
                                            ifErr(err, event);
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}
