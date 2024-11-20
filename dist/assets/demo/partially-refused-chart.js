

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

function createPartiallyRefusedChart(pr_labels, pr_data){
// Area Chart Example
var ctx = document.getElementById("partiallyRefusedChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: pr_labels,
    datasets: [{
      label: "Sessions",
      lineTension: 0.1,
      backgroundColor: "#f6f64e",
      borderColor: "#f2f26d",
      pointRadius: 2,
      pointBackgroundColor: "#f2f26d",
      pointBorderColor: "#f2f26d",
      pointHoverRadius: 1,
      pointHoverBackgroundColor: "#f2f26d",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: pr_data,
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
