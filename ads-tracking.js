(function () {
  "use strict";

  const phoneConversion = "AW-18498129474/MI-RCNq9iJ4dEMKczPRE";
  const phoneNumber = "+5519982651179";
  const whatsappNumber = "5519982651179";

  function contactMethod(link) {
    const trackedMethod = link.getAttribute("data-track");
    if (trackedMethod === "call" || trackedMethod === "whatsapp") return trackedMethod;

    try {
      const url = new URL(link.href, document.baseURI);
      if (url.protocol === "tel:" && url.pathname.replace(/[\s().-]/g, "") === phoneNumber) return "call";
      if (url.protocol === "https:" && url.host === "wa.me" && !url.username && !url.password && url.pathname.replace(/\/$/, "") === "/" + whatsappNumber) return "whatsapp";
    } catch (_error) {
      // Um link inválido não deve interferir na interação.
    }

    return null;
  }

  function trackContact(eventName, eventParams) {
    try {
      if (typeof window.gtag !== "function") return;
      window.gtag("event", eventName, {
        ...eventParams,
        transport_type: "beacon"
      });
    } catch (_error) {
      // A navegação continua mesmo se a tag estiver indisponível.
    }
  }

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target;
    const link = target instanceof Element ? target.closest("a[href]") : null;
    if (!link) return;

    const method = contactMethod(link);
    if (method === "call") {
      trackContact("conversion", {
        send_to: phoneConversion,
        value: 1.0,
        currency: "BRL"
      });
      return;
    }

    if (method === "whatsapp") {
      trackContact("whatsapp_click", {
        contact_method: "whatsapp"
      });
    }
  });
})();
