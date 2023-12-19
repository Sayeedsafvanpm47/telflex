// form submission

async function editCategory(event)
{
    try {
event.preventDefault()
const confirmResult = await Swal.fire({
title: 'Edit Category',
text: 'Are you sure you want to edit this category?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, edit it!'
});

if (confirmResult.isConfirmed) {
const form = document.getElementById('editcategoryform')
form.submit()





await Swal.fire('Success', 'Category edited successfully!', 'success');


}
} catch (error) {
console.error('Error editing category:', error);

await Swal.fire('Error', 'An error occurred while editing the category', 'error');
}

    

}

async function list(Id)
{
    try {

        const confirmResult = await Swal.fire({
title: 'Edit Category',
text: 'Are you sure you want to change the visibility of this category?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, change it!'
});

if (confirmResult.isConfirmed) {
 await fetch(`/admin/toggleList?categoryId=${Id}`,{method:'GET'})
await Swal.fire('Success', 'Category visibility changed successfully!', 'success');
location.reload()

}
        
    } catch (error) {

        console.log(error)
        await Swal.fire('Error', 'Error while performing operation!', 'error');
        
    }
 

}
async function deleteCategory(Id)
{

    try {

const confirmResult = await Swal.fire({
title: 'Edit Category',
text: 'Are you sure you want to delete this category?',
icon: 'question',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, deleete it!'
});

if (confirmResult.isConfirmed) {
await fetch(`/admin/deleteCategory?categoryId=${Id}`,{
method:'get'})
await Swal.fire('Success', 'Category deleted successfully!', 'success');
location.reload()

}

} catch (error) {

console.log(error)
await Swal.fire('Error', 'Error while performing operation!', 'error');

}


}