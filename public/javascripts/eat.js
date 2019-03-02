$.get('/api/eat/history', function(data) {
    var pushD = new Array();
    var pushE = new Array();

    for(var i = 0; i < data.length ; i++) {
        pushD[i] = getTwDate(data[(data.length - 1) - i].Date);
        pushE[i] = data[(data.length - 1) - i].Eat;

        $('#card').append(`<div class="card">
            <div class="card-header">` +
                pushD[i] + 
            `</div>
            <div class="card-body">` +
                pushE[i] +
            `</div>
        </div>`);
    }
});


function getTwDate(time) {
    var date = new Date();
    var epochTime = time

    var utc = epochTime + (date.getTimezoneOffset()* 60000);
    var nd = new  Date(utc + (3600000 * 8));

    var Y = nd.getFullYear();
    var M = (nd.getMonth() + 1 < 10)? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1;
    var D = (nd.getDate() < 10)? '0' + nd.getDate() : nd.getDate();
    var H = (nd.getHours() < 10)? '0' + nd.getHours() : nd.getHours() ;
    var Minu = (nd.getMinutes() < 10)? '0' + nd.getMinutes() : nd.getMinutes() ;
    var S = (nd.getSeconds() < 10)? '0' + nd.getSeconds() : nd.getSeconds() ;

    return (Y + '/' + M + '/' + D)
}