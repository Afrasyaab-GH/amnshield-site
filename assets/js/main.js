// Highlight active navigation link
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === '/' 
      ? currentPath === '/' || currentPath === '/index.html'
      : currentPath === href || currentPath.startsWith(href);
      
    if (isActive) {
      link.className = 'text-sm font-bold text-secondary transition';
    } else {
      link.className = 'text-sm font-medium text-on-surface hover:text-secondary transition';
    }
  });
});

// Add scroll event listener for navbar styling (safely check for header/navbar existence)
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar') || document.querySelector('header');
  if (!navbar) return;
  
  if (window.scrollY > 50) {
    navbar.classList.add('shadow-md');
  } else {
    navbar.classList.remove('shadow-md');
  }
});

