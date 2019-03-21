// Deephack javascript

var granimInstance = new Granim({
    element: '#nav-canvas',
    name: 'basic-gradient',
    direction: 'left-right',
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#AA076B', '#61045F'],
                ['#02AAB0', '#00CDAC'],
                //['#DA22FF', '#9733EE']
            ],
            transitionSpeed: 10000
        }
    }
});

//
// Charting
//

function handleChartClick(evt) {
    var activeElement = myChart.getElementAtEvent(evt);
    var index = activeElement[0]._index;
    var url = "/tags/" + popularTags[index]._id;

    window.location.href = url;
}

// Chart.js
var ctx = document.getElementById("recent-hacks");
var tagctx = document.getElementById("tagAwardRate")

if (ctx) {
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: popularTags.map((value) => value._id),
        datasets: [{
            label: 'No. of Projects',
            data: popularTags.map((value) => value.count),
            backgroundColor: Array(popularTags.length).fill('rgba(54, 162, 235, 0.2)'),
            borderColor: Array(popularTags.length).fill('rgba(54, 162, 235, 1)'),
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
        onClick: handleChartClick
    }
});
}

var dodata = {
    labels: tagSuccessRate.map((x)=>x._id),
    datasets: [
        {
            data: tagSuccessRate.map((x)=>x.count),
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }],
};

if (tagctx) {
var myDoughnutChart = new Chart(tagctx, {
    type: 'doughnut',
    data: dodata,
    options: {
        title: {
            display: true,
            text: "Number of prizes won"
        }
    }
});
}

var popctx = document.getElementById("tagTimedPopularity");
var popdata = {
    labels: tagTimedPopularity.map((x)=>x._id),
    datasets: [
        {
            label: "Usage over time",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: tagTimedPopularity.map((x)=>x.count),
            spanGaps: false,
        }
    ]
};

if (popctx) {
var myLineChart = new Chart(popctx, {
    type: 'line',
    data: popdata
});
}

