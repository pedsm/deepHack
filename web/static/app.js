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


// Chart.js
var ctx = document.getElementById("recent-hacks");
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
        }
    }
});

