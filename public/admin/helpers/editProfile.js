// change password

async function changePassword() {
          const firstname = document.getElementById('firstname').value;
          const lastname = document.getElementById('lastname').value;
          const password = document.getElementById('password').value;
          const newpassword = document.getElementById('newpassword').value;
          const confirmpassword = document.getElementById('confirmpassword').value;
      
          if (newpassword !== confirmpassword) {
              await Swal.fire({
                  title: 'Passwords do not match!',
                  text: 'Type the same password in both fields',
                  icon: 'error',
                  showCancelButton: true,
                  confirmButtonText: 'Ok',
              });
              return; // Stop further execution if passwords don't match
          }
      
          const confirmation = await Swal.fire({
              title: 'Update account?',
              text: 'You are about to change your account credentials.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, change it!',
              cancelButtonText: 'Cancel',
          });
      
          if (confirmation.isConfirmed) {
              const data = {
                  password,
                  newpassword,
                  confirmpassword,
                  firstname,
                  lastname,
              };
      
              const response = await fetch('/user/updateAccount', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json', // Fix typo here
                  },
                  body: JSON.stringify(data), // Convert data to JSON string
              });

              if(response.status === 401)
              {
                  Swal.fire({
                      title: 'Error',
                      text: 'Error in updating credentials',
                      icon: 'error',
                      showCancelButton: true,
                      confirmButtonText: 'Ok',
                  });
                  return;

              }
      
              if (!response.ok) {
                    Swal.fire({
                      title: 'Error',
                      text: 'Error in updating credentials',
                      icon: 'error',
                      showCancelButton: true,
                      confirmButtonText: 'Ok',
                  });
                  return;
              }
             
             
                  Swal.fire({
                  title: 'Updated',
                  text: 'Your account credentials have been updated',
                  icon: 'success',
                  showConfirmButton: false,
              });
              window.location.reload()

              
      
              const responseData = await response.json();
              console.log(responseData);
      
                
          }
      }