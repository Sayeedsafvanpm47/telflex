// fetch block

async function blockuser(email){

          const confirmResult = await Swal.fire({
         title: `Update usage status of ${email}?`,
         text: 'Are you sure you want to block/unblock this user?',
         icon: 'question',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Yes, change usage status!'
         });
         
         
         if (confirmResult.isConfirmed) { 
               try {
                 const response = await fetch(`/admin/blockUser?email=${email}`, { method: 'GET' });
         
                 if (response.ok) {
                   await Swal.fire('Success', 'Usage status updated successfully!', 'success');
                   location.reload(); 
                 } else {
                   await Swal.fire('Error', 'Failed to block/unblock the user', 'error');
                 }
               } catch (error) {
                 console.error('Error blocking user:', error);
                 await Swal.fire('Error', 'An error occurred while blocking the user', 'error');
               }
             }
         }
         