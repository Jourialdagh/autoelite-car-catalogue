/* ============================================
   main.js - AutoElite Car Catalogue
   Main JavaScript file for all site functionality
   ============================================ */

// ---- THEME SWITCHER ----
/**
 * Applies a CSS theme by swapping the main stylesheet link.
 * Saves preference to localStorage.
 * @param {number} themeNum - Theme number (1, 2, or 3)
 */
function applyTheme(themeNum) {
  // Swap only the CSS variables theme file; styles.css always stays loaded
  let themeLink = document.getElementById('theme-link');
  if (!themeLink) {
    themeLink = document.createElement('link');
    themeLink.rel = 'stylesheet';
    themeLink.id = 'theme-link';
    document.head.appendChild(themeLink);
  }
  // Detect if we're in the wiki subfolder
  const isWiki = window.location.pathname.includes('/wiki/');
  const prefix = isWiki ? '../css/' : 'css/';
  themeLink.href = `${prefix}theme${themeNum}.css`;
  localStorage.setItem('autoelite-theme', themeNum);
}

/**
 * Load saved theme on page load
 */
function loadSavedTheme() {
  const saved = localStorage.getItem('autoelite-theme') || 1;
  const themeLink = document.getElementById('theme-link');
  if (themeLink) {
    const isWiki = window.location.pathname.includes('/wiki/');
    const prefix = isWiki ? '../css/' : 'css/';
    themeLink.href = `${prefix}theme${saved}.css`;
  }
}

// ---- MOBILE MENU ----
/**
 * Toggle mobile navigation menu
 */
function toggleMenu() {
  const navUl = document.querySelector('nav ul');
  if (navUl) navUl.classList.toggle('open');
}

// ---- TOAST NOTIFICATIONS ----
/**
 * Show a toast notification message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 3000)
 */
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- PRODUCT FILTERING ----
/**
 * Filter product cards based on search, brand, and type inputs
 */
