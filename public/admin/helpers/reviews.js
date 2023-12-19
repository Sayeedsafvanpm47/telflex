// reviews show or hide
async function showOrHide(index)
{
       const reviewId = document.getElementById(`reviewid${index}`).value
       const productId = document.getElementById(`productid${index}`).value
       try {
              const confirmResult = await Swal.fire({
                  title: 'Are you sure?',
                  text: 'Do you want to proceed with this action?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, proceed!'
              });
      
              if (confirmResult.isConfirmed) {
                  const response = await fetch(`/admin/reviewVisibility?reviewId=${reviewId}&productId=${productId}`);
                  
                  if (!response.ok) {
                      throw new Error('Request failed');
                  }
                  await Swal.fire('Success', 'Visibility status updated', 'success');
                  location.reload()
                  console.log('Success');
              }
          } catch (error) {
              console.error('Error:', error);
              await Swal.fire('Error', 'An error occurred while processing your request', 'error');
          }

}