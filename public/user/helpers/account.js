// logout

function logout() {

          Swal.fire({
            title: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
        title: 'Logout Successful',
        icon: 'success',
        
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        
        })
             
              window.location.href = '/user/logout'; 
            }
          });
        }



//         review


async function rate(a, i) {
   
          let stars = document.querySelectorAll(`#star${i} .star`);
          let review = document.getElementById(`review${i}`).value
          let productid = document.getElementById(`productid${i}`).value
          let orderId = document.getElementById(`orderIdTarget${i}`).value
          let rating = a
          stars.forEach((star, index) => {
              if (index < a) {
                  star.style.color = 'gold';
              } else {
                  star.style.color = 'gray'; 
              }
          });
      if(review == '')
      {
          Swal.fire({
                  title: 'Oops!',
                  text: 'Please write a review!',
                  icon: 'warning',
                  confirmButtonText: 'OK'
              });
      }else {
         
          const response = await fetch(`/user/rateProduct?rating=${rating}&review=${review}&productid=${productid}&orderId=${orderId}`, {
              method: 'GET',
             
          })
         if(!response.ok)
         {
          Swal.fire({
                  title: 'Oops!',
                  text: 'You have already posted a review for this product!',
                  icon: 'warning',
                  confirmButtonText: 'OK'
              });
              document.getElementById(`tr${i}`).style.display = 'none'
         }
         const responseData = await response.json()
         console.log('response success')
      }
          
      }
      
// add address

function submitForm() {
          const addressnewform = document.getElementById('formshow');
          const name = document.getElementById('name').value;
          const phone = document.getElementById('phone').value;
          const pincode = document.getElementById('pincode').value;
          const address = document.getElementById('address').value;
          const city = document.getElementById('city').value;
          const state = document.getElementById('inputState').value;
          const landmark = document.getElementById('landmark').value;
          const addresstype = document.getElementById('addresstype').value;
      
          // Regular expression to match a valid phone number format (modify as needed)
          const phoneRegex = /^\d{10}$/;
      
          if (
              name === '' ||
              phone === '' ||
              pincode === '' ||
              address === '' ||
              city === '' ||
              state === '' ||
              landmark === '' ||
              addresstype === ''
          ) {
              Swal.fire({
                  title: 'Error occurred!',
                  text: 'Please fill all the fields',
                  icon: 'error',
                  confirmButtonColor: '#d33'
              });
          } else if (!phone.match(phoneRegex)) {
              Swal.fire({
                  title: 'Invalid Phone Number!',
                  text: 'Please enter a valid 10-digit phone number',
                  icon: 'error',
                  confirmButtonColor: '#d33'
              });
          } 
          else if (isNaN(pincode)) {
                    Swal.fire({
                        title: 'Invalid Pincode!',
                        text: 'Please enter a valid numeric pincode',
                        icon: 'error',
                        confirmButtonColor: '#d33'
                    });
          }
          
          
          else {
              Swal.fire({
                  title: 'Submit this address?',
                  text: 'You are about to add this address.',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'Yes, add it!',
                  cancelButtonText: 'Cancel'
              }).then((result) => {
                  if (result.isConfirmed) {
                      addressnewform.submit();
                      Swal.fire({
                          title: 'Address added',
                          text: 'New address has been added',
                          icon: 'success',
                          showConfirmButton: false
                      });
                  }
              });
          }
      }
      




