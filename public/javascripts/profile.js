var ctx = document.getElementById("myChart").getContext('2d');
var ctx2 = document.getElementById("myChart2").getContext('2d');
var ctx3 = document.getElementById("myChart3").getContext('2d');

$.get('/api/bodyDetail/history', function(data) {

    var pushW = new Array();
    var pushM = new Array();
    var pushF = new Array();
    var pushD = new Array();

    var pushWColor = new Array();
    var pushFColor = new Array();
    var pushMColor = new Array();

    for(var i = 0 ; i < data.length ; i++) {
        pushW[ (data.length - 1) - i ] = data[i].Weight;
        if(data[i].Muscle)
            pushM[(data.length - 1) - i] = ( data[i].Muscle * 0.01 * data[i].Weight ).toFixed(2);
        if(data[i].Fat)
            pushF[(data.length - 1) - i] = (data[i].Fat * 0.01 * data[i].Weight).toFixed(2);
        if((i % 7) == 0)
            pushWColor[i] = 'rgba(255, 99, 132, 1)';
        else 
            pushWColor[i] = 'rgba(255, 99, 132, 0.2)';
        if((i % 7) == 0)
            pushFColor[i] = 'rgba(54, 162, 235, 1)';
        else 
            pushFColor[i] = 'rgba(54, 162, 235, 0.2)';
        if((i % 7) == 0)
            pushMColor[i] = 'rgba(255, 206, 86, 1)';
        else 
            pushMColor[i] = 'rgba(255, 206, 86, 0.2)';
        pushD[(data.length - 1) - i] = getTwDate(data[i].Date);
    }

    
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pushD,
            datasets: [{
                label: '體重',
                data: pushW,
                backgroundColor: pushWColor,
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            }]
        },
        options: {
            // scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero:true
            //         }
            //     }]
            // }
        }
    });

    var myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: pushD,
            datasets: [{
                label: '體脂肪',
                data: pushF,
                backgroundColor: pushFColor,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            // scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero:true
            //         }
            //     }]
            // }
        }
    });

    var myChart3 = new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: pushD,
            datasets: [{
                label: '肌肉量',
                data: pushM,
                backgroundColor: pushMColor,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            // scales: {
            //     yAxes: [{
            //         ticks: {
            //             beginAtZero:true
            //         }
            //     }]
            // }
        }
    });

    myChart.draw();
    myChart2.draw();
    myChart3.draw();

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