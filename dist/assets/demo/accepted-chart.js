// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
function createAcceptedChart(labels,data){

$('#acceptedChart').remove(); // this is my <canvas> element
$('#acceptedCont').append('<canvas id="acceptedChart"  width="100%" height="40"><canvas>');

var ctx = document.getElementById("acceptedChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: "Percentage",
      lineTension: 0.1,
      backgroundColor: "#9ce0b7",
      borderColor: "#51bf7d",
      pointRadius: 2,
      pointBackgroundColor: "#51bf7d",
      pointBorderColor: "#51bf7d",
      pointHoverRadius: 1,
      pointHoverBackgroundColor: "#51bf7d",
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
