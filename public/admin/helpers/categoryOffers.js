// categorydiscount fetch

async function categoryDiscount(categoryId,i) {
          try {
            const discount = document.getElementById(`categoryDiscount${i}`).value;
            const data = {
              _id: categoryId,
              discount: discount
            };

            
          const confirmResult = await Swal.fire({
title: 'Update category discount?',
text: 'Are you sure you want to set new category discount?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, change it!'
});

if (confirmResult.isConfirmed) {
      
            const response = await fetch('/admin/offerCategory', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(data)
            });
      
            if (!response.ok) {
              Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Please verify the inputs again!'
  });
            }
         
      
            const responseData = await response.json();
            Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: responseData.message 
  }).then((result) => {
    if (result.isConfirmed || result.isDismissed) {
      window.location.assign('/admin/getCategoryOffer');
    }
  });
}
          } catch (error) {
                  console.error('There was a problem with the fetch operation:', error);
                  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'There was a problem with the operation!'
  });

          }
        }
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
