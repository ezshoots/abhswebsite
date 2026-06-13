// ===== responsive navbar
let navbarToggler = document.querySelector('#navbarToggler');
const navbarCollapse = document.querySelector('#navbarCollapse');

navbarToggler.addEventListener('click', () => {
  navbarToggler.classList.toggle('navbarTogglerActive');
  navbarCollapse.classList.toggle('hidden');
});

//===== close navbar-collapse when a link is clicked
document.querySelectorAll('#navbarCollapse ul li:not(.submenu-item) a').forEach((e) =>
  e.addEventListener('click', () => {
    navbarToggler.classList.remove('navbarTogglerActive');
    navbarCollapse.classList.add('hidden');
  })
);

// ===== Sub-menu (click to open/close)
const submenuItems = document.querySelectorAll('.submenu-item');
submenuItems.forEach((el) => {
  el.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    const submenu = el.querySelector('.submenu');
    const isOpen = !submenu.classList.contains('hidden');
    // Close all open submenus first
    document.querySelectorAll('.submenu').forEach((s) => s.classList.add('hidden'));
    if (!isOpen) {
      submenu.classList.remove('hidden');
    }
  });
});

// ===== Close submenu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.submenu-item')) {
    document.querySelectorAll('.submenu').forEach((s) => s.classList.add('hidden'));
  }
});
