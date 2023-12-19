// check stock

async function checkStock() {
          try {

              



              const stock = document.getElementById('stockView3');
          
            
            
              const lastStock = stock.value;
  
              if (stock.value <= 0) {
                  document.getElementById('inc_btn').style.display = 'none';
                  document.getElementById('dec_btn').style.display = 'none';
  
                  let stockView2 = document.getElementById('stockView2');
                  stockView2.innerHTML = 'Can\'t add more, Please check your cart!';
                  stockView2.style.color = 'red';
  
              }
          } catch (error) {
              console.error(error);
             
          }
      }



//       increase and decrease

function increase() {
          event.preventDefault();
          var target = document.getElementById('quantity');
          target.value = parseInt(target.value) + 1;
          var quantityValue = document.getElementById('quantityvalue');
          quantityValue.innerHTML = target.value;
      let stockView = document.getElementById('stockView2')
          let checkStock = document.getElementById('stockView3');
          let dec_btn = document.getElementById('dec_btn')
          checkStock.value = parseInt(checkStock.value) - 1;
          document.getElementById('stockView2').innerHTML = checkStock.value
      
          let inc_btn = document.getElementById('inc_btn');
          let stock = parseInt(checkStock.value) > 0;
          if (stock) {
              inc_btn.style.display = 'block';
          } else {
              inc_btn.style.display = 'none';
      
              dec_btn.style.display = 'none'
              stockView2.innerHTML = 'Sorry, We ran out of stock! :('
              quantityValue.innerHTML = 'Congrats, be the one to purchase the last item : )'
          
      
          }
      }
      
      function decrease() {
          event.preventDefault();
          var target = document.getElementById('quantity');
          if (parseInt(target.value) > 1) {
              target.value = parseInt(target.value) - 1;
              var quantityValue = document.getElementById('quantityvalue');
              quantityValue.innerHTML = target.value;
      
              let checkStock = document.getElementById('stockView3');
              checkStock.value = parseInt(checkStock.value) + 1;
              document.getElementById('stockView2').innerHTML = checkStock.value
              
      
              let dec_btn = document.getElementById('dec_btn');
             
          }
      }


//       show review

function showReview()
{
    document.getElementById('divComments').style.display = 'block'
    showRatings()
}


// show ratings

function showRatings(){
          const five = parseInt(document.getElementById('five').value) 
          const four = parseInt(document.getElementById('four').value) 
          const three = parseInt(document.getElementById('three').value) 
          const two = parseInt(document.getElementById('two').value) 
          const one = parseInt(document.getElementById('one').value) 

          document.getElementById('fiveStarBar').style.width = `${(five / 5) * 100}%`;
document.getElementById('fourStarBar').style.width = `${(four / 5) * 100}%`;
document.getElementById('threeStarBar').style.width = `${(three / 5) * 100}%`;
document.getElementById('twoStarBar').style.width = `${(two / 5) * 100}%`;
document.getElementById('oneStarBar').style.width = `${(one / 5) * 100}%`;
document.getElementById('fiveStarBar').innerHTML = `${(five / 5) * 100}%`;
document.getElementById('fourStarBar').innerHTML = `${(four / 5) * 100}%`;
document.getElementById('threeStarBar').innerHTML = `${(three / 5) * 100}%`;
document.getElementById('twoStarBar').innerHTML = `${(two / 5) * 100}%`;
document.getElementById('oneStarBar').innerHTML = `${(one / 5) * 100}%`;
           }



          //  addtowish


          async function addToWish() {
                    const quantity = document.getElementById('quantity').value;
                    const size = document.getElementById('sizeView').value;
                    const mrp = document.getElementById('mrpView').value;
                    const price = document.getElementById('priceView').value;
                    const disc = document.getElementById('discountinp').value;
                    const stock = document.getElementById('stockView').value;
                    const productId = document.getElementById('productTarget').value;
                    const id = document.getElementById('id').value
            
                    const data = {
                        quantity, size, mrp, price, disc, stock, productId,id
                    };
            
                    try {
                        const response = await fetch('/user/addToWish', {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
            
                        if (!response.ok) {
                            throw new Error('Failed to add item to wishlist');
                        }
            
                        const responseData = await response.json();
                        console.log(responseData);
            
                        // Show success message using SweetAlert
                        swal({
                            title: 'Success!',
                            text: 'Item added to wishlist',
                            icon: 'success'
                        });
            
                    } catch (error) {
                        console.error(error);
                        // Show error message using SweetAlert if the operation fails
                        swal({
                            title: 'Error!',
                            text: 'Failed to add item to wishlist',
                            icon: 'error'
                        });
                    }
                }



          //      size change fetch 


          async  function show(sizeIndex,id) {
                    const price2 = document.getElementById('priceView2');
          const mrp2 = document.getElementById('mrpView2');
          const stock2 = document.getElementById('stockView2');
          const size2 = document.getElementById('sizeView2')
          const size = document.getElementById('sizeView')
          const price = document.getElementById('priceView');
          const mrp = document.getElementById('mrpView');
          const stock = document.getElementById('stockView');
          const discountInp = document.getElementById('discountinp')
          const discountSpan = document.getElementById('discountspan')
          const productTarget = document.getElementById('productTarget')
          const hiddenStock = document.getElementById('stockView3')
         
         
        
          var sizeVal;
        
                    fetch('/user/showPrice?id='+id,{method:'get'}).then((response)=>{
                   
                    if (response.status === 200) { 
                    response.json().then((res)=>{
                        
                        console.log(res.product.productName);
                        price.value = res.product.size[sizeIndex].productPrice
                        mrp.value = res.product.size[sizeIndex].mrp
                        stock.value = res.product.size[sizeIndex].stock
                        hiddenStock.value = res.product.size[sizeIndex].lastStock
                        size.value = res.product.size[sizeIndex].size
        size2.innerText = res.product.size[sizeIndex].size
        price2.innerText = res.product.size[sizeIndex].productPrice
                        mrp2.innerText = res.product.size[sizeIndex].mrp
                        stock2.innerText = res.product.size[sizeIndex].stock
                        discountInp.value = res.product.size[sizeIndex].productDiscount
                        discountSpan.innerHTML = res.product.size[sizeIndex].productDiscount + '% Off'
                        productTarget.value = res.product.size[sizeIndex]._id
                      
                       
                       
        
                        
                     
                     
                    })
                  }
                   })
                   const sizeInp = document.getElementById('sizeinp')
                   sizeInp.value = sizeVal
                 
              
        
        
                }