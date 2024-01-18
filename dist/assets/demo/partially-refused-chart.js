// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
var ctx = document.getElementById("partiallyRefusedChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["01/04/2021", "03/04/2021", "05/04/2021", "07/04/2021", "09/04/2021", "11/04/2021", "13/04/2021", "15/04/2021", "17/04/2021", "19/04/2021", "21/04/2021", "23/04/2021", "25/04/2021", "27/04/2021", "29/04/2021", "31/04/2021", "02/05/2021", "04/05/2021",  "06/05/2021", "08/05/2021", "10/05/2021", "12/05/2021"],
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
      data: [30, 34, 60, 78, 54, 56, 45, 32, 55, 99, 89, 93, 43, 54, 56, 45, 32, 55, 99, 89, 93, 43],
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
