function applyThemeColor(color = '#111111') {
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach((meta) => meta.setAttribute('content', color));
}

applyThemeColor();
window.addEventListener('pageshow', () => applyThemeColor());
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) applyThemeColor();
});

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
const createAccountTop = document.getElementById('createAccountTop');
const mobileEmailSheet = document.getElementById('mobileEmailSheet');
const mobileSheetBackdrop = document.getElementById('mobileSheetBackdrop');
const mobileSheetClose = document.getElementById('mobileSheetClose');
const mobileEmailForm = document.getElementById('mobileEmailForm');
const mobilePassword = document.getElementById('mobilePassword');
const mobileTogglePassword = document.getElementById('mobileTogglePassword');

function showToast(message){
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function openMobileEmailSheet(){
  mobileEmailSheet?.classList.add('open');
  mobileEmailSheet?.setAttribute('aria-hidden','false');
  document.body.classList.add('sheet-open');
  lucide.createIcons();
  setTimeout(() => mobileEmailForm?.querySelector('input')?.focus(), 220);
}

function closeMobileEmailSheet(){
  mobileEmailSheet?.classList.remove('open');
  mobileEmailSheet?.setAttribute('aria-hidden','true');
  document.body.classList.remove('sheet-open');
}

showEmailForm.addEventListener('click', () => {
  if (window.matchMedia('(max-width: 759px)').matches) {
    openMobileEmailSheet();
    return;
  }

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


createAccountTop?.addEventListener('click', () => showToast('Crear cuenta listo para conectar'));


mobileSheetClose?.addEventListener('click', closeMobileEmailSheet);
mobileSheetBackdrop?.addEventListener('click', closeMobileEmailSheet);

mobileTogglePassword?.addEventListener('click', () => {
  if (!mobilePassword) return;
  const reveal = mobilePassword.type === 'password';
  mobilePassword.type = reveal ? 'text' : 'password';
  mobileTogglePassword.innerHTML = reveal
    ? '<i data-lucide="eye-off"></i>'
    : '<i data-lucide="eye"></i>';
  mobileTogglePassword.setAttribute('aria-label', reveal ? 'Ocultar contraseña' : 'Mostrar contraseña');
  lucide.createIcons();
});

mobileEmailForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('Inicio de sesión listo para conectar');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileEmailSheet?.classList.contains('open')) {
    closeMobileEmailSheet();
  }
});
