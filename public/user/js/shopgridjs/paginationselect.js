
     let clicked = false;
    function showSelect()
    {
        const select = document.getElementById('paginationspan');

if (!clicked) {
  select.style.display = 'block'; 
} else {
  select.style.display = 'none'; 
}

clicked = !clicked; 
    }

    function showSelect2()
    {
        const select = document.getElementById('sortspan');

if (!clicked) {
  select.style.display = 'block'; 
} else {
  select.style.display = 'none'; 
}

clicked = !clicked; 
    }



//     fetch for pagination


async function paginate() {
          const pagination = parseInt(document.getElementById('paginationnumber').value);
          try {
            const response = await fetch(`/user/paginate?pagination=${pagination}`, {
              method: 'GET'
            });
      
            if (!response.ok) {
              throw new Error('Error occurred');
            }
      location.reload()
            const responseData = await response.json();
           console.log('response ok')
         
            console.log(responseData);
           
          } catch (error) {
            // Handle error appropriately
            console.error(error.message);
          }
        }

//         fetch for sortBy

async function sortBy()
 {
     const sort = document.getElementById('sortBy').value

     const response = await fetch(`/user/sortBy?sort=${sort}`,{
         method : 'GET'
     })
     if(!response.ok)
     {
         throw new Error('response not ok')

     }
     location.reload()
     console.log('response success')
     const responseData = await response.json()
     console.log(responseData)


 }

