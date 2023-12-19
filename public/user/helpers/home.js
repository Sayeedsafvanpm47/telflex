$(document).ready(function() {
          let inputDate = $('#expirydate').val();
          let dateObj = new Date(inputDate);
  
        console.log(inputDate)
          var formattedNew = dateObj.getFullYear() + '/' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '/' + ('0' + dateObj.getDate()).slice(-2) + ' ' + ('0' + dateObj.getHours()).slice(-2) + ':' + ('0' + dateObj.getMinutes()).slice(-2) + ':' + ('0' + dateObj.getSeconds()).slice(-2);
  
          var countdown = $('#datacountdown1');
        
          countdown.attr('data-countdown', formattedNew);
          
  
        
          countdown.countdown(formattedNew, function(event) {
              $(this).html(event.strftime('<span class="days">%D</span> <span> days </span> <span class="hours">%H</span> <span>hours</span> :<span class="minutes">%M</span><span> minutes </span>:<span class="seconds">%S</span> <span> seonds </span>'));
         
          });
       
      });