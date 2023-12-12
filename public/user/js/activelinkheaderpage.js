function setUnderlineForActiveLink() {
          const links = document.querySelectorAll('.main-menu ul li a');
          const currentUrl = window.location.pathname;
  
          links.forEach(function(link) {
              const linkUrl = link.getAttribute('href');
              if (currentUrl === linkUrl) {
                  link.classList.add('active-link'); 
              }
          });
      }
  
    
      window.addEventListener('load', setUnderlineForActiveLink);