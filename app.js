const loginForm = document.getElementById('loginForm');
const password = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const toast = document.getElementById('toast');

lucide.createIcons();

function showToast(message) {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

togglePassword.addEventListener('click', () => {
  const hidden = password.type === 'password';
  password.type = hidden ? 'text' : 'password';
  togglePassword.innerHTML = hidden
    ? '<i data-lucide="eye-off"></i>'
    : '<i data-lucide="eye"></i>';
  togglePassword.setAttribute('aria-label', hidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
  lucide.createIcons();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const button = loginForm.querySelector('.primary-button');
  const label = button.querySelector('.button-label');

  button.classList.add('loading');
  label.textContent = 'Entrando';
  button.querySelector('svg')?.setAttribute('data-lucide', 'loader-circle');
  lucide.createIcons();

  window.setTimeout(() => {
    button.classList.remove('loading');
    label.textContent = 'Entrar';
    button.querySelector('svg')?.setAttribute('data-lucide', 'arrow-right');
    lucide.createIcons();
    showToast('Login visual listo');
  }, 900);
});

document.querySelectorAll('[data-soon]').forEach((button) => {
  button.addEventListener('click', () => showToast('Próximamente'));
});
