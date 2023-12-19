// submitform fetch


function submitForm()
{
    const addressnewform = document.getElementById('formshow')

    Swal.fire({
title: 'Edit address?',
text: 'You are about to edit this address.',
icon: 'confirm',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: 'Yes, edit it!',
cancelButtonText: 'Cancel'
}).then((result) => {
if (result.isConfirmed) {
 addressnewform.submit()
    Swal.fire({
        title: 'Address edited',
        text: 'New address has been edited',
        icon: 'success',
        showConfirmButton: false,
        
    } );
}
})


}