function filterProducts() {
  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();
  const brandVal = (document.getElementById('brand-filter')?.value || '').toLowerCase();
  const typeVal = (document.getElementById('type-filter')?.value || '').toLowerCase();
  const priceVal = parseInt(document.getElementById('price-filter')?.value || '0');

  const cards = document.querySelectorAll('.product-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const brand = (card.dataset.brand || '').toLowerCase();
    const type = (card.dataset.type || '').toLowerCase();
    const price = parseInt(card.dataset.price || '0');

    const matchSearch = !searchVal || name.includes(searchVal) || brand.includes(searchVal);
    const matchBrand = !brandVal || brand === brandVal;
    const matchType = !typeVal || type === typeVal;
    const matchPrice = !priceVal || price <= priceVal;

    if (matchSearch && matchBrand && matchType && matchPrice) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update count display if present
  const countEl = document.getElementById('result-count');
  if (countEl) countEl.textContent = `${visibleCount} vehicle${visibleCount !== 1 ? 's' : ''} found`;
}

// ---- QUOTE CALCULATOR FORM ----
/**
 * Calculate car purchase quote based on form inputs
 * Used on the quote.html page
 */
function calculateQuote(event) {
  event.preventDefault();

  const basePrice = parseInt(document.getElementById('q-car')?.value || '0');
  const engine = document.getElementById('q-engine')?.value;
  const color = document.getElementById('q-color')?.value;
  const warranty = document.getElementById('q-warranty')?.value;
  const insurance = document.getElementById('q-insurance')?.value === 'yes';
  const financing = document.getElementById('q-financing')?.value;
  const tradeIn = parseFloat(document.getElementById('q-tradein')?.value || '0');

  // Price calculation logic
  let total = basePrice;
  const breakdown = [];

  breakdown.push({ item: 'Base Vehicle Price', amount: basePrice });

  // Engine upgrade costs
  const engineCosts = { standard: 0, turbo: 3500, hybrid: 6000, electric: 12000, v8: 8000 };
  const engineCost = engineCosts[engine] || 0;
  if (engineCost > 0) {
    total += engineCost;
    breakdown.push({ item: `Engine Upgrade (${engine})`, amount: engineCost });
  }

  // Color premium
  const colorCosts = { standard: 0, metallic: 600, pearl: 900, matte: 1200 };
  const colorCost = colorCosts[color] || 0;
  if (colorCost > 0) {
    total += colorCost;
    breakdown.push({ item: `Color Premium (${color})`, amount: colorCost });
  }

  // Warranty
  const warrantyCosts = { basic: 0, extended3: 1500, extended5: 2800, lifetime: 5500 };
  const warrantyCost = warrantyCosts[warranty] || 0;
  if (warrantyCost > 0) {
    total += warrantyCost;
    breakdown.push({ item: `Warranty (${warranty})`, amount: warrantyCost });
  }

  // Insurance
  if (insurance) {
    const insAmt = Math.round(total * 0.03);
    total += insAmt;
    breakdown.push({ item: 'Insurance Package (3%)', amount: insAmt });
  }

  // Trade-in deduction
  if (tradeIn > 0) {
    total -= tradeIn;
    breakdown.push({ item: 'Trade-In Value', amount: -tradeIn });
  }

  // Tax (13%)
  const tax = Math.round(total * 0.13);
  total += tax;
  breakdown.push({ item: 'Tax (13%)', amount: tax });

  // Financing calculation
  let monthlyPayment = 0;
  if (financing !== 'cash') {
    const months = { m24: 24, m36: 36, m48: 48, m60: 60, m72: 72 }[financing] || 0;
    const rate = 0.049 / 12; // 4.9% APR
    if (months > 0) {
      monthlyPayment = Math.round((total * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1));
    }
  }

  // Build result HTML
  let breakdownHTML = breakdown.map(b =>
    `<tr>
      <td>${b.item}</td>
      <td style="text-align:right;color:${b.amount < 0 ? '#2ecc71' : 'var(--text)'}">${b.amount < 0 ? '-' : '+'}$${Math.abs(b.amount).toLocaleString()}</td>
    </tr>`
  ).join('');

  const resultBox = document.getElementById('quote-result');
  if (resultBox) {
    resultBox.innerHTML = `
      <h3 style="color:var(--primary);font-family:var(--font-heading);margin-bottom:15px;">Your Quote Summary</h3>
      <table class="specs-table">
        <tbody>${breakdownHTML}</tbody>
        <tfoot>
          <tr style="border-top:2px solid var(--primary)">
            <td style="font-weight:700;color:var(--text)">Total Price</td>
            <td style="text-align:right;font-weight:700;font-size:1.3rem;color:var(--primary)">$${total.toLocaleString()}</td>
          </tr>
          ${monthlyPayment > 0 ? `<tr><td style="color:var(--text-muted)">Monthly Payment</td><td style="text-align:right;color:var(--text-muted)">$${monthlyPayment.toLocaleString()}/mo</td></tr>` : ''}
        </tfoot>
      </table>
      <div style="margin-top:15px;padding:10px;background:rgba(201,168,76,0.1);border-radius:8px;font-size:0.85rem;color:var(--text-muted)">
        * This is an estimate only. Final pricing may vary. Contact our sales team for exact quotes.
      </div>
    `;
    resultBox.classList.add('show');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  showToast('Quote calculated successfully!');
}

// ---- CONTACT FORM ----
/**
 * Handle contact form submission
 * @param {Event} event
 */
function handleContact(event) {
  event.preventDefault();
  const name = document.getElementById('c-name')?.value;
  showToast(`Thank you, ${name}! We'll be in touch soon.`);
  event.target.reset();
}

// ---- COMPARE CARS ----
let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

/**
 * Add or remove a car from comparison list
 * @param {string} carId
 * @param {string} carName
 */
function toggleCompare(carId, carName) {
  const idx = compareList.indexOf(carId);
  if (idx === -1) {
    if (compareList.length >= 3) {
      showToast('You can compare up to 3 vehicles at a time.');
      return;
    }
    compareList.push(carId);
    showToast(`${carName} added to compare.`);
  } else {
    compareList.splice(idx, 1);
    showToast(`${carName} removed from compare.`);
  }
  localStorage.setItem('compareList', JSON.stringify(compareList));
  updateCompareBar();
}

/**
 * Update the compare bar count
 */
function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  if (bar) {
    bar.textContent = `Compare (${compareList.length})`;
    bar.style.display = compareList.length > 0 ? 'inline-block' : 'none';
  }
}

// ---- SEARCH SUGGESTIONS (JSON-powered) ----
/**
 * Load car data from JSON and show suggestions
 */
async function initSearch() {
  try {
    const res = await fetch('json/cars.json');
    const data = await res.json();
    window.allCars = data.cars || [];
  } catch (e) {
    console.warn('Could not load cars.json:', e);
  }
}

// ---- WEATHER API (OpenWeatherMap) ----
/**
 * Fetch current weather for a given city using OpenWeatherMap API
 * Displays weather in the #weather-widget element
 * @param {string} city - City name
 */
async function fetchWeather(city = 'Toronto') {
  const API_KEY = 'demo_key_replace_with_real'; // Replace with real API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const widget = document.getElementById('weather-widget');
  if (!widget) return;

  widget.innerHTML = '<div class="spinner"></div>';

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API request failed');
    const data = await res.json();

    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    widget.innerHTML = `
      <div class="weather-widget">
        <h4 style="color:var(--primary);margin-bottom:10px;">🌍 Current Weather in ${data.name}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" style="width:60px">
        <div class="temp">${temp}°C</div>
        <div style="color:var(--text-muted);text-transform:capitalize">${desc}</div>
        <div style="color:var(--text-muted);font-size:0.85rem;margin-top:8px">
          💧 Humidity: ${humidity}% &nbsp;|&nbsp; 💨 Wind: ${windSpeed} m/s
        </div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:10px">
          Plan your test drive — check outdoor conditions!
        </p>
      </div>
    `;
  } catch (err) {
    // Show demo data when API key is not set
    widget.innerHTML = `
      <div class="weather-widget">
        <h4 style="color:var(--primary);margin-bottom:10px;">🌍 Weather in ${city}</h4>
        <div class="temp">18°C</div>
        <div style="color:var(--text-muted)">Partly Cloudy (Demo)</div>
        <div style="color:var(--text-muted);font-size:0.85rem;margin-top:8px">
          💧 Humidity: 62% &nbsp;|&nbsp; 💨 Wind: 3.2 m/s
        </div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:10px">
          Add your OpenWeatherMap API key in main.js for live data.
        </p>
      </div>
    `;
  }
}

