// fetch

async function dealer(event)
{
    try {
    
        const form = document.getElementById('dealerform')
        event.preventDefault()
   const name = document.getElementById('name').value
   const email = document.getElementById('email').value 
   const address = document.getElementById('address').value 
   const message = document.getElementById('message').value 
   const phone = document.getElementById('phone').value 
   const data = {
    name,email,address,message, phone
   }
   if(name == '' || address == '' || message == '')
{
    await Swal.fire('Error', 'Please fill in every fields', 'error');
    return; 

}
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    await Swal.fire('Error', 'Please enter a valid email address', 'error');
    return; 
}


const phoneRegex = /^\d{10}$/; 
if (!phoneRegex.test(phone)) {
    await Swal.fire('Error', 'Please enter a valid 10-digit phone number', 'error');
    return; 
}
const confirmResult = await Swal.fire({
title: 'Contact Telflex',
text: 'Are you sure you want to submit this message?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, submit!'
});
if (confirmResult.isConfirmed) {

form.submit()





const response =  await fetch('/user/dealermessage',{
method : 'POST',
headers : {
    'Content-type' : 'application/json'
},
body : JSON.stringify(data)
})

if(!response.ok)
{
await Swal.fire('Error', 'An error occurred while submitting the message', 'error');
}
else{
await Swal.fire('Success', 'Query submitted succesfully', 'success');
}






}
        
    } catch (error) {
        console.log(error)
        await Swal.fire('Error', 'An error occurred while submitting the message', 'error');
    }
 
}