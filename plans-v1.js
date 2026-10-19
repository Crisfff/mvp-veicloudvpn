/* Local plans view (no checkout is performed) */
(() => {
  const panel = document.querySelector('.panel-page');
  const page = document.getElementById('vcPlansView');
  const openLink = document.getElementById('panelPlansButton');
  const activateLink = document.querySelector('.activate-plan-button');
  const back = document.getElementById('vcPlansBack');
  const cycleTrigger = document.getElementById('vcPlansPeriodTrigger');
  const cycleText = document.getElementById('vcPlansPeriodText');
  const cycleMenu = document.getElementById('vcPlansPeriodMenu');
  const options = Array.from(document.querySelectorAll('.vc-plans-option'));
  const planRadios = Array.from(document.querySelectorAll('input[name="vcPlanChoice"]'));
  const cards = Array.from(document.querySelectorAll('.vc-plan[data-plan]'));
  const cta = document.getElementById('vcPlansContinue');
  const message = document.getElementById('vcPlansMessage');
  const fixedFooter = document.getElementById('vcPlansFooter');
  if (!panel || !page || !openLink || !back || !cycleTrigger || !cycleMenu || !cta) return;

  const plans = {
    standard: {name:'Standard', monthly:199},
    gold: {name:'Gold', monthly:499},
    premium: {name:'Premium', monthly:899}
  };
  const cycles = {
    monthly:{months:1,discount:0,label:'Plan mensual',unit:'/mes',billing:'Facturado cada mes'},
    yearly:{months:12,discount:.08,label:'Plan anual',unit:'/año',billing:'Facturado una vez al año'},
    twoYears:{months:24,discount:.20,label:'Plan de 2 años',unit:'/2 años',billing:'Facturado una vez cada 2 años'}
  };
  const formatRub = value => new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(value) + ' ₽';
  const monthlyEquivalent = value => new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  let cycle = 'monthly';
  let selected = 'premium';
  let previousScroll = 0;
  let openedByNavigation = false;

  function totalPrice(monthly, billing){
    return Math.round(monthly * billing.months * (1-billing.discount));
  }

  function closeMenu(){
    cycleMenu.hidden = true;
    cycleTrigger.setAttribute('aria-expanded','false');
    cycleTrigger.querySelector('iconify-icon')?.setAttribute('icon','lucide:chevron-down');
  }
  function render(){
    const billing = cycles[cycle];
    cycleText.textContent = billing.label;
    options.forEach(option => {
      option.setAttribute('aria-selected', String(option.dataset.cycle === cycle));
    });
    cards.forEach(card => {
      const plan = plans[card.dataset.plan];
      const total = totalPrice(plan.monthly,billing);
      const saved = plan.monthly * billing.months - total;
      card.querySelector('.vc-plan-price').textContent = formatRub(total);
      card.querySelector('.vc-plan-unit').textContent = billing.unit;
      card.querySelector('.vc-plan-billing').textContent =
        billing.billing + (billing.months > 1 ? ' · ' + monthlyEquivalent(total/billing.months) + ' ₽/mes' : '');
      card.querySelector('.vc-plan-deal').hidden = billing.months === 1;
      card.querySelector('.vc-plan-discount').textContent = '-' + Math.round(billing.discount * 100) + '%';
      card.querySelector('.vc-plan-saving').textContent = 'Ahorras ' + formatRub(saved);
    });
    const choice = plans[selected];
    const amount = totalPrice(choice.monthly,billing);
    cta.querySelector('.vc-plans-cta-label').textContent = 'Elegir ' + choice.name + ' · ' + formatRub(amount);
    message.hidden = true;
  }
  function showPlansView(open){
    if (open === document.body.classList.contains('vc-plans-open')) return;
    if (open) {
      previousScroll = window.scrollY;
      if (typeof setPanelDrawer === 'function') setPanelDrawer(false);
      page.hidden = false;
      document.body.classList.add('vc-plans-open');
      panel.setAttribute('aria-hidden','true');
      window.scrollTo(0,0);
      render();
    } else {
      closeMenu();
      page.hidden = true;
      document.body.classList.remove('vc-plans-open');
      panel.removeAttribute('aria-hidden');
      window.scrollTo(0,previousScroll);
      openedByNavigation = false;
    }
  }
  function syncRoute(){
    showPlansView(location.hash === '#planes');
  }

  function openPlans(){
    if (location.hash !== '#planes') {
      openedByNavigation = true;
      history.pushState({vcPlans:true}, '', location.pathname + location.search + '#planes');
    }
    showPlansView(true);
  }
  openLink.addEventListener('click',openPlans);
  activateLink?.addEventListener('click',openPlans);
  back.addEventListener('click', () => {
    if (openedByNavigation && location.hash === '#planes') {
      history.back();
    } else {
      history.replaceState(null,'',location.pathname + location.search);
      showPlansView(false);
    }
  });
  window.addEventListener('popstate',syncRoute);
  window.addEventListener('hashchange',syncRoute);

  cycleTrigger.addEventListener('click', () => {
    cycleMenu.hidden = !cycleMenu.hidden;
    const isOpen = !cycleMenu.hidden;
    cycleTrigger.setAttribute('aria-expanded',String(isOpen));
    cycleTrigger.querySelector('iconify-icon')?.setAttribute('icon',isOpen ? 'lucide:chevron-up':'lucide:chevron-down');
  });
  options.forEach(option => option.addEventListener('click', () => {
    cycle = option.dataset.cycle;
    closeMenu();
    render();
    cycleTrigger.focus();
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.vc-plans-period')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!cycleMenu.hidden) { closeMenu(); cycleTrigger.focus(); }
      else if (document.body.classList.contains('vc-plans-open')) back.click();
    }
  });
  planRadios.forEach(radio => radio.addEventListener('change', () => {
    if (radio.checked) {selected = radio.value;render();}
  }));
  cta.addEventListener('click', () => {
    const billing = cycles[cycle];
    message.textContent = 'Has seleccionado ' + plans[selected].name + ' por ' +
      formatRub(totalPrice(plans[selected].monthly,billing)) +
      '. La contratación estará disponible cuando se conecte la pasarela de pago.';
    message.hidden = false;
  });
  // Reserve the actual height of the fixed action bar in the normal scroll flow.
  // The Premium card and disclaimer must never be hidden behind it.
  if (fixedFooter && typeof ResizeObserver !== 'undefined') {
    const footerObserver = new ResizeObserver(entries => {
      const height = entries[0]?.borderBoxSize?.[0]?.blockSize ||
        fixedFooter.getBoundingClientRect().height;
      if (height > 0) {
        page.style.setProperty('--vc-plans-footer-height', Math.ceil(height) + 'px');
      }
    });
    footerObserver.observe(fixedFooter);
  }
  render();
  syncRoute();
})();