// ---- REST COUNTRIES API ----
/**
 * Fetch countries data and populate the country selector for dealership locator
 * Uses the REST Countries public API
 */
async function fetchCountries() {
  const select = document.getElementById('country-select');
  if (!select) return;

  try {
    const res = await fetch('https://restcountries.com/v3.1/region/americas');
    const countries = await res.json();

    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    countries.forEach(country => {
      const opt = document.createElement('option');
      opt.value = country.name.common;
      opt.textContent = `${country.flag} ${country.name.common}`;
      select.appendChild(opt);
    });

    showToast('Country list loaded!');
  } catch (err) {
    console.warn('Countries API failed:', err);
    // Fallback options
    ['Canada', 'USA', 'Mexico', 'Brazil'].forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  }
}

// ---- LEAFLET MAP INIT (dealerships) ----
/**
 * Initialize Leaflet map with dealership markers
 * Requires leaflet.js to be loaded on the page
 */
function initMap() {
  if (typeof L === 'undefined') return;

  const map = L.map('map').setView([43.65, -79.38], 11);

  // OpenStreetMap tile layer (free API)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Dealership locations
  const dealerships = [
    { name: 'AutoElite Downtown', lat: 43.655, lng: -79.380, phone: '416-555-0101' },
    { name: 'AutoElite North York', lat: 43.767, lng: -79.412, phone: '416-555-0202' },
    { name: 'AutoElite Scarborough', lat: 43.773, lng: -79.257, phone: '416-555-0303' },
    { name: 'AutoElite Mississauga', lat: 43.589, lng: -79.644, phone: '905-555-0404' },
    { name: 'AutoElite Brampton', lat: 43.732, lng: -79.760, phone: '905-555-0505' }
  ];

  // Custom icon using CSS
  const customIcon = L.divIcon({
    className: '',
    html: '<div style="background:var(--primary,#c9a84c);width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  dealerships.forEach(d => {
    L.marker([d.lat, d.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${d.name}</strong><br>📞 ${d.phone}`);
  });
}

// ---- NEWSLETTER FORM ----
/**
 * Handle newsletter subscription
 */
function handleNewsletter(event) {
  event.preventDefault();
  const email = document.getElementById('newsletter-email')?.value;
  if (email) {
    showToast(`Subscribed! Welcome to AutoElite updates.`);
    event.target.reset();
  }
}

// ---- WISHLIST ----
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

/**
 * Toggle a car in the wishlist
 * @param {string} carId
 * @param {string} carName
 */
function toggleWishlist(carId, carName) {
  const idx = wishlist.indexOf(carId);
  if (idx === -1) {
    wishlist.push(carId);
    showToast(`❤️ ${carName} added to wishlist!`);
  } else {
    wishlist.splice(idx, 1);
    showToast(`${carName} removed from wishlist.`);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));

  // Update all heart buttons
  document.querySelectorAll(`[data-wish="${carId}"]`).forEach(btn => {
    btn.textContent = wishlist.includes(carId) ? '❤️' : '🤍';
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();
  updateCompareBar();
  initSearch();

  // Attach theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });

  // Hamburger
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  // Filter inputs (live)
  ['search-input', 'brand-filter', 'type-filter', 'price-filter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', filterProducts);
    document.getElementById(id)?.addEventListener('change', filterProducts);
  });

  // Quote form
  document.getElementById('quote-form')?.addEventListener('submit', calculateQuote);

  // Contact form
  document.getElementById('contact-form')?.addEventListener('submit', handleContact);

  // Newsletter form
  document.getElementById('newsletter-form')?.addEventListener('submit', handleNewsletter);

  // City weather search
  document.getElementById('city-search-btn')?.addEventListener('click', () => {
    const city = document.getElementById('city-input')?.value || 'Toronto';
    fetchWeather(city);
  });

  // Auto-run weather on pages that have the widget
  if (document.getElementById('weather-widget')) fetchWeather('Toronto');

  // Auto-run countries on dealerships page
  if (document.getElementById('country-select')) fetchCountries();

  // Auto-run map on dealerships page
  if (document.getElementById('map')) {
    // Give map container a moment to render
    setTimeout(initMap, 200);
  }

  // Wishlist button states
  document.querySelectorAll('[data-wish]').forEach(btn => {
    const id = btn.dataset.wish;
    btn.textContent = wishlist.includes(id) ? '❤️' : '🤍';
  });
});
