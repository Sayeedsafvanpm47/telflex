// fetch

async function editStatus(productId)
{
    try {

        const confirmResult = await Swal.fire({
title: 'List/Unlist Product',
text: 'Are you sure you want to change the visibility of this product?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, change it!'
});

if (confirmResult.isConfirmed) {

await fetch(`/admin/toggleListProducts?_id=${productId}`)
await Swal.fire('Success', 'Product status changed successfully!', 'success');
location.reload()

}
        
    } catch (error) {
        console.log(error)
        await Swal.fire('error', 'Some error occured!', 'error');
        
    }
    
}

function submitForm() {
            
          document.getElementById('categoryForm').submit();
      }