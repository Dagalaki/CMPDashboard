// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
function createRefusedChart(labels, data){

$('#refusedChart').remove(); // this is my <canvas> element
$('#refusedCont').append('<canvas id="refusedChart"  width="100%" height="40"><canvas>');

var ctx = document.getElementById("refusedChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: "Sessions",
      lineTension: 0.1,
      backgroundColor: "#f09ea3",
      borderColor: "#dd3d48",
      pointRadius: 2,
      pointBackgroundColor: "#dd3d48",
      pointBorderColor: "#dd3d48",
      pointHoverRadius: 1,
      pointHoverBackgroundColor: "#dd3d48",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: data,
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 30
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          maxTicksLimit: 20,
          callback: function(label) {
                        return "% "+label;
                    }
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});

}
