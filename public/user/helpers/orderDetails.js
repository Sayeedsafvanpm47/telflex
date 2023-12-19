// print invoice
function printInvoice()
{
    document.getElementById('returnhideheader').style.display = 'none'
    document.getElementById('returnhide').style.display = 'none'
    window.print()
    
}


// modal

var modal = document.getElementById("myModal");
    
// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// fetch

function cancelOrder(orderId) {
          event.preventDefault();
          const reason = document.getElementById('reason').value;
          console.log(reason)
          const data = {
              reason: reason,
              _id: orderId
          };
  
          Swal.fire({
              icon: 'warning',
              title: 'Are you sure?',
              text: 'Do you want to cancel this order?',
              showCancelButton: true,
              confirmButtonText: 'Yes, cancel it!',
              cancelButtonText: 'No, keep it'
          }).then((result) => {
              if (result.isConfirmed) {
                  fetch(`/user/cancelOrder`, {
                      method: 'POST',
                      headers: {
                          'Content-type': 'application/json',
                      },
                      body: JSON.stringify(data)
                  })
                  .then((res) => {
                      if (!res.ok) {
                          throw new Error('response was not okay');
                      }
                      return res.json();
                  })
                  .then((data) => {
                      Swal.fire({
                          icon: 'success',
                          title: 'Order Cancelled',
                          text: 'Your order has been cancelled successfully!',
                      });
                      console.log(data);
                      window.location.href = 'account';
                  })
                  .catch((error) => {
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong! Unable to cancel the order.',
                          footer: `<p>${error.message}</p>`,
                      });
                      console.log(error);
                  });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire('Cancelled', 'Your order is safe :)', 'info');
              }
          });
      }



//       return fetch

function returnOrder(orderId) {
          event.preventDefault();
              const reason = document.getElementById('reasonForReturn').value;
              console.log(reason)
              const data = {
                  reason: reason,
                  _id: orderId
              };
      
          Swal.fire({
              icon: 'warning',
              title: 'Are you sure?',
              text: 'Do you want to return this product?',
              showCancelButton: true,
              confirmButtonText: 'Yes, confirm!',
              cancelButtonText: 'No, keep it'
          }).then((result) => {
              if (result.isConfirmed) {
                 
                  fetch(`/user/returnOrder`, {
                          method: 'POST',
                          headers: {
                              'Content-type': 'application/json',
                          },
                          body: JSON.stringify(data)
                      })
                  .then((data) => {
                   
                      Swal.fire({
                          icon: 'success',
                          title: 'Request for return submitted',
                          text: 'Your order will soon be collected by the team, hang in there, Cheers!',
                      });
                      console.log(data); 
                      window.location.href = 'account'
                  })
                  .catch((error) => {
                     
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Something went wrong! Unable to cancel the order.',
                          footer: `<p>${error.message}</p>`,
                      });
                      console.log(error);
                  });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
               
                  Swal.fire('Cancelled', 'Your order is safe :)', 'info');
              }
          });
      }