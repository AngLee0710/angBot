module.exports = {
    note: {
        type: 'template',
        altText: 'this is a confirm template',
        template: {
            type: 'buttons',
            text: '按下選單可以控制物聯網裝置！\n輸入?可以再看到這個選單！',
            actions: [{
                type: 'postback',
                label: '筆記紀錄',
                data: '筆記紀錄'
            }, {
                type: 'postback',
                label: '筆記索引查詢',
                data: '筆記索引查詢'
            },{
                type: 'postback',
                label: '筆記查詢',
                data: '筆記查詢'
            }]
        }
    }
}