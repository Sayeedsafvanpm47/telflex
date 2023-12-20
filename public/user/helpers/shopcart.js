// increase and decrease
let couponAppliedCheck = false
async function increase(productId,i) {
          var target = document.getElementById('quantity' + productId);
          var newQuantity = document.getElementById('newQuantity' + productId)
          target.value = parseInt(target.value) + 1;
          let stockChange = document.getElementById(`laststock${i}`)

          let checkStock = parseInt(document.getElementById(`laststock${i}`).value)
          stockChange.value = parseInt(checkStock) - 1
          let lastStock = stockChange.value
          if(stockChange <=0)
          {
              
              document.getElementById(`inc_btn${i}`).style.display = 'none'
              document.getElementById(`stockAlert${i}`).innerHTML = 'Sorry, Stock out'
          }
          if(checkStock <=0 )
          {
              target.value -= 1
              document.getElementById(`inc_btn${i}`).style.display = 'none'
              document.getElementById(`stockAlert${i}`).innerHTML = 'Sorry, Stock out'
          }

      
          calc(productId,i); 
          
          newQuantity.innerHTML = target.value
      }
  
     async function decrease(productId,i) {
          var target = document.getElementById('quantity' + productId);
          if (parseInt(target.value) > 1) {
              target.value = parseInt(target.value) - 1;
              var newQuantity = document.getElementById('newQuantity' + productId)
              let checkStock = document.getElementById(`laststock${i}`)
              checkStock.value = parseInt(checkStock.value) + 1
              let lastStock = checkStock.value
          newQuantity.innerHTML = target.value
       
              calc(productId,i); 
          }
      }



//    delete cart item   

function deleteCartItem(cartId,productId,singleId)
{
    Swal.fire({
title: 'Are you sure you want to remove this item from cart?',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, Remove!'
}).then((result) => {
if (result.isConfirmed) {
Swal.fire({
title: 'Item Removed from cart',
icon: 'success',

confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',

})

window.location.href = `/user/deleteCart?productId=${cartId}&productmainid=${productId}&singleid=${singleId}`; 
}
});
}

// window onload
window.onload = function () {
   
          var allSums = document.querySelectorAll('.calctotal');
      
          var sumtotal = 0;
          allSums.forEach(function (element) {
            sumtotal += parseFloat(element.innerText);
          });
     
    
          if (!isNaN(sumtotal)) {
            document.getElementById('showtotal').innerHTML =  sumtotal.toFixed(2);
            document.getElementById('showtotalamount').innerHTML =  sumtotal.toFixed(2);
            document.getElementById('subtotalinputfield').value = sumtotal.toFixed(2)
            document.getElementById('totalCheck').value = sumtotal.toFixed(2)
            
    
        
          }
          const total = document.getElementById('subtotalinputfield').value 
          if(total > 0)
          {
            document.getElementById('proceedbtn').style.display = 'block'

            document.getElementById('totaltable').style.display = 'block'

          }


        };

//         updatetotalandsubmit

function updateTotalAndSubmit() {
    
          var showTotalAmount = document.getElementById('showtotalamount').innerText;
          
  
          document.getElementById('totalinputfield').value = showTotalAmount;
  
  
          document.getElementById('checkoutForm').submit();
      }


//       calculate amount and coupon applied logics

