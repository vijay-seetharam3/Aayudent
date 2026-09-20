(function () {
  "use strict";

  const products = {
    "bamboo-toothbrush": {
      id: "bamboo-toothbrush",
      name: "Bamboo Toothbrush",
      subtitle: "Charcoal-infused soft bristles",
      mrp: 20,
      price: 16,
      moq: 100,
      step: 100,
      tiers: [
        { min: 100, price: 16, label: "100 – 499 pcs" },
        { min: 500, price: 14, label: "500 – 999 pcs" },
        { min: 1000, price: 12, label: "1,000 – 4,999 pcs" },
        { min: 5000, price: 10, label: "5,000+ pcs" },
      ],
      image: "assets/brush-angled.png",
    },
    "bamboo-tongue-cleaner": {
      id: "bamboo-tongue-cleaner",
      name: "Bamboo Tongue Cleaner",
      subtitle: "Smooth bamboo scraper",
      mrp: 25,
      price: 20,
      moq: 100,
      step: 100,
      tiers: [
        { min: 100, price: 20, label: "100 – 499 pcs" },
        { min: 500, price: 18, label: "500 – 999 pcs" },
        { min: 1000, price: 16, label: "1,000 – 4,999 pcs" },
        { min: 5000, price: 14, label: "5,000+ pcs" },
      ],
      image: "assets/tongue-cleaner.png",
    },
  };

  const rupees = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  function unitPrice(id, qty) {
    const p = products[id];
    if (!p) return 0;
    const tier = [...p.tiers].reverse().find((t) => qty >= t.min);
    return (tier ?? p.tiers[0]).price;
  }

  function tierLabel(id, qty) {
    const p = products[id];
    if (!p) return "";
    const tier = [...p.tiers].reverse().find((t) => qty >= t.min);
    return (tier ?? p.tiers[0]).label || "";
  }

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("open", !expanded);
      menuToggle.classList.toggle("is-active", !expanded);
    });
    document.querySelectorAll("#mobileMenu a").forEach((a) => {
      a.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("open");
        menuToggle.classList.remove("is-active");
      });
    });
  }

  // Reveal animations
  function initReveals() {
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach((el) => el.setAttribute("data-visible", "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute("data-visible", "true");
        io.unobserve(entry.target);
      }
    });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }
  initReveals();

  // 3D tilt hero image — follows the cursor anywhere on the page
  const heroBrush = document.getElementById("heroBrush");
  if (heroBrush && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroBrush.style.willChange = "transform";
    heroBrush.style.transformStyle = "preserve-3d";
    const holder = heroBrush.parentElement;
    if (holder) holder.style.perspective = "1200px";

    let rx = 0, ry = 0, targetX = 0, targetY = 0;
    window.addEventListener(
      "pointermove",
      (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        targetY = ((e.clientX - cx) / cx) * 16;
        targetX = ((e.clientY - cy) / cy) * -12;
      },
      { passive: true }
    );
    const tiltLoop = () => {
      rx += (targetX - rx) * 0.07;
      ry += (targetY - ry) * 0.07;
      heroBrush.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${(ry * 0.35).toFixed(2)}deg)`;
      requestAnimationFrame(tiltLoop);
    };
    requestAnimationFrame(tiltLoop);
  }

  // Ambient glow
  const glow = document.getElementById("ambientGlow");
  if (glow) {
    document.addEventListener("mousemove", (e) => {
      glow.style.background = `radial-gradient(700px 500px at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.12), transparent 60%)`;
    });
  }

  // Parallax
  const parallax = document.querySelector(".hero-parallax-bg");
  if (parallax) {
    window.addEventListener("scroll", () => {
      parallax.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    });
  }

  // Counters
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10);
    if (Number.isNaN(target)) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const duration = 1200;
      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) start();
      }, { threshold: 0.5 });
      io.observe(el);
    } else {
      start();
    }
  });

  // Ripple effect
  document.querySelectorAll(".ripple-host").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = e.clientX - rect.left + "px";
      ripple.style.top = e.clientY - rect.top + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Quantity steppers + live slab price preview on index page
  document.querySelectorAll(".product-card").forEach((card) => {
    const id = card.getAttribute("data-product-id");
    if (!id || !products[id]) return;
    const qtyInput = card.querySelector(".qty-input");
    if (!qtyInput) return;

    card.querySelectorAll(".qty-stepper").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = products[id];
        const step = parseInt(btn.getAttribute("data-step"), 10) || p.step;
        let v = parseInt(qtyInput.value, 10) || p.moq;
        v = Math.max(p.moq, v + step);
        v = Math.round(v / p.step) * p.step;
        qtyInput.value = v;
        updatePricePreview(card, id, v);
      });
    });

    qtyInput.addEventListener("change", () => {
      const p = products[id];
      let v = parseInt(qtyInput.value, 10) || p.moq;
      v = Math.max(p.moq, Math.round(v / p.step) * p.step);
      qtyInput.value = v;
      updatePricePreview(card, id, v);
    });
  });

  function updatePricePreview(card, id, qty) {
    const up = unitPrice(id, qty);
    const total = up * qty;
    const totalEl = card.querySelector(".price-total");
    const perEl = card.querySelector(".price-per-piece");
    if (totalEl) totalEl.innerHTML = `${rupees(total)}<span class="price-per-piece">total · ${rupees(up)} / pc</span>`;
    if (perEl && totalEl) {
      const span = totalEl.querySelector("span");
      if (span) span.textContent = `total · ${rupees(up)} / pc`;
    }
    const tierNote = card.querySelector(".tier-note");
    if (tierNote) {
      tierNote.textContent = tierLabel(id, qty) ? `Slab: ${tierLabel(id, qty)}` : "";
    }
  }

  // (cart and checkout removed — product CTAs go to the quote page)

    // Bulk quote form
  const bulkForm = document.getElementById("bulkForm");

  if (bulkForm) {

    // Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbwmSDoWXCOvlR8t2077L7DxuaXVdCqavEXES3MIlReDgFT2IezlzcUUvLr3ea8qNiY/exec";

    function bulkShow(id, msg) {
      const el = document.getElementById(id + "Error");
      const input = document.getElementById(id);

      if (el) el.textContent = msg;
      if (input) input.classList.add("error");
    }

    function bulkClear(id) {
      const el = document.getElementById(id + "Error");
      const input = document.getElementById(id);

      if (el) el.textContent = "";
      if (input) input.classList.remove("error");
    }

    bulkForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let ok = true;

      const name = document
        .getElementById("bulkName")
        .value
        .trim();

      if (name.length < 2) {
        bulkShow("bulkName", "Please enter your full name.");
        ok = false;
      } else {
        bulkClear("bulkName");
      }

      const email = document
        .getElementById("bulkEmailInput")
        .value
        .trim();



      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        bulkShow("bulkEmail", "Please enter a valid email.");
        ok = false;
      } else {
        bulkClear("bulkEmail");
      }

      const product = document
        .getElementById("bulkProduct")
        .value
        .trim();

      if (!product) {
        bulkShow("bulkProduct", "Please enter a product or category.");
        ok = false;
      } else {
        bulkClear("bulkProduct");
      }

      const qty = document
        .getElementById("bulkQty")
        .value
        .trim();

      if (!/^\d+$/.test(qty) || parseInt(qty, 10) < 1) {
        bulkShow("bulkQty", "Please enter a valid quantity.");
        ok = false;
      } else {
        bulkClear("bulkQty");
      }

      if (!ok) return;

      const notesElement = document.getElementById("bulkPackaging");
      const notes = notesElement
        ? notesElement.value.trim()
        : "";

      const submitButton = bulkForm.querySelector(
        'button[type="submit"]'
      );

      const originalText = submitButton.textContent;

      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {

        const formData = new URLSearchParams();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("product", product);
        formData.append("quantity", qty);
        formData.append("notes", notes);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: formData
        });

        // Hide form
        bulkForm.style.display = "none";

        // Show success message
        const success = document.getElementById("bulkSuccess");

        if (success) {
          success.style.display = "block";
        }

        document.getElementById("bulkFirstName").textContent =
          name.split(" ")[0] || "there";

        document.getElementById("bulkEmail").textContent =
          email;

      } catch (error) {

        console.error("Quote submission failed:", error);

        submitButton.disabled = false;
        submitButton.textContent = originalText;

        alert(
          "We couldn't send your request right now. Please try again or contact us on WhatsApp."
        );
      }
    });

    [
      "bulkName",
      "bulkEmailInput",
      "bulkProduct",
      "bulkQty",
      "bulkPackaging"
    ].forEach((id) => {

      const el = document.getElementById(id);

      if (el) {
        el.addEventListener("input", () => {
          bulkClear(id.replace("Input", ""));
        });
      }

    });
  }

  // FAQ accordion
function toggleFaq(button) {
  const item = button.closest(".faq-item");
  if (!item) return;

  const isOpen = item.classList.contains("open");

  document.querySelectorAll(".faq-item").forEach((faq) => {
    faq.classList.remove("open");

    const faqButton = faq.querySelector(".faq-question");
    if (faqButton) {
      faqButton.setAttribute("aria-expanded", "false");
    }
  });

  if (!isOpen) {
    item.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  }
}

// Make it available to onclick="toggleFaq(this)" in the HTML
window.toggleFaq = toggleFaq;
})();