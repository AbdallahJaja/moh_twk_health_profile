/* js/updateVitals.js */
document.addEventListener("DOMContentLoaded", function() {
  const vitalsListEl = document.getElementById("vitals-list");
  const loadingEl = document.getElementById("loading");
  const searchEl = document.getElementById("search");
  let vitalsDataCache = [];
  let fuse = null;
  
  async function loadVitals() {
    loadingEl.style.display = "block";
    try {
      const data = await fetchVitals();
      vitalsDataCache = data.vitals;
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
    } catch (error) {
      console.error("Error loading vitals", error);
    } finally {
      loadingEl.style.display = "none";
    }
  }
  
  // Inside your renderVitals function in js/updateVitals.js:
function renderVitals(vitals) {
  vitalsListEl.innerHTML = "";
  vitals.forEach((vital) => {
    const vitalName = VITALS_TRANSLATION[vital.vital_key]?.[AppSettings.language] || vital.vital_key;
    
    const col = document.createElement("div");
    col.className = "col";
    
    const card = document.createElement("div");
    card.className = "card h-100";
    card.setAttribute("data-aos", "fade-up");
    
    // If vital is of type list, make the card clickable
    if (vital.type === "list") {
      card.style.cursor = "pointer";
      card.addEventListener("click", function() {
        // Store vital data in sessionStorage as a JSON string
        sessionStorage.setItem("selectedVital", JSON.stringify(vital));
        // Redirect to the details page
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
      valueEl.textContent = vital.value.join(", ");
    } else if (vital.type === "location") {
      valueEl.innerHTML = `${vital.value} <button class="btn btn-sm btn-outline-primary" onclick="showMap(${vital.coordinates.lat}, ${vital.coordinates.lng})">📍 Map</button>`;
    } else {
      if (vital.converted) {
        valueEl.textContent = `${vital.convertedValue} ${vital.convertedUnit}`;
      } else {
        valueEl.textContent = `${vital.value} ${vital.unit || ""}`;
      }
    }
    
    // Action Buttons (stopPropagation on buttons so they don't trigger card click)
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
    
    // For update vitals (IDs 1–13): add Edit Button
    if (vital.id >= 1 && vital.id <= 13) {
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-primary btn-sm";
      editBtn.textContent = "Edit";
      editBtn.onclick = (e) => { e.stopPropagation(); openEditModal(vital); };
      btnGroup.append(editBtn);
    }
    
    // Conversion Button for numeric values (kg or cm)
    if (vital.type === "numeric" && vital.unit && (vital.unit === "kg" || vital.unit === "cm")) {
      const convertBtn = document.createElement("button");
      convertBtn.className = "btn btn-warning btn-sm";
      convertBtn.textContent = LANG_EN.convertUnits;
      convertBtn.onclick = (e) => { e.stopPropagation(); toggleConversion(vital, convertBtn, valueEl); };
      btnGroup.append(convertBtn);
    }
    
    // More Info Button using TWK.openUrl
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
}
  
  // Fuse.js search for vitals
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
  
  function openEditModal(vital) {
    document.getElementById("edit-metric-id").value = vital.id;
    document.getElementById("edit-metric-value").value = vital.value;
    document.getElementById("edit-error").textContent = "";
    new bootstrap.Modal(document.getElementById("editModal")).show();
  }
  
  function showInfo(vital) {
    document.getElementById("infoModalBody").textContent = vital.description || "No description available.";
    document.getElementById("moreInfoBtn").onclick = () => {
      if (vital.more_info) {
        TWK.openUrl(vital.more_info, 1);
      }
    };
    new bootstrap.Modal(document.getElementById("infoModal")).show();
  }
  
  function copyToClipboard(name, value, unit) {
    let text = `${name}: `;
    if (Array.isArray(value)) {
      text += value.join(", ");
    } else {
      text += value;
    }
    if (unit) text += ` ${unit}`;
    navigator.clipboard.writeText(text)
      .then(() => {
        const toastEl = document.getElementById("copyToast");
        new bootstrap.Toast(toastEl).show();
      })
      .catch(err => console.error("Copy failed", err));
  }
  
  // Toggle conversion for numeric vitals (update only current card's value element)
  function toggleConversion(vital, btn, valueEl) {
    if (!vital.converted) {
      if (vital.unit === "kg") {
        vital.convertedValue = (vital.value * 2.20462).toFixed(2);
        vital.convertedUnit = "lbs";
      } else if (vital.unit === "cm") {
        vital.convertedValue = (vital.value * 0.393701).toFixed(2);
        vital.convertedUnit = "inches";
      }
      vital.converted = true;
      btn.textContent = "Show Original";
      valueEl.textContent = `${vital.convertedValue} ${vital.convertedUnit}`;
    } else {
      vital.converted = false;
      btn.textContent = LANG_EN.convertUnits;
      valueEl.textContent = `${vital.value} ${vital.unit || ""}`;
    }
  }
  
  window.showMap = function(lat, lng) {
    const mapModal = new bootstrap.Modal(document.getElementById("mapModal"));
    mapModal.show();
    setTimeout(() => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 14
      });
      new google.maps.Marker({ position: { lat, lng }, map });
    }, 500);
  };
  
  document.getElementById("save-edit-btn").addEventListener("click", async function() {
    const id = document.getElementById("edit-metric-id").value;
    const newValue = document.getElementById("edit-metric-value").value.trim();
    if (newValue === "") {
      document.getElementById("edit-error").textContent = "Invalid value.";
      return;
    }
    const success = await saveVital(id, newValue);
    if (success) {
      new bootstrap.Modal(document.getElementById("editModal")).hide();
      loadVitals();
    } else {
      document.getElementById("edit-error").textContent = "Save failed. Please try again.";
    }
  });
  
  function calculateDigitalTwin(vitals) {
    let bmiRecord = vitals.find(v => v.vital_key === "bmi");
    let insight = "Maintain a healthy lifestyle for longevity.";
    if (bmiRecord) {
      let currentBMI = bmiRecord.converted ? bmiRecord.convertedValue : bmiRecord.value;
      if (currentBMI >= 18.5 && currentBMI <= 24.9) {
        insight = "Your BMI is optimal. Keep up the good work for a long life! Also, consider regular preventive check-ups.";
      } else if (currentBMI < 18.5) {
        insight = "Your BMI is low. Consider nutritional counseling and regular check-ups to prevent deficiencies.";
      } else {
        insight = "Your BMI indicates overweight. Consider lifestyle changes and predictive health screenings to reduce future risks.";
      }
    }
    document.getElementById("twin-insights").textContent = insight;
  }
  
  async function loadVitals() {
    loadingEl.style.display = "block";
    try {
      const data = await fetchVitals();
      document.getElementById("user-image").src = data.user.image;
      document.getElementById("greeting").textContent =
        `${AppSettings.language === "ar" ? LANG_AR.greeting : LANG_EN.greeting}, ${data.user.name}`;
      if (AppSettings.age !== null) {
        document.getElementById("user-age").textContent = `Age: ${AppSettings.age}`;
      }
      renderVitals(data.vitals);
      calculateDigitalTwin(data.vitals);
    } catch (error) {
      console.error("Error loading vitals", error);
    } finally {
      loadingEl.style.display = "none";
    }
  }
  
  loadVitals();
});