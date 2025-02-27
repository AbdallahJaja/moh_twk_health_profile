// js/updateVitals.js
// Global functions for handling vitals UI interactions

// Copy vital details to clipboard
window.copyToClipboard = function(vitalName, vitalValue, vitalUnit) {
  var text = vitalName + ": " + (Array.isArray(vitalValue) ? vitalValue.join(", ") : vitalValue + (vitalUnit ? " " + vitalUnit : ""));
  navigator.clipboard.writeText(text)
    .then(function() {
      new bootstrap.Toast(document.getElementById("copyToast")).show();
      if (typeof logEvent === "function") {
        logEvent("copy_button_click", { value: text });
      }
    })
    .catch(function(err) {
      console.error("Copy failed:", err);
    });
};

// Show additional info about the vital
window.showInfo = function(vital) {
  var infoText = vital.description || ((localStorage.getItem("lang") === "ar") ? "لا توجد معلومات إضافية" : "No additional info");
  alert(infoText);
  if (typeof logEvent === "function") {
    logEvent("info_button_click", { vitalKey: vital.vital_key });
  }
};

// Open edit modal with vital details; only for non-list vitals (ids 1-13)
window.openEditModal = function(vital) {
  console.log("openEditModal called for vital:", vital);
  var currentLang = localStorage.getItem("lang") || "en";
  var vitalName = (VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key;
  var modalTitle = (currentLang === "ar") ? "تحرير " + vitalName : "Edit " + vitalName;
  var editModalLabel = document.getElementById("editModalLabel");
  if (editModalLabel) { editModalLabel.textContent = modalTitle; }
  var editVitalTitle = document.getElementById("editVitalTitle");
  if (editVitalTitle) { editVitalTitle.textContent = vitalName; }
  var editInput = document.getElementById("editVitalValue");
  if (editInput) {
    if (vital.type !== "list") { editInput.value = vital.value; } else { editInput.value = ""; }
  }
  var cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) { cancelBtn.textContent = (currentLang === "ar") ? "إلغاء" : "Cancel"; }
  var saveBtn = document.getElementById("saveEditBtn");
  if (saveBtn) {
    saveBtn.textContent = (currentLang === "ar") ? "حفظ" : "Save";
    saveBtn.onclick = function(e) {
      e.stopPropagation();
      var newValue = editInput.value;
      saveVital(vital.id, newValue).then(function(success) {
        if (success) {
          alert((currentLang === "ar") ? "تم التحديث بنجاح" : "Update successful");
          if (typeof window.loadVitals === "function") { window.loadVitals(); }
        } else {
          alert((currentLang === "ar") ? "فشل التحديث" : "Update failed");
        }
        var modalEl = document.getElementById("editModal");
        var modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) { modalInstance.hide(); }
      }).catch(function(err) {
        console.error("Error saving vital:", err);
      });
    };
  }
  if (typeof logEvent === "function") { logEvent("edit_button_click", { vitalKey: vital.vital_key }); }
  var modalEl = document.getElementById("editModal");
  var modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
};

// Toggle conversion for numeric vitals (kg <-> lbs, cm <-> in)
window.toggleConversion = function(vital, btn, valueEl) {
  if (vital.unit === "kg") {
    if (!vital.converted) {
      vital.convertedValue = (vital.value * 2.20462).toFixed(1);
      vital.convertedUnit = "lbs";
      vital.converted = true;
    } else {
      vital.converted = false;
    }
  } else if (vital.unit === "cm") {
    if (!vital.converted) {
      vital.convertedValue = (vital.value * 0.393701).toFixed(1);
      vital.convertedUnit = "in";
      vital.converted = true;
    } else {
      vital.converted = false;
    }
  }
  if (vital.converted) {
    valueEl.textContent = vital.convertedValue + " " + vital.convertedUnit;
  } else {
    valueEl.textContent = vital.value + " " + (vital.unit || "");
  }
  if (typeof logEvent === "function") { logEvent("convert_units", { vitalKey: vital.vital_key }); }
};

