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

  // A escolha acompanha os botões gerais; cada serviço mantém sua própria mensagem.
  var quoteLinks = document.querySelectorAll('a[data-use-selection]');
  var pickerNote = document.getElementById('picker-note');
  var chips = document.querySelectorAll('.chip');
  var defaultNoteText = pickerNote ? pickerNote.textContent : '';

  function updateQuoteLinks(message) {
    quoteLinks.forEach(function (link) {
      link.href = waLink(message || link.dataset.msg);
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var isPressed = chip.getAttribute('aria-pressed') === 'true';

      if (isPressed) {
        // Desmarca o chip selecionado
        chip.setAttribute('aria-pressed', 'false');
        updateQuoteLinks();
        if (pickerNote) pickerNote.textContent = defaultNoteText;
        return;
      }

      chips.forEach(function (other) { other.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');

      updateQuoteLinks(chip.dataset.msg);
      if (pickerNote) pickerNote.textContent = 'Selecionado: ' + chip.dataset.label + '. Sua mensagem está pronta. Toque no botão do WhatsApp para continuar.';
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
      var open = menuToggle.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) menu.querySelector('a').focus();
    });

    // Ao entrar no layout desktop, limpa o estado do menu mobile.
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
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

    // Mantém o menu fechado quando a navegação por teclado segue para a página.
    document.addEventListener('focusin', function (event) {
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
