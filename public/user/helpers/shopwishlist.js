// delete wish

function deleteWish(id)
{
    Swal.fire({
    title: 'Are you sure you want to remove this item from Wishlist?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Remove!'
  }).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
title: 'Item Removed from Wishlist',
icon: 'success',

confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',

})
     
      window.location.href = `/user/deleteWish?id=${id}`; 
    }
  });
}