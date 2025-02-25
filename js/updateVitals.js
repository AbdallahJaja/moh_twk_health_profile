/* js/updateVitals.js */
window.loadVitals = async function() {
  const vitalsListEl = document.getElementById("vitals-list");
  const loadingEl = document.getElementById("loading");
  const searchEl = document.getElementById("search");
  let vitalsDataCache = [];
  let fuse = null;
  
  async function fetchVitals() {
    if (USE_MOCK) {
      try {
        console.log("Fetching mock data from 'mock/mock_vitals.json' ...");
        const response = await fetch("mock/mock_vitals.json");
        console.log("Fetch response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log("Raw response text:", text);
        const data = JSON.parse(text);
        console.log("Mock vitals data loaded:", data);
        return data;
      } catch (error) {
        console.error("Error fetching mock vitals 22:", error.message);
        return null;
      }
    } else {
      try {
        const token = await loginByTWK();
        const response = await fetch(VITALS_API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        return await response.json();
      } catch (error) {
        console.error("Error fetching vitals from API:", error.message);
        return null;
      }
    }
  }
  
  async function loadVitalsInternal() {
    loadingEl.style.display = "block";
    const data = await fetchVitals();
    if (!data) {
      console.error("No data received from fetchVitals.");
      loadingEl.style.display = "none";
      return;
    }
    vitalsDataCache = data.vitals;
    console.log("Vitals data cache:", vitalsDataCache);
    fuse = new Fuse(vitalsDataCache, {
      keys: ["vital_key", "description"],
      threshold: 0.3
    });
    document.getElementById("user-image").src = data.user.image;
    document.getElementById("greeting").textContent =
      `${AppSettings.language === "ar" ? LANG_AR.greeting : LANG_EN.greeting}, ${data.user.name}`;
    if (AppSettings.age !== null) {
      document.getElementById("user-age").textContent = `Age: ${AppSettings.age}`;
    }
    renderVitals(vitalsDataCache);
    calculateDigitalTwin(vitalsDataCache);
    loadingEl.style.display = "none";
  }
  
  function renderVitals(vitals) {
    if (!vitalsListEl) {
      console.error("Vitals list container not found.");
      return;
    }
    vitalsListEl.innerHTML = "";
    vitals.forEach((vital, index) => {
      console.log(`Rendering vital ${index}:`, vital);
      const vitalName = VITALS_TRANSLATION[vital.vital_key]?.[AppSettings.language] || vital.vital_key;
      const col = document.createElement("div");
      col.className = "col";
      const card = document.createElement("div");
      card.className = "card h-100";
      card.setAttribute("data-aos", "fade-up");
      
      // For list-type vitals, make the card clickable to go to details
      if (vital.type === "list") {
        card.style.cursor = "pointer";
        card.addEventListener("click", function() {
          console.log("Card clicked for vital:", vital);
          sessionStorage.setItem("selectedVital", JSON.stringify(vital));
          window.location.href = "vitalDetails.html";
        });
      }
      
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      
      const title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = vitalName;
      
      const valueEl = document.createElement("p");
      valueEl.className = "card-text";
      if (vital.type === "list") {
        valueEl.textContent = Array.isArray(vital.value) ? vital.value.join(", ") : vital.value;
      } else if (vital.type === "location") {
        valueEl.innerHTML = `${vital.value} <button class="btn btn-sm btn-outline-primary" onclick="showMap(${vital.coordinates.lat}, ${vital.coordinates.lng})">📍 Map</button>`;
      } else {
        if (vital.converted) {
          valueEl.textContent = `${vital.convertedValue} ${vital.convertedUnit}`;
        } else {
          valueEl.textContent = `${vital.value} ${vital.unit || ""}`;
        }
      }
      
      // Action Buttons (prevent card click from interfering)
      const btnGroup = document.createElement("div");
      btnGroup.className = "btn-group";
      
      const infoBtn = document.createElement("button");
      infoBtn.className = "btn btn-info btn-sm";
      infoBtn.textContent = "i";
      infoBtn.onclick = (e) => { e.stopPropagation(); showInfo(vital); };
      
      const copyBtn = document.createElement("button");
      copyBtn.className = "btn btn-secondary btn-sm";
      copyBtn.textContent = LANG_EN.copy;
      copyBtn.onclick = (e) => { e.stopPropagation(); copyToClipboard(vitalName, vital.value, vital.unit); };
      
      btnGroup.append(infoBtn, copyBtn);
      
      if (vital.id >= 1 && vital.id <= 13) {
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-primary btn-sm";
        editBtn.textContent = "Edit";
        editBtn.onclick = (e) => { e.stopPropagation(); openEditModal(vital); };
        btnGroup.append(editBtn);
      }
      
      if (vital.type === "numeric" && vital.unit && (vital.unit === "kg" || vital.unit === "cm")) {
        const convertBtn = document.createElement("button");
        convertBtn.className = "btn btn-warning btn-sm";
        convertBtn.textContent = LANG_EN.convertUnits;
        convertBtn.onclick = (e) => { e.stopPropagation(); toggleConversion(vital, convertBtn, valueEl); };
        btnGroup.append(convertBtn);
      }
      
      if (vital.more_info) {
        const moreInfoBtn = document.createElement("button");
        moreInfoBtn.className = "btn btn-link btn-sm";
        moreInfoBtn.textContent = LANG_EN.moreInfo;
        moreInfoBtn.onclick = (e) => { e.stopPropagation(); TWK.openUrl(vital.more_info, 1); };
        btnGroup.append(moreInfoBtn);
      }
      
      cardBody.append(title, valueEl, btnGroup);
      card.appendChild(cardBody);
      col.appendChild(card);
      vitalsListEl.appendChild(col);
    });
    console.log("Rendered vitals HTML:", vitalsListEl.innerHTML);
  }
  
  searchEl.addEventListener("input", function() {
    const query = searchEl.value.trim();
    if (!query) {
      renderVitals(vitalsDataCache);
      return;
    }
    const result = fuse.search(query);
    const filteredVitals = result.map(r => r.item);
    renderVitals(filteredVitals);
  });
  
  function calculateDigitalTwin(items) {
    const insight = `You have ${items.length} entries. Regular review aids in preventive and predictive care.`;
    const twinEl = document.getElementById("twin-insights");
    if (twinEl) {
      twinEl.textContent = insight;
      console.log("Digital twin insight set to:", insight);
    } else {
      console.error("twin-insights element not found.");
    }
  }
  
  await loadVitalsInternal();
  
  // Expose loadVitalsInternal as loadVitals on window for external access
  window.loadVitals = loadVitalsInternal;
};