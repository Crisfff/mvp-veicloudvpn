lucide.createIcons();

const authOptions = document.getElementById('authOptions');
const emailForm = document.getElementById('emailForm');
const showEmailForm = document.getElementById('showEmailForm');
const backToOptions = document.getElementById('backToOptions');
const googleButton = document.getElementById('googleButton');
const password = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const forgotButton = document.getElementById('forgotButton');
const toast = document.getElementById('toast');

function showToast(message){
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

showEmailForm.addEventListener('click', () => {
  authOptions.hidden = true;
  emailForm.hidden = false;
  lucide.createIcons();
  setTimeout(() => emailForm.querySelector('input')?.focus(), 80);
});

backToOptions.addEventListener('click', () => {
  emailForm.hidden = true;
  authOptions.hidden = false;
});

togglePassword.addEventListener('click', () => {
  const reveal = password.type === 'password';
  password.type = reveal ? 'text' : 'password';
  togglePassword.innerHTML = reveal
    ? '<i data-lucide="eye-off"></i>'
    : '<i data-lucide="eye"></i>';
  togglePassword.setAttribute('aria-label', reveal ? 'Ocultar contraseña' : 'Mostrar contraseña');
  lucide.createIcons();
});

emailForm.addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('Login listo para conectar');
});

googleButton.addEventListener('click', () => showToast('Google listo para conectar'));
forgotButton.addEventListener('click', () => showToast('Recuperación de contraseña próximamente'));

document.querySelectorAll('.legal-link').forEach((button) => {
  button.addEventListener('click', () => showToast(button.textContent.trim()));
});
