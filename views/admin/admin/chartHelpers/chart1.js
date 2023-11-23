
(async function ($) {
          if ($('#myChart2').length) {
            $.ajax({
              url: '/admin/chart',
              method: 'GET',
              success: function (data) {
                document.getElementById('chartContent').style.display = 'block';
                const { chartData } = data;
                const { categorySales } = chartData;
        
                const labels = categorySales.map((item) => item.categoryName);
                const quantities = categorySales.map((item) => item.totalProductsSold);
        
                var ctx = document.getElementById("myChart2");
                var myChart = new Chart(ctx, {
                  type: 'pie',
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
        
        
        