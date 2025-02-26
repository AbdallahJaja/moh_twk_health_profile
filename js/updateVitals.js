// js/updateVitals.js
window.loadVitals = function() {
  var vitalsListEl = document.getElementById("vitals-list");
  var loadingEl = document.getElementById("loading");
  var searchEl = document.getElementById("search");
  var vitalsDataCache = [];
  var fuse = null;
  
  function fetchVitals() {
    if (USE_MOCK) {
      console.log("Fetching mock data from 'mock/mock_vitals.json' ...");
      return fetch("mock/mock_vitals.json")
        .then(function(response) {
          console.log("Fetch response status:", response.status);
          if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
          }
          return response.text();
        })
        .then(function(text) {
          console.log("Raw response text:", text);
          var data = JSON.parse(text);
          console.log("Mock vitals data loaded:", data);
          return data;
        })
        .catch(function(error) {
          console.error("Error fetching mock vitals:", error.message);
          return null;
        });
    } else {
      // Real API flow if needed.
      return loginByTWK()
        .then(function(token) {
          return fetch(VITALS_API_URL, {
            headers: { Authorization: "Bearer " + token }
          });
        })
        .then(function(response) {
          return response.json();
        })
        .catch(function(error) {
          console.error("Error fetching vitals from API:", error.message);
          return null;
        });
    }
  }
  
  function loadVitalsInternal() {
    loadingEl.style.display = "block";
    return fetchVitals().then(function(data) {
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
        (AppSettings.language === "ar" ? LANG_AR.greeting : LANG_EN.greeting) + ", " + data.user.name;
      if (AppSettings.age !== null) {
        document.getElementById("user-age").textContent = "Age: " + AppSettings.age;
      }
      renderVitals(vitalsDataCache);
      calculateDigitalTwin(vitalsDataCache);
      loadingEl.style.display = "none";
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
      
      // For list-type vitals, make the card clickable to go to details
      if (vital.type === "list") {
        card.style.cursor = "pointer";
        card.addEventListener("click", function() {
          console.log("Card clicked for vital:", vital);
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
      
      // Action Buttons (stop propagation)
      var btnGroup = document.createElement("div");
      btnGroup.className = "btn-group";
      
      var infoBtn = document.createElement("button");
      infoBtn.className = "btn btn-info btn-sm";
      infoBtn.textContent = "i";
      infoBtn.onclick = function(e) {
        e.stopPropagation();
        showInfo(vital);
      };
      
      var copyBtn = document.createElement("button");
      copyBtn.className = "btn btn-secondary btn-sm";
      copyBtn.textContent = LANG_EN.copy;
      copyBtn.onclick = function(e) {
        e.stopPropagation();
        copyToClipboard(vitalName, vital.value, vital.unit);
      };
      
      btnGroup.append(infoBtn, copyBtn);
      
      if (vital.id >= 1 && vital.id <= 13) {
        var editBtn = document.createElement("button");
        editBtn.className = "btn btn-primary btn-sm";
        editBtn.textContent = "Edit";
        editBtn.onclick = function(e) {
          e.stopPropagation();
          openEditModal(vital);
        };
        btnGroup.append(editBtn);
      }
      
      if (vital.type === "numeric" && vital.unit && (vital.unit === "kg" || vital.unit === "cm")) {
        var convertBtn = document.createElement("button");
        convertBtn.className = "btn btn-warning btn-sm";
        convertBtn.textContent = LANG_EN.convertUnits;
        convertBtn.onclick = function(e) {
          e.stopPropagation();
          toggleConversion(vital, convertBtn, valueEl);
        };
        btnGroup.append(convertBtn);
      }
      
      if (vital.more_info) {
        var moreInfoBtn = document.createElement("button");
        moreInfoBtn.className = "btn btn-link btn-sm";
        moreInfoBtn.textContent = LANG_EN.moreInfo;
        moreInfoBtn.onclick = function(e) {
          e.stopPropagation();
          TWK.openUrl(vital.more_info, 1);
        };
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
    var query = searchEl.value.trim();
    if (!query) {
      renderVitals(vitalsDataCache);
      return;
    }
    var result = fuse.search(query);
    var filteredVitals = result.map(function(r) { return r.item; });
    renderVitals(filteredVitals);
  });
  
  function calculateDigitalTwin(items) {
    var insight = "You have " + items.length + " entries. Regular review aids in preventive and predictive care.";
    var twinEl = document.getElementById("twin-insights");
    if (twinEl) {
      twinEl.textContent = insight;
      console.log("Digital twin insight set to:", insight);
    } else {
      console.error("twin-insights element not found.");
    }
  }
  
  return loadVitalsInternal().then(function() {
    console.log("loadVitalsInternal finished.");
    window.loadVitals = loadVitalsInternal;
  }).catch(function(err) {
    console.error("loadVitalsInternal error:", err);
  });
};