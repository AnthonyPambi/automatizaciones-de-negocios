(function () {
  "use strict";

  var WA_NUMBER = "593980445005";

  // ---------- Mobile nav ----------
  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    Array.prototype.forEach.call(siteNav.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- Footer year ----------
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // ---------- Demo chat (solo Inicio) ----------
  var chatBody = document.getElementById("chatBody");
  var typingRow = document.getElementById("typingRow");

  if (chatBody && typingRow) {
    var timers = [];

    var SCRIPTS = {
      cita: [
        { from: "user", text: "Quiero agendar una cita" },
        { from: "bot", text: "¡Con gusto! Tengo estos espacios para mañana: 10:00, 14:30 y 17:00. ¿Cuál te sirve?" },
        { from: "user", text: "14:30" },
        { from: "bot", text: "Listo ✅ Cita confirmada mañana 14:30. Ya quedó en el Google Calendar del negocio y te envío un recordatorio 1 hora antes." }
      ],
      precio: [
        { from: "user", text: "¿Cuánto cuesta el servicio?" },
        { from: "bot", text: "Depende de lo que quieras automatizar. Cuéntame: ¿cuántos mensajes recibes al día y qué te toma más tiempo responder?" },
        { from: "user", text: "Unos 60 al día, casi todos preguntan precios y disponibilidad" },
        { from: "bot", text: "Perfecto, eso se automatiza casi por completo. Te paso una cotización personalizada hoy mismo — ¿te escribo por aquí?" }
      ],
      horario: [
        { from: "user", text: "¿Están abiertos ahora?" },
        { from: "bot", text: "Sí, atendemos hasta las 19:00. También puedo tomar tu pedido ahora y dejarlo agendado para mañana temprano." }
      ]
    };

    function clearTimers() {
      timers.forEach(function (t) { clearTimeout(t); });
      timers = [];
    }

    function clearMessages() {
      Array.prototype.forEach.call(chatBody.querySelectorAll(".chat-row"), function (row) {
        row.remove();
      });
    }

    function showTyping(on) {
      typingRow.classList.toggle("is-visible", !!on);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addBubble(msg) {
      var row = document.createElement("div");
      row.className = "chat-row from-" + msg.from;
      var bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = msg.text;
      row.appendChild(bubble);
      chatBody.insertBefore(row, typingRow);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function play(key) {
      var seq = SCRIPTS[key];
      if (!seq) return;
      clearTimers();
      clearMessages();
      showTyping(false);
      var delay = 0;
      seq.forEach(function (msg) {
        if (msg.from === "bot") {
          delay += 500;
          timers.push(setTimeout(function () { showTyping(true); }, delay));
          delay += 900;
          timers.push(setTimeout(function () { showTyping(false); addBubble(msg); }, delay));
        } else {
          delay += 350;
          timers.push(setTimeout(function () { addBubble(msg); }, delay));
        }
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-play]"), function (btn) {
      btn.addEventListener("click", function () { play(btn.getAttribute("data-play")); });
    });

    var resetBtn = document.getElementById("chatReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        clearTimers();
        clearMessages();
        showTyping(false);
      });
    }
  }

  // ---------- Formulario de contacto (solo Contacto) ----------
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = (document.getElementById("fNombre").value || "").trim();
      var telefono = (document.getElementById("fTelefono").value || "").trim();
      var tipo = document.getElementById("fTipo").value;
      var mensaje = (document.getElementById("fMensaje").value || "").trim();

      var texto = "Hola, soy " + (nombre || "—") + ".\n" +
        "Negocio: " + tipo + "\n" +
        "WhatsApp: " + (telefono || "—") + "\n" +
        "Quiero automatizar: " + (mensaje || "—");

      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    });
  }
})();
