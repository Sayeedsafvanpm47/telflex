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
      
      
      document.addEventListener("DOMContentLoaded", function() {
        // Get all discount input fields
        var discountInputs = document.querySelectorAll("input[id^='discount_']");
      
        // Loop through each discount input field
        discountInputs.forEach(function(discountInput) {
          discountInput.addEventListener("input", function() {
            var index = this.id.split("_")[1];
            var discountValue = parseFloat(this.value);
            var currentdiscount = document.getElementById("currentdiscount_" + index);
            var newprice = document.getElementById("newprice_" + index);
            var mrp = parseFloat(document.getElementById("mrpinput_" + index).value);
         
            if (discountValue <= 0 || discountValue >= 100) {
                var modal = document.getElementById("myModal");
          var modalMessage = document.getElementById("modalMessage");
          modalMessage.innerHTML = 'Invalid discount. Please enter a value between 1 and 99.';
          modal.style.display = "block";
      
      
          // Hide the modal when the user clicks the close button
          var span = document.getElementsByClassName("close")[0];
          span.onclick = function() {
            modal.style.display = "none";
          }
          setTimeout(()=>{
                location.reload()
          },2000)
          savebtn = document.getElementById('savebtn_' + index)
          savebtn.style.visibility = 'hidden'
      
          return;
         
        }
      
            var newDiscount = parseFloat(this.value);
            currentdiscount.innerHTML = newDiscount + "%";
            var priceChanged = parseFloat(mrp - (mrp * (newDiscount / 100)));
            newprice.innerHTML = priceChanged;
          });
        });
      });
      
      async function calculatePrice(_id, i) {
        const newDiscount = parseFloat(document.getElementById('discount_' + i).value);
        const newPrice = parseFloat(document.getElementById('newprice_' + i).innerHTML);
      const variantId = document.getElementById('variantId_' + i).value
        const data = {
          _id: _id,
          newDiscount: newDiscount,
          newPrice: newPrice,
          variantId : variantId
        };
      
        try {
          
          const confirmResult = await Swal.fire({
        title: 'Change discount?',
        text: 'Are you sure you want to change the discount of this product?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
        });
        
        if (confirmResult.isConfirmed) {
          const response = await fetch('/admin/productOffer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const responseData = await response.json();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: responseData.message, // Assuming responseData.message contains success message
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              window.location.assign('/admin/getProductOffers');
            }
          });
      
         
          console.log('Request was successful:', responseData);
        }
        } catch (error) {
        
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please verify the enetered input again!',
          });
          console.error('There was a problem with the fetch operation:', error);
        }
      }