// image preview

$(document).ready(function() {
          let imagesPreview = function(input, placeToInsertImagePreview) {
            if (input.files) {
              let filesAmount = input.files.length;
              for (i = 0; i < filesAmount; i++) {
                let reader = new FileReader();
                reader.onload = function(event) {
                  $($.parseHTML("<img>"))
                    .attr("src", event.target.result)
                    .appendTo(placeToInsertImagePreview);
                };
                reader.readAsDataURL(input.files[i]);
              }
            }
          };
          $("#input-images").on("change", function() {
            imagesPreview(this, "div.preview-images");
          });
        });

        

        // size variation input creation logic

        document.addEventListener("DOMContentLoaded", function() {
      
          const showSizeButton = document.getElementById("showSizeButton");
          const sizeFieldsContainer = document.getElementById("sizeFieldsContainer");
        
          showSizeButton.addEventListener("click", function() {
            // Clear any existing dynamic fields
            sizeFieldsContainer.innerHTML = "";
        
            const numberSize = parseInt(document.querySelector("input[name='numberSize']").value);
            
            if (isNaN(numberSize) || numberSize <= 0) {
              alert("Please enter a valid number for Product Size.");
              return;
            }
        
            // Create dynamic size and price input fields
            for (let i = 0; i < numberSize; i++) {
                
              const sizeInput = document.createElement("input");
              sizeInput.type = "text";
              sizeInput.style.width = "50%";
              sizeInput.style.marginTop = "10px";
              sizeInput.placeholder = "Enter Size";
              sizeInput.classList.add("form-control");
              sizeInput.name = `size_${i}`;
        
            

             

              const stockInput = document.createElement("input");
              stockInput.type = "number";
              stockInput.style.width = "50%";
              stockInput.style.marginTop = "10px";
              stockInput.placeholder = "Enter Stock";
              stockInput.classList.add("form-control");
              stockInput.name = `stock_${i}`;
              stockInput.id = `stock_${i}`

              const lastStockInput = document.createElement("input");
              lastStockInput.type = "number";
              lastStockInput.style.width = "50%";
              lastStockInput.style.marginTop = "10px";
              lastStockInput.placeholder = "Last Stock";
              lastStockInput.classList.add("form-control");
              lastStockInput.name = `laststock_${i}`;
              lastStockInput.id = `laststock_${i}`
              lastStockInput.style.visibility = 'hidden'
              
              const mrpInput = document.createElement("input");
              mrpInput.type = "number";
              mrpInput.style.width = "50%";
              mrpInput.style.marginTop = "10px";
              mrpInput.placeholder = "Enter MRP";
              mrpInput.classList.add("form-control");
              mrpInput.name = `mrp_${i}`;
              mrpInput.id =  `mrpId${i}`

                
              const prodiscInput = document.createElement("input");
              prodiscInput.type = "number";
              prodiscInput.style.width = "50%";
              prodiscInput.style.marginTop = "10px";
              prodiscInput.placeholder = "Enter discount";
              prodiscInput.classList.add("form-control");
              prodiscInput.name = `prodisc_${i}`;
              prodiscInput.id =  `prodiscId${i}`
              
           
              const priceInput = document.createElement("input");
              priceInput.type = "number";
              priceInput.style.width = "50%";
              priceInput.style.marginTop = "10px";
              priceInput.placeholder = "Enter Price";
              priceInput.classList.add("form-control");
              priceInput.name = `productprice_${i}`;
              priceInput.id = `productpriceId${i}`
              priceInput.style.visibility = 'hidden';
              
        
              // Append the inputs to the container
              sizeFieldsContainer.appendChild(sizeInput);
     
              sizeFieldsContainer.appendChild(stockInput);
              sizeFieldsContainer.appendChild(mrpInput);
              sizeFieldsContainer.appendChild(prodiscInput);
              sizeFieldsContainer.appendChild(priceInput);
              sizeFieldsContainer.appendChild(lastStockInput)



              let realStock = document.getElementById(`stock_${i}`)
  let lastStock = document.getElementById(`laststock_${i}`)

realStock.addEventListener("input", function() {
   
   lastStock.value = parseInt(realStock.value)
 });

              const price = document.getElementById(`productpriceId${i}`);
              
      const mrp = document.getElementById(`mrpId${i}`);
      const discount = document.getElementById(`product_disc`);
      const disc = parseFloat(document.getElementById('product_disc').value);
      var prodisc = document.getElementById(`prodiscId${i}`)
      console.log(prodisc)
      prodisc.value = disc
prodisc.readOnly = true

      mrp.addEventListener("input", function() {
   
        let mrpValue = parseFloat(this.value);
        let calculatedPrice = mrpValue - (mrpValue * (disc/100));

        if (isNaN(mrpValue) || isNaN(calculatedPrice)) {
          price.value = ''; // Clear the price field if MRP or calculated price is NaN
        } else {
          price.value = calculatedPrice.toFixed(2);
          price.style.visibility = 'visible'
          priceInput.readOnly = true
        }
      });
      discount.addEventListener("input", function() {

mrp.value = ''

      });

            }

    
  });
});
// discount validation
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


// addproducts
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
      

async function addProduct(event)
{
    try {
      let imagesInput = document.getElementById('input-images')

      if (imagesInput.files.length <= 0) {
        event.preventDefault()

        return Swal.fire('Error', 'Please upload an image!', 'error');
      
      
      }
event.preventDefault()
const confirmResult = await Swal.fire({
title: 'add Product',
text: 'Are you sure you want to add this product?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, add it!'
});

if (confirmResult.isConfirmed) {
const form = document.getElementById('addProductForm')
form.submit()





await Swal.fire('Success', 'Product added successfully!', 'success');


}
} catch (error) {
console.error('Error adding product:', error);

await Swal.fire('Error', 'An error occurred while adding the product', 'error');
}

    

}