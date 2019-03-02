$.get('/api/bloodPressure/history', function(data) {
    var pushD = new Array();
    var pushSBP = new Array();
    var pushDBP = new Array();
    var pushPulse = new Array();

    for(var i = 0; i < data.length ; i++) {
        pushD[i] = getTwDate(data[(data.length - 1) - i].Date);
        pushSBP[i] = data[(data.length - 1) - i].SBP;
        pushDBP[i] = data[(data.length - 1) - i].DBP;
        pushPulse[i] = data[(data.length - 1)- i].Pulse;

        $('#card').append(`<div class="card">
        <div class="card-header">` +
            pushD[i] + 
        `</div>
        <div class="card-body">
            <i class="fas fa-heart"></i>收縮壓:&nbsp;` + 
            pushSBP[i] + `&nbsp;mmHg<br />
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ` + 
                ((pushSBP[i]/140) * 100) + `%" aria-valuenow="` + pushSBP[i] + `" aria-valuemin="0" aria-valuemax="140"></div>
                </div><br />
            <i class="far fa-heart"></i>舒張壓:&nbsp;` + 
            pushDBP[i] + `&nbsp;mmHg<br />
            <div class="progress">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style="width: ` + 
                ((pushDBP[i]/90) * 100) + `%" aria-valuenow="` + pushDBP[i] + `" aria-valuemin="0" aria-valuemax="90"></div>
                </div><br />
            <i class="fas fa-heartbeat"></i>脈搏:&nbsp;70&nbsp;times/min<br />`);
    }
})

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