function calc(productId,i) {
          var mul = document.getElementById("mul" + productId).value;
          var quantity = document.getElementById("quantity" + productId).value;
          
          var sum = document.getElementById('calcprice' + productId);
          var totalPrice = parseFloat(sum.innerText) || parseFloat(sum.textContent);
          let minimumpurchasealert = document.getElementById('minimumpurchasealert').value
          
          var total = parseFloat(mul) * parseFloat(quantity);
          
          if (!isNaN(total)) {
           sum.innerHTML =  total.toFixed(2);
          }
          
          var sumtotal = 0;
          var allSums = document.querySelectorAll('.calctotal');
          
          for (let i = 0; i < allSums.length; i++) {
           console.log(allSums)
          sumtotal += +allSums[i].innerText;
          }
          console.log(sumtotal)
          
          if (!isNaN(sumtotal)) {
          document.getElementById('showtotal').innerHTML =  sumtotal.toFixed(2);
          document.getElementById('showtotalamount').innerHTML =  sumtotal.toFixed(2);
          document.getElementById('subtotalinputfield').value = sumtotal.toFixed(2)
          
          
          }
          let quantityUpdate
          let lastStock = document.getElementById('laststock' + i).value
          let productsingleid = document.getElementById(`productsingleid${i}`).value
          let productsizefind = document.getElementById(`productsizefind${i}`).value
          let productmainid = document.getElementById(`productmainid${i}`).value
          
           quantityUpdate = document.getElementById("quantity" + productId).value;
          console.log(quantityUpdate);
          
          
          
              fetch(`/user/updateCart?productId=${productId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  quantity: quantityUpdate,
                  lastStock : lastStock,
                  productsingleid : productsingleid,
                  productsizefind : productsizefind,
                  productmainid : productmainid
                
                  
                 
              }),
          })
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(data => {
                let totalAmount = parseInt(document.getElementById('showtotalamount').value)
               if(couponAppliedCheck)
               {
                couponApplied()
               }
                  
                  console.log('Success:', data);
              })
              .catch(error => {
                  console.log('Error:', error);
              });
          
          
          
          
          }
          
          
          async function couponApplied() {
              let couponset = false;
             
              const couponCode = document.getElementById('couponinput').value;
              const totalamountcheck = document.getElementById('subtotalinputfield').value
              const coupon = couponCode.replace(/\W/g, '').toUpperCase();
              const couponspan = document.getElementById('couponAppliedSpan')

             
          
          
          
              console.log(coupon);
          
              try {
              
          
                
                  const response = await fetch(`/user/applyCoupon?coupon=${coupon}&total=${totalamountcheck}`, {
                      method: 'GET'
                  });
          
                  if (!response.ok) {
                      throw new Error(`Server responded with status: ${response.status}`);
                  }
          
                  const responseData = await response.json();
                 
                 
               
                  const disc = parseFloat(responseData.discount)
                  const minimum = parseFloat(responseData.minimumpurchase)
                  console.log(minimum)
                  console.log(disc)
                  const showTotal = document.getElementById('showtotalamount');
                  const totalinput = document.getElementById('totalinputfield')
                  const minimumpurchase = document.getElementById('minimumpurchasealert')
          const totalAmount = parseFloat(showTotal.innerText); 
          console.log(disc)
          console.log(typeof disc)
          console.log(totalAmount)
          console.log(typeof totalAmount)
          
          if (!isNaN(totalAmount)) { 
              const discountedTotal = totalAmount - (totalAmount * (disc / 100));
              console.log(discountedTotal)
              console.log(typeof discountedTotal)
              showTotal.innerHTML = discountedTotal.toFixed(2);
              couponspan.innerHTML = `${couponCode} coupon applied succesfully`
              totalinput.value =  discountedTotal.toFixed(2);
              minimumpurchase.value = minimum
              couponset = true;

              Swal.fire({
                icon: 'success',
                title: 'Coupon Applied',
                text: `${couponCode} coupon applied successfully!`,
            });
            couponAppliedCheck = true
              
                
                
          }
          
                  console.log(showTotal)
                  if (couponset) {
                  var btn = document.getElementById('showCouponDiv');
                  btn.style.display = 'none';
                  var show = document.getElementById('applyOther')
                  show.style.display = 'block'
                 
              }
                
          
              } catch (error) {
                  console.error('Error:', error.message);
                  // Additional logging of error stack trace
                  console.error('Error Stack:', error.stack);
                 couponset = false
                 couponspan.innerHTML = ``

                
                  Swal.fire({
                    icon: 'error',
                    title: 'Coupon Error',
                    text: 'Invalid coupon, try with another coupon'
                });
              }
          }
          
          
          
          async function appliedCoupon()
          { 
              const coupon = document.getElementById('couponinput').value
              const formatted = coupon.replace(/\W/g, '').toUpperCase();
              console.log(formatted)
              const applied = document.getElementById('appliedCouponName')
              
              applied.value = formatted
              const res = document.getElementById('appliedCouponName').value
              console.log(res)
             
          
          }
          
          //  show div logic

          
          function showDiv(index) {
                    amount = parseInt(document.getElementById('totalCheck').value);
                    divShow = document.getElementById(`coupon${index}`);
                    couponcode = document.getElementById(`couponcodehide${index}`);
                    checkAmount =parseInt(document.getElementById(`minimumPurchase${index}`).value)
                
                  
                }
                
                                                                    
                                                                    
                
                
                
                                                                  function showData() {
                                                                  
                    var length = document.getElementById('lengthCoupon').value;
                
                    for (let i = 0; i < length; i++) {
                        let button = document.getElementById(`showBtn${i}`);
                        if (button) {
                    
                            console.log(`Button with ID showBtn${i} found`);
                
                            button.click();
                        } else {
                            // Log if the button is not found
                            console.log(`Button with ID showBtn${i} not found`);
                        }
                    }
                }
                