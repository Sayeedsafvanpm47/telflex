// showaddress
const btn = document.getElementById('showaddress');
    
btn.addEventListener('click', () => {
  const form = document.getElementById('formshow');

  if (form.style.display === 'none') {
   
    form.style.display = 'block';
  } else {
   
    form.style.display = 'none';
  }
});


// place order logics


function selectAddress(index) {
   
            
          document.getElementById('selectedAddressDetails').value = index;
         
          console.log(index)
       
       }
       
       document.addEventListener("DOMContentLoaded", function () {
         
               document.getElementById('address_0').checked = true;
             
               selectAddress('0');
           });
       
       
       
       async function confirmPlaceOrder() {
           const selectedPaymentMethod = document.querySelector('input[name="payment_option"]:checked').getAttribute('data-payment-method');
           Swal.fire({
               title: 'Confirm Order',
               text: 'Are you sure you want to place the order?',
               icon: 'question',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, Place Order'
           }).then(async (result) => {
               if (result.isConfirmed) {
              
           if (selectedPaymentMethod === 'razorpay') {
            
              await initiateRazorpayPayment();
           }else{
                   await placeOrder();
           }
               }
           });
       }
       
       
       
       
       async function initiateRazorpayPayment() {
           try {
               const selectedAddressDetails = document.getElementById('selectedAddressDetails').value;
       
               const response = await fetch('/user/placeOrder', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({ selectedAddressDetails, payment_option: 'Razorpay' })
               });
       
               const data = await response.json();
               if (data && data.order) {
                   const { amount, order_id, currency } = data.order;
       
                   const options = {
                       key: 'rzp_test_kE5gjv2l8cgs79', // Replace with your Razorpay key
                       amount: amount, // Replace with the actual amount
                       currency: currency,
                       order_id: order_id,
                       handler: async function (response) {
                           console.log(response);
                           if (response.razorpay_payment_id) {
                             await placeOnlineOrder()
                           } else {
                               console.log('Payment unsuccessful');
                              
                           }
                           window.location.href = 'account';
                       },
                       prefill: {
                           name: 'Sayeed Safvan',
                           email: 'syd@gmail.com',
                           contact: '7025053170'
                       }
                   };
       
                   const rzp = new Razorpay(options);
                   rzp.on('payment.error', function (response) {
                       console.log('Payment Error:', response.error.code, response.error.description);
                      
       
       Swal.fire({
           icon: 'error',
           title: 'Payment Error',
           text: 'There was an error processing your payment. Please try again.',
       });
                   });
                   rzp.open(); // Open Razorpay payment dialog
               }
           } catch (error) {
               console.error('Error initiating Razorpay payment:', error);
               Swal.fire({
                   icon: 'error',
                   title: 'Error',
                   text: 'An unexpected error occurred. Please try again later.',
               });
           }
       }
       
       
       
       
       async function placeOrder() {
           const orderForm = document.getElementById('orderForm');
           const formData = new FormData(orderForm);
           const index = document.getElementById('selectedAddressDetails').value;
       
           const requestData = {};
           for (const [key, value] of formData) {
               requestData[key] = value;
           }
           requestData.selectedAddressDetails = index;
       
           try {
               const response = await fetch('/user/placeOrder', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(requestData)
               });
       
               const data = await response.json();
               if (data && data.message === 'Order placed successfully') {
                   Swal.fire({
                       icon: 'success',
                       title: 'Order Placed Successfully!',
                       text: 'Thank you for your order.',
                   });
                   window.location.href = 'account';
               } else {
                   Swal.fire({
                       icon: 'error',
                       title: 'Error!',
                       text: 'Error placing the order',
                   });
               }
           } catch (error) {
               console.error('Error placing the order:', error);
               Swal.fire({
                   icon: 'error',
                   title: 'Error!',
                   text: 'Error placing the order',
               });
           }
       }
       
       async function placeOnlineOrder()
       {
           const orderForm = document.getElementById('orderForm');
           const formData = new FormData(orderForm);
           const index = document.getElementById('selectedAddressDetails').value;
       
           const requestData = {};
           for (const [key, value] of formData) {
               requestData[key] = value;
           }
           requestData.selectedAddressDetails = index;
       
          
               const response =  await fetch('/user/placeOrder', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(requestData)
               });
                     
       }
           
       
       
       
       