// vitalsDashboard/js/dashboard.js

(function() {
  // Determine current language from localStorage
  var currentLang = localStorage.getItem("lang") || "en";
  // Choose appropriate mock file
  var mockFile = currentLang === "ar" ? "../mock/mock_vitals_ar.json" : "../mock/mock_vitals_en.json";
  
  // DOM Elements
  var userImageEl = document.getElementById("user-image");
  var greetingEl = document.getElementById("greeting");
  var userAgeEl = document.getElementById("user-age");
  var vitalsSummaryEl = document.getElementById("vitalsSummary");
  var vitalsCardsContainer = document.getElementById("vitalsCards");
  var vitalsListTitleEl = document.getElementById("vitalsListTitle");
  
  function fetchVitals() {
    if (USE_MOCK) { // USE_MOCK defined in constants.js
      console.log("Fetching mock data from: " + mockFile);
      return fetch(mockFile)
        .then(function(response) {
          if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
          }
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
      // If real API is implemented, use that flow here.
      return loginByTWK()
        .then(function(token) {
          return fetch(VITALS_API_URL, { headers: { Authorization: "Bearer " + token } });
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
  
  function renderSummary(user, vitals) {
    // Set user image, greeting, and age from user data and AppSettings
    if (user && user.image) { userImageEl.src = user.image; }
    greetingEl.textContent = (currentLang === "ar" ? LANG_AR.greeting : LANG_EN.greeting) + ", " + user.name;
    if (AppSettings.age) {
      userAgeEl.textContent = (currentLang === "ar" ? LANG_AR.age : LANG_EN.age) + ": " + AppSettings.age;
    }
    // Use fallback if vitalsSummary is undefined
    var summaryTemplate = (currentLang === "ar" ? LANG_AR.vitalsSummary : LANG_EN.vitalsSummary) ||
      (currentLang === "ar" ? "لديك {count} مدخلات." : "You have {count} entries.");
    vitalsSummaryEl.textContent = summaryTemplate.replace("{count}", vitals.length);
  }
  
  function renderVitalsCards(vitals) {
    vitalsCardsContainer.innerHTML = "";
    // Set the section title (fallback if not defined)
    vitalsListTitleEl.textContent = currentLang === "ar" ?
      (LANG_AR.vitalsListTitle || "قائمة الحالات الصحية") :
      (LANG_EN.vitalsListTitle || "Vitals List");
    
    vitals.forEach(function(vital, index) {
      var vitalName = (VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][currentLang]) || vital.vital_key;
      // Create card container
      var col = document.createElement("div");
      col.className = "col";
      var card = document.createElement("div");
      card.className = "card h-100 vital-card";
      card.setAttribute("data-aos", "fade-up");
      
      // Card body
      var cardBody = document.createElement("div");
      cardBody.className = "card-body";
      
      // Vital title
      var titleEl = document.createElement("h5");
      titleEl.className = "card-title";
      titleEl.textContent = vitalName;
      
      // Vital value (display: if list, join array; else show value + unit)
      var valueEl = document.createElement("p");
      valueEl.className = "card-text";
      if (vital.type === "list") {
        valueEl.textContent = Array.isArray(vital.value) ? vital.value.join(", ") : vital.value;
      } else {
        valueEl.textContent = vital.value + (vital.unit ? " " + vital.unit : "");
      }
      
      // Overflow menu dropdown (actions: Edit, Copy, More Info)
      var dropdownDiv = document.createElement("div");
      dropdownDiv.className = "dropdown";
      var dropdownBtn = document.createElement("button");
      dropdownBtn.className = "btn btn-sm btn-outline-secondary dropdown-toggle";
      dropdownBtn.type = "button";
      dropdownBtn.setAttribute("data-bs-toggle", "dropdown");
      dropdownBtn.textContent = currentLang === "ar" ? LANG_AR.moreActions : LANG_EN.moreActions;
      var dropdownMenu = document.createElement("ul");
      dropdownMenu.className = "dropdown-menu";
      
      // Dropdown items: Edit (if editable)
      if (vital.id >= 1 && vital.id <= 13) { // editable condition
        var editItem = document.createElement("li");
        var editLink = document.createElement("a");
        editLink.className = "dropdown-item";
        editLink.href = "#";
        editLink.textContent = currentLang === "ar" ? LANG_AR.edit : LANG_EN.edit;
        editLink.addEventListener("click", function(e) {
          e.preventDefault();
          openEditModal(vital);
        });
        editItem.appendChild(editLink);
        dropdownMenu.appendChild(editItem);
      }
      
      // Dropdown item: Copy
      var copyItem = document.createElement("li");
      var copyLink = document.createElement("a");
      copyLink.className = "dropdown-item";
      copyLink.href = "#";
      copyLink.textContent = currentLang === "ar" ? LANG_AR.copy : LANG_EN.copy;
      copyLink.addEventListener("click", function(e) {
        e.preventDefault();
        copyToClipboard(vitalName, vital.value, vital.unit);
      });
      copyItem.appendChild(copyLink);
      dropdownMenu.appendChild(copyItem);
      
      // Dropdown item: More Info
      var moreInfoItem = document.createElement("li");
      var moreInfoLink = document.createElement("a");
      moreInfoLink.className = "dropdown-item";
      moreInfoLink.href = "#";
      moreInfoLink.textContent = currentLang === "ar" ? LANG_AR.moreInfo : LANG_EN.moreInfo;
      moreInfoLink.addEventListener("click", function(e) {
        e.preventDefault();
        TWK.openUrl(vital.more_info, 1);
      });
      moreInfoItem.appendChild(moreInfoLink);
      dropdownMenu.appendChild(moreInfoItem);
      
      dropdownDiv.appendChild(dropdownBtn);
      dropdownDiv.appendChild(dropdownMenu);
      
      // Append elements to card body and card
      cardBody.appendChild(titleEl);
      cardBody.appendChild(valueEl);
      cardBody.appendChild(dropdownDiv);
      card.appendChild(cardBody);
      col.appendChild(card);
      vitalsCardsContainer.appendChild(col);
    });
  }
  
  function initDashboard() {
    fetchVitals().then(function(data) {
      if (!data) { console.error("No data fetched."); return; }
      renderSummary(data.user, data.vitals);
      renderVitalsCards(data.vitals);
    });
  }
  
  // Initialize dashboard on load
  window.addEventListener("load", initDashboard);
})();