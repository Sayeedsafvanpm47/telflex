async function sendreply(email, i) {
          try {
              const reply = document.getElementById(`reply${i}`).value;
             let replystatus = document.getElementById(`replystatus${i}`)
             let query = document.getElementById(`query${i}`).innerHTML
             let replymsg = document.getElementById(`replymessage${i}`)
            
              const confirmResult = await Swal.fire({
title: 'Confirm',
text: 'Do you want to send this email?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Send',
cancelButtonText: 'Cancel'
});
  
             
            
              if (confirmResult.isConfirmed) {

                  replystatus.innerHTML = `Replied!`
                  replymsg.innerHTML = `${reply}`
                const response = await fetch(`/admin/sendReply?reply=${reply}&email=${email}&query=${query}`);
                  const responseData = await response.json();
                
                  if (response.ok) {
                    

Swal.fire({
title: 'Email Sent',
text: 'Email has been sent successfully!',
icon: 'success',
confirmButtonColor: '#3085d6',
confirmButtonText: 'OK'
});

} 

              
              else{
Swal.fire({
title: 'Error',
text: 'An error occurred while sending the email. Please try again later.',
icon: 'error',
confirmButtonColor: '#3085d6',
confirmButtonText: 'OK'
});

}
             

            
              

                  console.log('Email sent successfully!');
                  // You may add more logic here after email sending success if needed
              }
          } catch (error) {
              console.error(error);
  
              // Show SweetAlert error message
              Swal.fire({
                  title: 'Error',
                  text: 'An error occurred while sending the email. Please try again later.',
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
              });
          }
      }