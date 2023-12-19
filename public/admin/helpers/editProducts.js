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

//         changeprice

function changePrice(i) {
          var productDiscount = parseFloat(document.getElementById(`productDiscount${i}`).value);
         
          var mrp = parseFloat(document.getElementById(`productmrp${i}`).value);
      
          if (!isNaN(productDiscount) && !isNaN(mrp)) {
            var discountedPrice =  mrp - (mrp * (productDiscount / 100));
            // Set the calculated discounted price into the price input field
            document.getElementById(`productprice${i}`).value = parseInt(discountedPrice.toFixed(2))
          } else {
            // Handle the case where the input values are invalid or empty
            alert('Please enter valid numbers for discount and MRP.');
          }
        }

//         edit product

async function editProduct(event)
{
    try {
event.preventDefault()
const confirmResult = await Swal.fire({
title: 'Edit Product',
text: 'Are you sure you want to edit this product?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, edit it!'
});

if (confirmResult.isConfirmed) {
const form = document.getElementById('editProductForm')
form.submit()





await Swal.fire('Success', 'Product edited successfully!', 'success');


}
} catch (error) {
console.error('Error editing product:', error);

await Swal.fire('Error', 'An error occurred while editing the product', 'error');
}

    

}