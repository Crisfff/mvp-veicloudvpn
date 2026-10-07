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
const mobileSignupSheet = document.getElementById('mobileSignupSheet');
const mobileSignupBackdrop = document.getElementById('mobileSignupBackdrop');
const mobileSignupClose = document.getElementById('mobileSignupClose');
const mobileSignupForm = document.getElementById('mobileSignupForm');
const mobileSignupPassword = document.getElementById('mobileSignupPassword');
const mobileSignupRepeatPassword = document.getElementById('mobileSignupRepeatPassword');
const mobileToggleSignupPassword = document.getElementById('mobileToggleSignupPassword');
const mobileToggleSignupRepeatPassword = document.getElementById('mobileToggleSignupRepeatPassword');

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


function openMobileSignupSheet(){
  mobileSignupSheet?.classList.add('open');
  mobileSignupSheet?.setAttribute('aria-hidden','false');
  document.body.classList.add('sheet-open');
  lucide.createIcons();
  setTimeout(() => mobileSignupForm?.querySelector('input')?.focus(), 220);
}

function closeMobileSignupSheet(){
  mobileSignupSheet?.classList.remove('open');
  mobileSignupSheet?.setAttribute('aria-hidden','true');
  document.body.classList.remove('sheet-open');
}

createAccountTop?.addEventListener('click', () => {
  if (window.matchMedia('(max-width: 759px)').matches) {
    openMobileSignupSheet();
    return;
  }
  showToast('Crear cuenta listo para conectar');
});


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


mobileSignupClose?.addEventListener('click', closeMobileSignupSheet);
mobileSignupBackdrop?.addEventListener('click', closeMobileSignupSheet);

function bindPasswordToggle(input, button){
  button?.addEventListener('click', () => {
    if (!input) return;
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.innerHTML = reveal
      ? '<i data-lucide="eye-off"></i>'
      : '<i data-lucide="eye"></i>';
    button.setAttribute('aria-label', reveal ? 'Ocultar contraseña' : 'Mostrar contraseña');
    lucide.createIcons();
  });
}

bindPasswordToggle(mobileSignupPassword, mobileToggleSignupPassword);
bindPasswordToggle(mobileSignupRepeatPassword, mobileToggleSignupRepeatPassword);

mobileSignupForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (mobileSignupPassword?.value !== mobileSignupRepeatPassword?.value) {
    showToast('Las contraseñas no coinciden');
    return;
  }

  showToast('Crear cuenta listo para conectar');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileSignupSheet?.classList.contains('open')) {
    closeMobileSignupSheet();
  }
});
