(function () {
  'use strict';

  var WA_NUMBER = '5519982651179';

  function waLink(message) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
  }

  // Inicializa todos os links do WhatsApp com data-msg
  document.querySelectorAll('a[data-msg]').forEach(function (link) {
    link.href = waLink(link.dataset.msg);
  });

  // Seletor "O que entupiu?" no topo: atualiza mensagem no Hero e na barra mobile
  var heroWa = document.getElementById('hero-wa');
  var heroNote = document.getElementById('hero-note');
  var mobileWa = document.querySelector('.mobile-bar a[data-track="whatsapp"]');
  var chips = document.querySelectorAll('.chip');
  var defaultHeroMsg = heroWa && heroWa.dataset.msg ? heroWa.dataset.msg : 'Olá! Gostaria de solicitar um orçamento.';
  var defaultMobileMsg = mobileWa && mobileWa.dataset.msg ? mobileWa.dataset.msg : defaultHeroMsg;
  var defaultNoteText = heroNote ? heroNote.textContent : '';

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var isPressed = chip.getAttribute('aria-pressed') === 'true';

      if (isPressed) {
        // Desmarca o chip selecionado
        chip.setAttribute('aria-pressed', 'false');
        if (heroWa) heroWa.href = waLink(defaultHeroMsg);
        if (mobileWa) mobileWa.href = waLink(defaultMobileMsg);
        if (heroNote) heroNote.textContent = defaultNoteText;
        return;
      }

      chips.forEach(function (other) { other.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');

      var targetMsg = chip.dataset.msg;
      if (heroWa) heroWa.href = waLink(targetMsg);
      if (mobileWa) mobileWa.href = waLink(targetMsg);
      if (heroNote) heroNote.textContent = 'O WhatsApp vai abrir com a mensagem: ' + chip.dataset.label + '.';
    });
  });

  // Menu mobile com fechamento por clique fora, link e tecla Escape
  var menuToggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');

  if (menuToggle && menu) {
    function setMenu(open) {
      menu.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menuToggle.textContent = open ? '✕' : '☰';
    }

    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    // Fecha o menu ao clicar fora
    document.addEventListener('click', function (event) {
      if (menu.classList.contains('is-open') && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenu(false);
      }
    });

    // Fecha o menu ao pressionar a tecla Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  // FAQ: abre uma pergunta por vez (suporte a navegadores sem suporte nativo a name="faq")
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) {
          other.removeAttribute('open');
        }
      });
    });
  });
})();
