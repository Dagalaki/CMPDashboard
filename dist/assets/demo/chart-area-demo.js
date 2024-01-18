// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
var ctx = document.getElementById("consentsChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["01/04/2021", "03/04/2021", "05/04/2021", "07/04/2021", "09/04/2021", "11/04/2021", "13/04/2021", "15/04/2021", "17/04/2021", "19/04/2021", "21/04/2021", "23/04/2021", "25/04/2021", "27/04/2021", "29/04/2021", "31/04/2021", "02/05/2021", "04/05/2021",  "06/05/2021", "08/05/2021", "10/05/2021", "12/05/2021"],
    datasets: [{
      label: "Sessions",
      lineTension: 0.1,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius:3,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: [30000, 34000, 60000, 78000, 54000, 56000, 45000, 32400, 55000, 99000, 89000, 93000, 43000,54000, 56000, 45000, 32400, 55000, 99000, 89000, 93000, 43000 ],
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
          max: 100000,
          maxTicksLimit: 20
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
