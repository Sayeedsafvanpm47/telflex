// datepicker

$(".datepicker").datepicker({
          clearBtn: true,
          format: "dd/mm/yyyy",
      });
  
      $("#fromDate ,#toDate").on("change", function() {
          let from = $("#fromDate").val();
          let to = $("#toDate").val();
      //     let update = new Date($("#updateDate").val());
          $("#showFromDate").text(`${from}`);
          $("#inputFrom").text(`${from}`);
          $("#showToDate").text(`${to}`);
          $("#inputTo").text(`${to}`);
          $('#fromToDate').text(`${from}`)
          $('#toFromDate').text(`${to}`)
      //     $('#showupdateDate').text(`${update}`)
         
      });


      $(".datepicker2").datepicker({
clearBtn: true,
format: 'yyyy-mm-dd', 
setDate: new Date(), 
});

$("#updateDate").on("change", function() {
let update = new Date($(this).val()); // Get the value from the updateDate input
let formattedUpdate = update.toISOString().split('T')[0]; // Format date to 'yyyy-mm-dd'
$('#showupdateDate').text(formattedUpdate);
});


// number key event and other functions

function onlyNumberKey(evt) {
          let inputValue = evt.target.value;
          let ASCIICode = (evt.which) ? evt.which : evt.keyCode;
      
        
          if ((ASCIICode >= 48 && ASCIICode <= 57) || ASCIICode === 8 || ASCIICode === 46 || (ASCIICode >= 37 && ASCIICode <= 40)) {
      
              if ((inputValue.length === 0 && ASCIICode === 48) || (parseInt(inputValue + String.fromCharCode(ASCIICode)) >= 1 &&
                  parseInt(inputValue + String.fromCharCode(ASCIICode)) <= 99)) {
                  return true;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      }
      
      
            function setTimestamp() {
              var timestampInput = document.getElementById('timestampField');
              var timestamp = (new Date()).toISOString().slice(0, 13); // Generate timestamp
      
              timestampInput.value = timestamp; // Set timestamp as input value
              timestampInput.placeholder = timestamp; // Set timestamp as placeholder
          }
          window.onload = function() {
              setTimestamp();
          };
      
          function createField()
          {
               var field = document.getElementById('createFields').removeAttribute('hidden')
               
          }
         
        
          
          // fetch


          async function saveCoupon() {
                    try {
                        var code =  document.getElementById('couponCode').value;
                        var disc = parseInt(document.getElementById('discount').value)
                        var issued = document.getElementById('showFromDate').innerText;
                        var expiry = document.getElementById('showToDate').innerText;
                
                        var minimum = parseInt(document.getElementById('minimum').value)
                        console.log(typeof disc)
                       
                console.log(typeof minimum)
                        // Make the POST request to the backend
                        const response = await fetch('/admin/saveCoupon', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({ code, disc, issued, expiry, minimum })
                        });
                
                        if (!response.ok) {
                            const errorMessage = await response.json(); // Get the error message from the response
                            throw new Error(errorMessage.error); // Throw an error with the received error message
                        }
                
                        const responseData = await response.json();
                     
                        console.log('Request was successful:', responseData);
                        await Swal.fire('Success', 'Coupon saved succesfully!', 'success');
                        window.location.reload();
                    } catch (error) {
                        console.error('There was a problem with the fetch operation:', error);
                    
                        Swal.fire({
                         
                           
                            text: error.message // Display the received error message
                        });
                    }
                }


          //       modal, and other fetches


          function openModal(i) {
                    const modal = document.getElementById(`myModal${i}`);
                    modal.style.display = "block";
                  }
                  
                  // Function to close the modal
                  function closeModal(i) {
                    const modal = document.getElementById(`myModal${i}`);
                    modal.style.display = "none";
                  }
                  
                  
                  
                  for (let i = 0; i <= 1; i++) {
                    const form = document.getElementById(`modalForm${i}`);
                    form.addEventListener("submit", function (event) {
                      event.preventDefault();
                      
                      closeModal(i); 
                    });
                  }
                  
                  
                  
                  async function updateCoupon(couponid,i,event) {
                    try {
                      console.log(i)
                      event.preventDefault()
                      const id = couponid;
                      const couponname = document.getElementById(`couponname${i}`).value;
                    const form = document.getElementById(`modalForm${i}`)
                      const minimum = document.getElementById(`minimum${i}`).value;
                      const discount = document.getElementById(`discount${i}`).value;
                      const dateupdate = new Date(document.getElementById(`updateDate${i}`).value);
                  
                      // Format the date to ISO string format
                      const isoDateString = dateupdate.toISOString();
                      console.log(dateupdate);
                      console.log(discount);
                      console.log(minimum);
                      console.log(couponname);
                  
                  
                      const data = {
                        id,
                        couponname,
                     
                        minimum,
                        discount,
                        dateupdate: isoDateString,
                      };
                  
                      console.log(data);
                      console.log(JSON.stringify(data));
                  
                      const confirmResult = await Swal.fire({
                  title: 'Edit Coupon',
                  text: 'Are you sure you want to edit this coupon?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, edit it!'
                  });
                  
                  
                  if(confirmResult){
                  
                  
                      const response = await fetch('/admin/updateCoupon', {
                        method: 'POST',
                        headers: {
                          'Content-type': 'application/json',
                        },
                        body: JSON.stringify(data),
                      });
                  
                     
                  
                      if (response.status === 404) {
                     form.submit()
                        const responseData = await response.json();
                        console.log('Request was unsuccessful:', responseData);
                  
                        Swal.fire({
                          icon: 'error',
                          title: 'Date Error!',
                          text: responseData.message,
                        });
                      } else if (!response.ok) {
                       
                        throw new Error('Received a non-OK response');
                      } else {
                       
                        const responseData = await response.json();
                        console.log('Request was successful:', responseData);
                        await Swal.fire('Success', 'Coupon updated succesfully!', 'success');
                        location.reload()
                      }
                    }
                    } catch (error) {
                      console.log(error);
                      Swal.fire({
                          icon: 'error',
                          title: 'Data Error!',
                          text: 'some error occured',
                        });
                    }
                  }
                  
                  async function changeStatus(couponId) {
                    try {
                      const id = couponId;
                  
                      const confirmResult = await Swal.fire({
                  title: 'Edit Coupon',
                  text: 'Are you sure you want to edit status of this coupon?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, edit it!'
                  });
                  
                  if(confirmResult){
                  
                      const response = await fetch(`/admin/couponStatus?id=${id}`, {
                        method: 'GET'
                      });
                  
                      if (!response.ok) {
                        const errorMessage = `HTTP error! Status: ${response.status}`;
                        throw new Error(errorMessage);
                      }
                  
                      const responseData = await response.json();
                      Swal.fire({
                        icon: 'success',
                        title: 'Successful',
                        text: responseData.message,
                      });
                      setTimeout(()=>{
                        window.location.href = '/admin/getCouponOffer'
                      },1200)
                    
                      console.log(responseData);
                    }
                    } catch (error) {
                      console.error('Error:', error.message);
                      
                    }
                  }
                  