// dashboard char js code

document.addEventListener('DOMContentLoaded', function() {
          let month = document.getElementById('monthnumber').value;
          console.log(month);
      
          function getMonthNameWithYear(month) {
              const date = new Date();
              date.setMonth(month - 1);
      
              const monthName = date.toLocaleString('en-US', {
                  month: 'long',
              });
      
              const year = date.getFullYear();
      
              return monthName + ' ' + year;
          }
      
          const monthNumber = parseInt(month);
          const monthNameWithYear = getMonthNameWithYear(monthNumber);
          console.log(monthNameWithYear);
          document.getElementById('monthfield').innerHTML = monthNameWithYear;
      });

      (async function ($) {
if ($('#myChart').length) {
  $.ajax({
    url: '/admin/chart',
    method: 'GET',
    success: function (data) {
      document.getElementById('chartContent').style.display = 'block';
      const { chartData } = data; // Update to extract 'chartData' from the response

      // Destructure individual arrays from 'chartData'
      const { monthlyRevenue, monthlyProductsSold, monthlyOrders } = chartData;

      // Chart.js code with dynamically fetched data
      var ctx = document.getElementById('myChart').getContext('2d');
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Monthly Revenue',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(44, 120, 220, 0.2)',
              borderColor: 'rgba(44, 120, 220)',
              data: monthlyRevenue
            },
            {
              label: 'Monthly Products Sold',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(4, 209, 130, 0.2)',
              borderColor: 'rgb(4, 209, 130)',
              data: monthlyProductsSold
            },
            {
              label: 'Monthly Orders',
              tension: 0.3,
              fill: true,
              backgroundColor: 'rgba(380, 200, 230, 0.2)',
              borderColor: 'rgb(380, 200, 230)',
              data: monthlyOrders
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
              },
            },
          },
        },
      });
    },
    error: function (error) {
      console.error('Error fetching data:', error);
    },
  });
}


  
})(jQuery);


// js code 2

(async function ($) {
          if ($('#myChart2').length) {
            $.ajax({
              url: '/admin/chart',
              method: 'GET',
              success: function (data) {
                document.getElementById('chartContent2').style.display = 'block';
                const { chartData } = data;
                const { categorySales } = chartData;
        
                const labels = categorySales.map((item) => item.categoryName);
                const quantities = categorySales.map((item) => item.totalProductsSold);
        
                var ctx = document.getElementById("myChart2");
                var myChart = new Chart(ctx, {
                  type: 'doughnut',
                  data: {
                    labels: labels,
                    datasets: [{
                      label: "Product Sales by Category",
                      backgroundColor: ["#5897fb", "#7bcf86", "#ff9076"],
                      data: quantities
                    }]
                  },
                  options: {
                    plugins: {
                      legend: {
                        labels: {
                          usePointStyle: true,
                        },
                      }
                    }
                  }
                });
              },
              error: function (error) {
                console.error('Error fetching data:', error);
              },
            });
          }
        })(jQuery);
        
