(function () {
  "use strict";

  const phoneConversion = "AW-18498129474/MI-RCNq9iJ4dEMKczPRE";
  const navigationTimeout = 1600;

  function trackBeforeNavigation(link, eventName, eventParams) {
    let navigated = false;

    function navigate() {
      if (navigated) return;
      navigated = true;
      window.location.assign(link.href);
    }

    window.gtag("event", eventName, {
      ...eventParams,
      event_callback: navigate,
      event_timeout: navigationTimeout
    });

    window.setTimeout(navigate, navigationTimeout + 100);
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target;
    const link = target instanceof Element ? target.closest('a[href^="tel:"], a[href*="wa.me/"]') : null;
    if (!link || typeof window.gtag !== "function") return;

    event.preventDefault();

    if (link.matches('a[href^="tel:"]')) {
      trackBeforeNavigation(link, "conversion", {
        send_to: phoneConversion,
        value: 1.0,
        currency: "BRL"
      });
      return;
    }

    trackBeforeNavigation(link, "whatsapp_click", {
      contact_method: "whatsapp"
    });
  });
})();