window.loadVitals = function() {
  var vitalsListEl = document.getElementById("vitals-list");
  var loadingEl = document.getElementById("loading");
  var searchEl = document.getElementById("search");
  var clearSearchBtn = document.getElementById("clearSearchBtn");
  var vitalsDataCache = [];
  var fuse = null;
  var currentLang = localStorage.getItem("lang") || "en";
  var mockFile = currentLang === "ar" ? "mock/mock_vitals_ar.json" : "mock/mock_vitals_en.json";
  
  function fetchVitals() {
    if (USE_MOCK) {
      console.log("Fetching mock data from '" + mockFile + "' ...");
      return fetch(mockFile)
        .then(function(response) {
          console.log("Fetch response status:", response.status);
          if (!response.ok) { throw new Error("HTTP error! status: " + response.status); }
          return response.text();
        })
        .then(function(text) {
          var data = JSON.parse(text);
          console.log("Mock vitals data loaded:", data);
          return data;
        })
        .catch(function(error) {
          console.error("Error fetching mock vitals:", error.message);
          return null;
        });
    } else {
      return loginByTWK()
        .then(function(token) {
          return fetch(VITALS_API_URL, {
            headers: { Authorization: "Bearer " + token }
          });
        })
        .then(function(response) { return response.json(); })
        .catch(function(error) {
          console.error("Error fetching vitals from API:", error.message);
          return null;
        });
    }
  }
  
  function loadVitalsInternal() {
    if (loadingEl) loadingEl.style.display = "block";
    return fetchVitals().then(function(data) {
      if (!data) {
        console.error("No data received from fetchVitals.");
        if (loadingEl) loadingEl.style.display = "none";
        return;
      }
      try {
        vitalsDataCache = data.vitals;
        console.log("Vitals data cache:", vitalsDataCache);
        fuse = new Fuse(vitalsDataCache, {
          keys: ["vital_key", "description"],
          threshold: 0.3
        });
        
        // Set user header info
        var userImageEl = document.getElementById("user-avatar");
        if (userImageEl && data.user.image) {
          userImageEl.src = data.user.image;
        }
        var greetingEl = document.getElementById("greeting");
        if (greetingEl) {
          greetingEl.textContent = ((currentLang === "ar") ? LANG_AR.greeting : LANG_EN.greeting) + ", " + data.user.name;
        }
        var ageEl = document.getElementById("user-age");
        if (ageEl) {
          ageEl.textContent = (isNaN(AppSettings.age) || AppSettings.age === null)
            ? ((currentLang === "ar") ? LANG_AR.age + ": N/A" : LANG_EN.age + ": N/A")
            : ((currentLang === "ar") ? LANG_AR.age + ": " + AppSettings.age : LANG_EN.age + ": " + AppSettings.age);
        }
        var welcomeMessageEl = document.getElementById("welcomeMessage");
        if (welcomeMessageEl) {
          welcomeMessageEl.textContent = (currentLang === "ar") ? LANG_AR.welcomeMessage : LANG_EN.welcomeMessage;
        } else { console.warn("welcomeMessage element not found."); }
        renderVitals(vitalsDataCache);
        calculateDigitalTwin(vitalsDataCache);
      } catch (renderError) {
        console.error("Error processing vitals data:", renderError);
      } finally {
        if (loadingEl) loadingEl.style.display = "none";
      }
    });
  }
  
  function renderVitals(vitals) {
    if (!vitalsListEl) {
      console.error("Vitals list container not found.");
      return;
    }
    vitalsListEl.innerHTML = "";
    vitals.forEach(function(vital, index) {
      console.log("Rendering vital " + index + ":", vital);
      var vitalName = (VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key;
      
      var col = document.createElement("div");
      col.className = "col";
      var card = document.createElement("div");
      card.className = "card h-100";
      card.setAttribute("data-aos", "fade-up");
      
      // Attach the vital data to the card element for drag sorting
      card._vitalData = vital;
      
      if (vital.type === "list") {
        card.style.cursor = "pointer";
        card.addEventListener("click", function() {
          sessionStorage.setItem("selectedVital", JSON.stringify(vital));
          window.location.href = "vitalDetails.html";
        });
      }
      
      var cardBody = document.createElement("div");
      cardBody.className = "card-body";
      
      var title = document.createElement("h5");
      title.className = "card-title";
      title.textContent = vitalName;
      
      var valueEl = document.createElement("p");
      valueEl.className = "card-text";
      if (vital.type === "list") {
        valueEl.textContent = Array.isArray(vital.value) ? vital.value.join(", ") : vital.value;
      } else if (vital.type === "location") {
        valueEl.innerHTML = vital.value + ' <button class="btn btn-sm btn-outline-primary" onclick="showMap(' + vital.coordinates.lat + ', ' + vital.coordinates.lng + ')">📍 Map</button>';
      } else {
        if (vital.converted) {
          valueEl.textContent = vital.convertedValue + " " + vital.convertedUnit;
        } else {
          valueEl.textContent = vital.value + " " + (vital.unit || "");
        }
      }
      
      var btnGroup = document.createElement("div");
      btnGroup.className = "btn-group";
      
      // Favorite button: toggle favorite status on vital record
      var favBtn = document.createElement("button");
      favBtn.className = "fav-btn";
      favBtn.innerHTML = (vital.favorite) ? "&#9733;" : "&#9734;"; // filled star vs outline star
      favBtn.onclick = function(e) {
        e.stopPropagation();
        vital.favorite = !vital.favorite;
        favBtn.innerHTML = (vital.favorite) ? "&#9733;" : "&#9734;";
        // Re-render so favorites appear at the top.
        vitalsDataCache.sort(function(a, b) {
          return (a.favorite === b.favorite) ? 0 : (a.favorite ? -1 : 1);
        });
        renderVitals(vitalsDataCache);
        if (typeof logEvent === "function") {
          logEvent("favorite_toggle", { vitalKey: vital.vital_key, favorite: vital.favorite });
        }
      };
      btnGroup.append(favBtn);
      
      // Copy button
      var copyBtn = document.createElement("button");
      copyBtn.className = "btn btn-secondary btn-sm";
      copyBtn.textContent = (currentLang === "ar") ? LANG_AR.copy : LANG_EN.copy;
      copyBtn.onclick = function(e) {
        e.stopPropagation();
        copyToClipboard(vitalName, vital.value, vital.unit);
      };
      btnGroup.append(copyBtn);
      
      // Show Edit button only for non-list vitals (ids 1–13)
      if (vital.id >= 1 && vital.id <= 13) {
        var editBtn = document.createElement("button");
        editBtn.className = "btn btn-primary btn-sm";
        editBtn.textContent = (currentLang === "ar") ? "تحرير" : "Edit";
        editBtn.onclick = function(e) {
          e.stopPropagation();
          openEditModal(vital);
        };
        btnGroup.append(editBtn);
      }
      
      // Convert Units button for numeric values in kg or cm
      if (vital.type === "numeric" && vital.unit && (vital.unit === "kg" || vital.unit === "cm")) {
        var convertBtn = document.createElement("button");
        convertBtn.className = "btn btn-warning btn-sm";
        convertBtn.textContent = (currentLang === "ar") ? "تحويل الوحدات" : "Convert Units";
        convertBtn.onclick = function(e) {
          e.stopPropagation();
          toggleConversion(vital, convertBtn, valueEl);
        };
        btnGroup.append(convertBtn);
      }
      
      // More Info button if available
      if (vital.more_info) {
        var moreInfoBtn = document.createElement("button");
        moreInfoBtn.className = "btn btn-link btn-sm";
        moreInfoBtn.textContent = (currentLang === "ar") ? "مزيد من المعلومات" : "More Info";
        moreInfoBtn.onclick = function(e) {
          e.stopPropagation();
          TWK.openUrl(vital.more_info, 1);
        };
        btnGroup.append(moreInfoBtn);
      }
      
      cardBody.appendChild(title);
      cardBody.appendChild(valueEl);
      cardBody.appendChild(btnGroup);
      card.appendChild(cardBody);
      col.appendChild(card);
      vitalsListEl.appendChild(col);
    });
    console.log("Rendered vitals HTML:", vitalsListEl.innerHTML);
  }
  
  function calculateDigitalTwin(items) {
    var insight = (currentLang === "ar")
          ? "لديك " + items.length + " مدخلات. المراجعة الدورية تساعد في الوقاية والرعاية التنبؤية."
          : "You have " + items.length + " entries. Regular review aids in preventive and predictive care.";
    var twinEl = document.getElementById("twin-insights");
    if (twinEl) {
      twinEl.textContent = insight;
      console.log("Digital twin insight set to:", insight);
    } else {
      console.error("twin-insights element not found.");
    }
  }
  
  // Attach search filtering behavior using Fuse.js
  if (searchEl && clearSearchBtn) {
    searchEl.addEventListener("input", function() {
      var query = this.value.trim();
      if(query.length > 0) {
        clearSearchBtn.style.display = "block";
        var results = fuse.search(query);
        var filtered = results.map(function(result) { return result.item; });
        renderVitals(filtered);
      } else {
        clearSearchBtn.style.display = "none";
        renderVitals(vitalsDataCache);
      }
    });
    clearSearchBtn.addEventListener("click", function() {
      searchEl.value = "";
      clearSearchBtn.style.display = "none";
      renderVitals(vitalsDataCache);
    });
  } else {
    console.warn("Search elements not found.");
  }
  
  return loadVitalsInternal().then(function() {
    console.log("loadVitalsInternal finished.");
    window.loadVitals = loadVitalsInternal;
  }).catch(function(err) {
    console.error("loadVitalsInternal error:", err);
  });
};