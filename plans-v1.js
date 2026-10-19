/* Local plans view (no checkout is performed) */
(() => {
  const panel = document.querySelector('.panel-page');
  const page = document.getElementById('vcPlansView');
  const openLink = document.getElementById('panelPlansButton');
  const activateLink = document.querySelector('.activate-plan-button');
  const plansMenuToggle = document.getElementById('vcPlansMenuToggle');
  const drawer = document.getElementById('panelSideDrawer');
  const drawerBackdrop = document.getElementById('panelDrawerBackdrop');
  const homeLink = document.getElementById('panelHomeButton');
  const sideNav = drawer?.querySelector('.panel-side-nav');
  const cycleTrigger = document.getElementById('vcPlansPeriodTrigger');
  const cycleText = document.getElementById('vcPlansPeriodText');
  const cycleMenu = document.getElementById('vcPlansPeriodMenu');
  const options = Array.from(document.querySelectorAll('.vc-plans-option'));
  const planRadios = Array.from(document.querySelectorAll('input[name="vcPlanChoice"]'));
  const cards = Array.from(document.querySelectorAll('.vc-plan[data-plan]'));
  const cta = document.getElementById('vcPlansContinue');
  const message = document.getElementById('vcPlansMessage');
  const fixedFooter = document.getElementById('vcPlansFooter');
  if (!panel || !page || !openLink || !plansMenuToggle || !drawer || !drawerBackdrop || !cycleTrigger || !cycleMenu || !cta) return;

  // Descuentos moderados: priorizan sostenibilidad con servidores de capacidad limitada.
  const plans = {
    standard: {name:'Standard', monthly:199, discounts:{monthly:0, sixMonths:.03, yearly:.06}},
    gold: {name:'Gold', monthly:499, discounts:{monthly:0, sixMonths:.05, yearly:.09}},
    premium: {name:'Premium', monthly:899, discounts:{monthly:0, sixMonths:.07, yearly:.12}}
  };
  const cycles = {
    monthly:{months:1,label:'Plan mensual',unit:'/mes',billing:'Facturado cada mes'},
    sixMonths:{months:6,label:'Plan de 6 meses',unit:'/6 meses',billing:'Facturado cada 6 meses'},
    yearly:{months:12,label:'Plan anual',unit:'/año',billing:'Facturado una vez al año'}
  };
  const formatRub = value => new Intl.NumberFormat('es-ES',{maximumFractionDigits:0}).format(value) + ' ₽';
  const monthlyEquivalent = value => new Intl.NumberFormat('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  let cycle = 'monthly';
  let selected = 'premium';
  let previousScroll = 0;
  // The drawer stays mounted inside .panel-page for both views.
  let openedByNavigation = false;

  function updateNavigationSelection(){
    const plansActive = document.body.classList.contains('vc-plans-open');
    const activeLink = plansActive ? openLink : homeLink;
    if (!homeLink || !sideNav) return;

    homeLink.classList.toggle('is-active', !plansActive);
    homeLink.classList.toggle('is-off', plansActive);
    openLink.classList.toggle('is-active', plansActive);
    openLink.classList.toggle('is-off', !plansActive);

    if (plansActive) {
      homeLink.removeAttribute('aria-current');
      openLink.setAttribute('aria-current', 'page');
    } else {
      openLink.removeAttribute('aria-current');
      homeLink.setAttribute('aria-current', 'page');
    }

    // Animate the same selection pill between Home and Plans.
    sideNav.style.setProperty('--vc-active-nav-y', activeLink.offsetTop + 'px');
    sideNav.style.setProperty('--vc-active-nav-height', activeLink.offsetHeight + 'px');
    sideNav.classList.add('vc-active-nav-ready');
  }

  function setPlansMenuChrome(){
    const open = drawer.classList.contains('is-open');
    plansMenuToggle.classList.toggle('is-open',open);
    plansMenuToggle.setAttribute('aria-expanded', String(open));
    plansMenuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    // Includes closing via Escape, backdrop and navigation from either view.
    if (!open) {
      page.classList.remove('vc-plans-drawer-cover');
      if (fixedFooter) fixedFooter.hidden = false;
    }
    updateNavigationSelection();
  }
  const drawerObserver = new MutationObserver(setPlansMenuChrome);
  drawerObserver.observe(drawer,{attributes:true,attributeFilter:['class']});



  function totalPrice(plan, cycleKey){
    const billing = cycles[cycleKey];
    return Math.round(plan.monthly * billing.months * (1 - plan.discounts[cycleKey]));
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
      const optionCycle = option.dataset.cycle;
      option.setAttribute('aria-selected', String(optionCycle === cycle));
      const savingLabel = option.querySelector('small');
      if (savingLabel) {
        savingLabel.textContent = optionCycle === 'monthly'
          ? 'Sin compromiso anual'
          : 'Ahorra ' + Math.round(plans[selected].discounts[optionCycle] * 100) + ' %';
      }
    });
    cards.forEach(card => {
      const plan = plans[card.dataset.plan];
      const total = totalPrice(plan,cycle);
      const saved = plan.monthly * billing.months - total;
      card.querySelector('.vc-plan-price').textContent = formatRub(total);
      card.querySelector('.vc-plan-unit').textContent = billing.unit;
      card.querySelector('.vc-plan-billing').textContent =
        billing.billing + (billing.months > 1 ? ' · ' + monthlyEquivalent(total/billing.months) + ' ₽/mes' : '');
      card.querySelector('.vc-plan-deal').hidden = billing.months === 1;
      card.querySelector('.vc-plan-discount').textContent = '-' + Math.round(plan.discounts[cycle] * 100) + '%';
      card.querySelector('.vc-plan-saving').textContent = 'Ahorras ' + formatRub(saved);
    });
    const choice = plans[selected];
    const amount = totalPrice(choice,cycle);
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
      updateNavigationSelection();
      window.scrollTo(0,0);
      render();
    } else {
      if (typeof setPanelDrawer === 'function') setPanelDrawer(false);
      closeMenu();
      page.hidden = true;
      document.body.classList.remove('vc-plans-open');
      updateNavigationSelection();
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
  openLink.addEventListener('click', () => {
    if (typeof setPanelDrawer === 'function') setPanelDrawer(false);
    openPlans();
  });
  activateLink?.addEventListener('click',openPlans);
  // Safari 26 can latch the toolbar tint from a fixed bottom element.
  // Remove our light checkout footer from layout *before* showing the drawer,
  // then restore it only after the overlay has closed.
  function setPlansDrawer(open){
    if (typeof setPanelDrawer !== 'function') return;
    if (open) {
      page.classList.add('vc-plans-drawer-cover');
      if (fixedFooter) {
        fixedFooter.hidden = true;
        // Force Safari to unregister the fixed bar before drawer painting.
        void fixedFooter.offsetHeight;
      }
    }
    setPanelDrawer(open);
    if (!open) {
      page.classList.remove('vc-plans-drawer-cover');
      if (fixedFooter) fixedFooter.hidden = false;
    }
    setPlansMenuChrome();
  }

  plansMenuToggle.addEventListener('click', () => {
    setPlansDrawer(!drawer.classList.contains('is-open'));
  });
  homeLink?.addEventListener('click', () => {
    if (document.body.classList.contains('vc-plans-open')) {
      history.replaceState(null,'',location.pathname + location.search);
      showPlansView(false);
    } else if (drawer.classList.contains('is-open') && typeof setPanelDrawer === 'function') {
      setPanelDrawer(false);
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
      else if (document.body.classList.contains('vc-plans-open') && !drawer.classList.contains('is-open')) {
        history.replaceState(null,'',location.pathname + location.search);
        showPlansView(false);
      }
    }
  });
  planRadios.forEach(radio => radio.addEventListener('change', () => {
    if (radio.checked) {selected = radio.value;render();}
  }));
  cta.addEventListener('click', () => {
    const billing = cycles[cycle];
    message.textContent = 'Has seleccionado ' + plans[selected].name + ' por ' +
      formatRub(totalPrice(plans[selected],cycle)) +
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


  // Footer shortcuts reuse the same expanded legal information rather than
  // linking to non-existent standalone Terms or Privacy documents.
  const legalDisclosure = document.getElementById('vcPlansLegal');
  page.querySelectorAll('[data-vc-plans-footer]').forEach(button => {
    button.addEventListener('click', () => {
      if (!legalDisclosure) return;
      legalDisclosure.open = true;
      const sections = [...legalDisclosure.querySelectorAll('.vc-plans-legal-section')];
      const type = button.dataset.vcPlansFooter;
      const target = type === 'help' ? sections[sections.length - 1] : sections[0];
      requestAnimationFrame(() => {
        if (type === 'terms' || type === 'privacy') {
          const pending = target?.querySelector('[data-vc-legal-link="pending"][data-vc-legal-label="' +
            (type === 'terms' ? 'Términos del servicio' : 'Política de privacidad') + '"]');
          pending?.click();
        }
        target?.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });
  });

  // Keep the links semantic and usable without inventing unpublished pages.
  // The destinations already present in the panel scroll to their actual cards.
  page.querySelectorAll('.vc-plans-legal-link').forEach(link => {
    link.addEventListener('click', event => {
      const destination = link.dataset.vcLegalLink;
      if (!destination) return;
      event.preventDefault();
      if (destination === 'pending') {
        let status = link.nextElementSibling;
        if (!status?.classList.contains('vc-plans-legal-unpublished')) {
          status = document.createElement('span');
          status.className = 'vc-plans-legal-unpublished';
          status.textContent = ' (documento pendiente de publicación)';
          link.insertAdjacentElement('afterend',status);
        }
        return;
      }
      if (destination === 'plans') {
        document.getElementById('vcPlansLegal').open = false;
        page.querySelector('.vc-plans-period')?.scrollIntoView({behavior:'smooth',block:'start'});
        return;
      }
      if (destination === 'home') {
        const sectionId = link.dataset.vcLegalTarget;
        if (!sectionId) return;
        history.replaceState(null,'',location.pathname + location.search);
        showPlansView(false);
        requestAnimationFrame(() => {
          document.getElementById(sectionId)?.scrollIntoView({behavior:'smooth',block:'center'});
        });
      }
    });
  });

  render();
  syncRoute();
  updateNavigationSelection();
  window.addEventListener('resize', updateNavigationSelection);
  document.fonts?.ready?.then(updateNavigationSelection);
})();
