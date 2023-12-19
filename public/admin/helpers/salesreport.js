// datepicker

$(".datepicker").datepicker({
          clearBtn: true,
          format: "dd/mm/yyyy",
      });
  
      $("#fromDate, #toDate").on("change", function() {
          let from = $("#fromDate").val();
          let to = $("#toDate").val();
          $("#showFromDate").text(`${from}`);
          $("#inputFrom").text(`${from}`);
          $("#showToDate").text(`${to}`);
          $("#inputTo").text(`${to}`);
          $('#fromToDate').text(`${from}`)
          $('#toFromDate').text(`${to}`)
      });

//       daterange

async function setDateRange() {
          const selectedReport = $("#typeOfReport").val();
          const today = new Date();
          let fromDate, toDate;
        
      
          const padZero = (num) => (num < 10 ? `0${num}` : num);
      
          if (selectedReport === "daily") {
              fromDate = `${padZero(today.getDate())}/${padZero(today.getMonth() + 1)}/${today.getFullYear()}`;
              toDate = `${padZero(today.getDate() + 1) }/${padZero(today.getMonth() + 1)}/${today.getFullYear()}`;
           
          } else if (selectedReport === "weekly") {
              // Calculate the start and end of the week
              const startOfWeek = new Date(today);
              const endOfWeek = new Date(today);
              const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.
              const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
      
              startOfWeek.setDate(diff);
              endOfWeek.setDate(diff + 6);
      
              fromDate = `${padZero(startOfWeek.getDate())}/${padZero(startOfWeek.getMonth() + 1)}/${startOfWeek.getFullYear()}`;
              toDate = `${padZero(endOfWeek.getDate() + 1)}/${padZero(endOfWeek.getMonth() + 1)}/${endOfWeek.getFullYear()}`;
           
          } else if (selectedReport === "monthly") {
              // Calculate the start and end of the month
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
              fromDate = `${padZero(startOfMonth.getDate())}/${padZero(startOfMonth.getMonth() + 1)}/${startOfMonth.getFullYear()}`;
              toDate = `${padZero(endOfMonth.getDate())}/${padZero(endOfMonth.getMonth() + 1)}/${endOfMonth.getFullYear()}`;
            
          } else if (selectedReport === "yearly") {
              // Calculate the start and end of the year
              fromDate = `01/01/${today.getFullYear()}`;
              toDate = `31/12/${today.getFullYear()}`;
             
          }
      
          // Set the values in the input fields or update elements as needed
          $("#fromDate").val(fromDate);
          $("#toDate").val(toDate);
      
          // Update other elements if needed
          $("#showFromDate").text(fromDate);
          $("#showToDate").text(toDate);
          $("#inputFrom").val(fromDate);
          $("#inputTo").val(toDate);
          
        
          
      }
      
 
      setDateRange();


//       get report


async function getReport() {
          try {
              const fromDate = document.getElementById('showFromDate').innerHTML;
              const toDate = document.getElementById('showToDate').innerHTML;
      
              const requestBody = {
                  fromDate,
                  toDate
              };
      
              const response = await fetch('/admin/getReport', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestBody)
              });
      
              if (!response.ok) {
                  throw new Error('Failed to fetch data');
              }
      
              const data = await response.json();
      
              // Redirect to getReportResults and update the report type
              window.location.assign('/admin/getReportResults');
          //     const typeOfReport = document.getElementById('typeOfReport').value;
          
          // localStorage.setItem('selectedReport', typeOfReport);
      
          } catch (error) {
              console.error('Error:', error);
      
              if (error.message === 'Failed to fetch data') {
                  Swal.fire({
                      icon: 'error',
                      title: 'Invalid Date Range',
                      text: 'From date cannot be greater than to date',
                      showConfirmButton: true
                  });
              }
              location.reload()
          }
      }


//       excel

function download() {
    
          var table1 = document.getElementById("testtable");
          var table2 = document.getElementById('testtable2');
          var table3 = document.getElementById('testtable3');
      
          var workbook1 = XLSX.utils.table_to_book(table1);
          var workbook2 = XLSX.utils.table_to_book(table2);
          var workbook3 = XLSX.utils.table_to_book(table3);
      
          var ws1 = workbook1.Sheets["Sheet1"];
          var ws2 = workbook2.Sheets["Sheet1"];
          var ws3 = workbook3.Sheets["Sheet1"];
      
      
      
        
          var mergedWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(mergedWorkbook, ws1, "Table1");
          XLSX.utils.book_append_sheet(mergedWorkbook, ws2, "Table2");
          XLSX.utils.book_append_sheet(mergedWorkbook, ws3, "Table3");
      
         
          XLSX.writeFile(mergedWorkbook, "SalesReport.xlsx"); 
      }
      
      

      document.addEventListener("DOMContentLoaded", () => {
          let printLink = document.getElementById("printButton");
          let container = document.getElementById("container");
      
          printLink.addEventListener("click", event => {
              event.preventDefault();
              printLink.style.display = "none";
              window.print();
          }, false);
      
          container.addEventListener("click", event => {
              printLink.style.display = "flex";
          }, false);
      
      }, false);