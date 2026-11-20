// Google Analytics 4: load gtag on the production host only.
(() => {
  const ID = "G-5D8EGGCJ8K";
  const host = location.hostname;
  if (host !== "autogive.app" && host !== "www.autogive.app") return;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", ID);
})();
