/* js/updateVitals.js */

// Global function to load vitals, render cards, and attach events.
window.loadVitals = function() {
  const vitalsListEl = document.getElementById("vitals-list");
  const loadingEl = document.getElementById("loading");
  const searchEl = document.getElementById("search");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  let vitalsDataCache = [];
  let fuse = null;
  const currentLang = localStorage.getItem("lang") || "en";
  const mockFile = currentLang === "ar" ? "mock/mock_vitals_ar.json" : "mock/mock_vitals_en.json";

  // Fetch vitals (mock or real)
  function fetchVitals() {
    if (USE_MOCK) {
      console.log("Fetching mock data from '" + mockFile + "' ...");
      return fetch(mockFile)
        .then(response => {
          console.log("Fetch response status:", response.status);
          if (!response.ok) throw new Error("HTTP error! status: " + response.status);
          return response.text();
        })
        .then(text => {
          const data = JSON.parse(text);
          console.log("Mock vitals data loaded:", data);
          return data;
        })
        .catch(error => {
          console.error("Error fetching mock vitals:", error.message);
          return null;
        });
    } else {
      return loginByTWK()
        .then(token => fetch(VITALS_API_URL, { headers: { Authorization: "Bearer " + token } }))
        .then(response => response.json())
        .catch(error => {
          console.error("Error fetching vitals from API:", error.message);
          return null;
        });
    }
  }

  // Helper: Convert Gregorian date to Hijri (simple approximation)
  function convertToHijri(date) {
    // For production, replace with a robust conversion library.
    const gYear = date.getFullYear();
    const hYear = Math.floor((gYear - 622) * 33 / 32);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return month + "/" + day + "/" + hYear;
  }

  // Helper: Toggle inline conversion of "last updated" date between Gregorian and Hijri
  function toggleHijriDate(spanEl, date) {
    // Use a data attribute to track state
    if (spanEl.dataset.hijriConverted === "true") {
      // Convert back to Gregorian
      const options = { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
      spanEl.textContent = date.toLocaleString(currentLang, options);
      spanEl.dataset.hijriConverted = "false";
    } else {
      spanEl.textContent = convertToHijri(date);
      spanEl.dataset.hijriConverted = "true";
    }
  }

  // Helper: Open bottom sheet modal for More Info
  function showMoreInfoDialog(vital) {
    const modalHtml = `
      <div class="modal fade" id="moreInfoModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog" style="position: fixed; bottom: 0; margin: 0; width: 100%; min-height:250px; max-height:400px; align-items:flex-start;">
          <div class="modal-content">
            <div class="modal-header d-flex justify-content-end">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${vital.more_info}
            </div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById("moreInfoModal");
    const modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
    modalEl.addEventListener('hidden.bs.modal', function () {
      modalEl.remove();
    });
  }

  // Helper: Open bottom sheet modal for editing non‑list vitals
  function openEditModal(vital) {
    // Save the original value for "restore default" functionality.
    if (vital.original_value === undefined) {
      vital.original_value = vital.value;
    }
    const modalHtml = `
      <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog" style="position: fixed; bottom: 0; margin: 0; width: 100%; height:400px; align-items:flex-start;">
          <div class="modal-content" style="height:100%;">
            <div class="modal-header d-flex align-items-center">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="order:-1;"></button>
              <h5 class="modal-title">${(currentLang === "ar" ? LANG_AR.edit : LANG_EN.edit)} ${(VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key}</h5>
            </div>
            <div class="modal-body">
              <p class="fw-bold">${(currentLang === "ar" ? LANG_AR.vitalDetailsTitle : LANG_EN.vitalDetailsTitle)}</p>
              <div class="mb-3">
                <label for="editVitalInput" class="form-label">${(currentLang === "ar" ? "القيمة" : "Value")}</label>
                <input type="text" class="form-control" id="editVitalInput" value="${vital.value}">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" id="restoreDefaultBtn" class="btn btn-secondary">
                ${currentLang === "ar" ? "استعادة القيمة الافتراضية" : "Restore Default"}
              </button>
              <button type="button" id="cancelEditBtn" class="btn btn-secondary" data-bs-dismiss="modal">
                ${currentLang === "ar" ? LANG_AR.cancel : LANG_EN.cancel}
              </button>
              <button type="button" id="saveEditBtn" class="btn btn-primary">
                ${currentLang === "ar" ? LANG_AR.save : LANG_EN.save}
              </button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById("editModal");
    const modalInstance = new bootstrap.Modal(modalEl);
    document.getElementById("saveEditBtn").onclick = function(e) {
      e.stopPropagation();
      let newValue = document.getElementById("editVitalInput").value.trim();
      if (newValue === "") {
        alert(currentLang === "ar" ? "القيمة لا يمكن أن تكون فارغة." : "Value cannot be empty.");
        return;
      }
      if (newValue.length > 100) {
        alert(currentLang === "ar" ? "يجب ألا تتجاوز القيمة 100 حرف." : "Value must be at most 100 characters.");
        return;
      }
      if (vital.type === "numeric") {
        const numVal = parseFloat(newValue);
        if (isNaN(numVal)) {
          alert(currentLang === "ar" ? "الرجاء إدخال قيمة رقمية." : "Please enter a numeric value.");
          return;
        }
        newValue = numVal;
      }
      saveVital(vital.id, newValue).then(success => {
        if (success) {
          alert(currentLang === "ar" ? "تم التحديث بنجاح." : "Update successful.");
          vital.value = newValue;
          if (typeof window.loadVitals === "function") {
            window.loadVitals();
          }
        } else {
          alert(currentLang === "ar" ? "فشل التحديث." : "Update failed.");
        }
        modalInstance.hide();
      }).catch(err => {
        console.error("Error saving vital:", err);
        alert(currentLang === "ar" ? "حدث خطأ أثناء الحفظ." : "An error occurred while saving.");
        modalInstance.hide();
      });
    };
    document.getElementById("restoreDefaultBtn").onclick = function(e) {
      e.stopPropagation();
      document.getElementById("editVitalInput").value = vital.original_value;
    };
    document.getElementById("cancelEditBtn").onclick = function() {
      modalInstance.hide();
    };
    modalEl.addEventListener('hidden.bs.modal', function() {
      modalEl.remove();
    });
    modalInstance.show();
  }

  // Render vitals as cards
  function renderVitals(vitals) {
    if (!vitalsListEl) {
      console.error("Vitals list container not found.");
      return;
    }
    vitalsListEl.innerHTML = "";
    vitals.forEach(function(vital, index) {
      console.log("Rendering vital " + index + ":", vital);
      const vitalName = (VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key;
      
      const col = document.createElement("div");
      col.className = "col";
      
      const card = document.createElement("div");
      card.className = "card h-100";
      card.setAttribute("data-aos", "fade-up");

      // --- Card Header ---
      const cardHeader = document.createElement("div");
      cardHeader.className = "card-header d-flex justify-content-between align-items-center";
      
      // Left side: Favorite button and vital title
      const headerLeft = document.createElement("div");
      headerLeft.className = "d-flex align-items-center";
      
      const favBtn = document.createElement("button");
      favBtn.className = "btn btn-link p-0 me-2";
      const favImg = document.createElement("img");
      favImg.src = vital.favorite ? "images/favorite_active.png" : "images/favorite.png";
      favImg.alt = "Favorite";
      favImg.style.width = "20px";
      favImg.style.height = "20px";
      favBtn.appendChild(favImg);
      favBtn.onclick = function(e) {
        e.stopPropagation();
        vital.favorite = !vital.favorite;
        favImg.src = vital.favorite ? "images/favorite_active.png" : "images/favorite.png";
      };
      
      const titleSpan = document.createElement("span");
      titleSpan.textContent = vitalName;
      headerLeft.appendChild(favBtn);
      headerLeft.appendChild(titleSpan);
      
      // Right side: More info button (opens bottom sheet)
      const moreInfoBtn = document.createElement("button");
      moreInfoBtn.className = "btn btn-link p-0 ms-2";
      const moreInfoImg = document.createElement("img");
      moreInfoImg.src = "images/more_info.png";
      moreInfoImg.alt = "More Info";
      moreInfoImg.style.width = "20px";
      moreInfoImg.style.height = "20px";
      moreInfoBtn.appendChild(moreInfoImg);
      moreInfoBtn.onclick = function(e) {
        e.stopPropagation();
        showMoreInfoDialog(vital);
      };
      
      cardHeader.appendChild(headerLeft);
      cardHeader.appendChild(moreInfoBtn);
      card.appendChild(cardHeader);

      // --- Card Body ---
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
      const valueEl = document.createElement("p");
      valueEl.className = "card-text";
      
      if (vital.type === "numeric") {
        if (vital.converted) {
          valueEl.textContent = vital.convertedValue + " " + vital.convertedUnit;
        } else {
          valueEl.textContent = vital.value + (vital.unit ? " " + vital.unit : "");
        }
        if (vital.unit === "kg" || vital.unit === "cm") {
          const convertBtn = document.createElement("button");
          convertBtn.className = "btn btn-link p-0 me-2";
          convertBtn.title = (currentLang === "ar") ? "تحويل الوحدات" : "Convert Units";
          const convImg = document.createElement("img");
          convImg.src = "images/convert_units.png";
          convImg.alt = "Convert Units";
          convImg.style.width = "20px";
          convImg.style.height = "20px";
          convertBtn.appendChild(convImg);
          convertBtn.onclick = function(e) {
            e.stopPropagation();
            toggleConversion(vital, convertBtn, valueEl);
          };
          valueEl.appendChild(convertBtn);
        }
      } else if (vital.type === "list") {
        if (vital.list_format === "string") {
          valueEl.textContent = Array.isArray(vital.value) ? vital.value.join(", ") : vital.value;
        } else if (vital.list_format === "object") {
          valueEl.innerHTML = vital.value.map(function(item) {
            return item.name + " (" + item.date + ", " + item.dose + ")";
          }).join("<br>");
        }
      } else if (vital.type === "location") {
        valueEl.innerHTML = vital.value + ' <button class="btn btn-sm btn-outline-primary" onclick="showMap(' + vital.coordinates.lat + ', ' + vital.coordinates.lng + ')">📍</button>';
      } else {
        valueEl.textContent = vital.value + (vital.unit ? " " + vital.unit : "");
      }
      cardBody.appendChild(valueEl);
      card.appendChild(cardBody);

      // --- Card Footer (with two columns) ---
      const cardFooter = document.createElement("div");
      cardFooter.className = "card-footer d-flex justify-content-between align-items-center";
      
      // Left: Last updated date with Hijri toggle
      const leftContainer = document.createElement("div");
      leftContainer.className = "d-flex align-items-center";
      const lastUpdatedSpan = document.createElement("span");
      lastUpdatedSpan.className = "text-muted small";
      lastUpdatedSpan.dataset.hijriConverted = "false";
      lastUpdatedSpan.textContent = (currentLang === "ar") ? "آخر تحديث: " : "Last Updated: ";
      const lastUpdatedDate = new Date(vital.last_updated);
      const options = { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
      lastUpdatedSpan.textContent += lastUpdatedDate.toLocaleString(currentLang, options);
      leftContainer.appendChild(lastUpdatedSpan);
      
      const hijriBtn = document.createElement("button");
      hijriBtn.className = "btn btn-link p-0 ms-1";
      hijriBtn.title = (currentLang === "ar") ? "تحويل إلى التقويم الهجري" : "Convert to Hijri";
      const hijriImg = document.createElement("img");
      hijriImg.src = "images/convert_hijri.png";
      hijriImg.alt = "Convert to Hijri";
      hijriImg.style.width = "20px";
      hijriImg.style.height = "20px";
      hijriBtn.appendChild(hijriImg);
      hijriBtn.onclick = function(e) {
        e.stopPropagation();
        toggleHijriDate(lastUpdatedSpan, lastUpdatedDate);
      };
      leftContainer.appendChild(hijriBtn);
      
      // Right: Copy and Edit buttons
      const rightContainer = document.createElement("div");
      rightContainer.className = "d-flex align-items-center";
      
      const copyBtn = document.createElement("button");
      copyBtn.className = "btn btn-link p-0 me-2";
      copyBtn.title = (currentLang === "ar") ? "نسخ" : "Copy";
      const copyImg = document.createElement("img");
      copyImg.src = "images/copy.png";
      copyImg.alt = "Copy";
      copyImg.style.width = "20px";
      copyImg.style.height = "20px";
      copyBtn.appendChild(copyImg);
      copyBtn.onclick = function(e) {
        e.stopPropagation();
        let textToCopy;
        if (vital.type === "list") {
          if (vital.list_format === "string") {
            textToCopy = Array.isArray(vital.value) ? vital.value.join(", ") : vital.value;
          } else if (vital.list_format === "object") {
            textToCopy = vital.value.map(function(item) {
              return item.name + " (" + item.date + ", " + item.dose + ")";
            }).join("; ");
          }
        } else {
          textToCopy = vital.value + (vital.unit ? " " + vital.unit : "");
        }
        navigator.clipboard.writeText(textToCopy)
          .then(function() {
            const toastEl = document.getElementById("copyToast");
            // Adjust toast theme based on AppSettings.theme
            if (AppSettings.theme === "light") {
              toastEl.classList.remove("toast-light");
              toastEl.classList.add("toast-dark");
            } else {
              toastEl.classList.remove("toast-dark");
              toastEl.classList.add("toast-light");
            }
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
          })
          .catch(function(err) {
            console.error("Copy failed:", err);
          });
      };
      rightContainer.appendChild(copyBtn);
      
      if (vital.editable && vital.type !== "list") {
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-link p-0";
        editBtn.title = (currentLang === "ar") ? "تحرير" : "Edit";
        const editImg = document.createElement("img");
        editImg.src = "images/edit.png";
        editImg.alt = "Edit";
        editImg.style.width = "20px";
        editImg.style.height = "20px";
        editBtn.appendChild(editImg);
        editBtn.onclick = function(e) {
          e.stopPropagation();
          openEditModal(vital);
        };
        rightContainer.appendChild(editBtn);
      }
      
      cardFooter.appendChild(leftContainer);
      cardFooter.appendChild(rightContainer);
      card.appendChild(cardFooter);
      
      // Make entire card clickable to navigate to vitalDetails.html
      card.style.cursor = "pointer";
      card.onclick = function() {
        sessionStorage.setItem("selectedVital", JSON.stringify(vital));
        window.location.href = "vitalDetails.html";
      };
      
      // Save vital data for drag-and-drop sorting
      card._vitalData = vital;
      
      col.appendChild(card);
      vitalsListEl.appendChild(col);
    });
    console.log("Rendered vitals HTML:", vitalsListEl.innerHTML);
  }

  // Helper: Calculate and display digital twin insights
  function calculateDigitalTwin(items) {
    const insight = currentLang === "ar"
      ? "لديك " + items.length + " مدخلات. المراجعة الدورية تساعد على الوقاية والرعاية التنبؤية."
      : "You have " + items.length + " entries. Regular review aids in preventive and predictive care.";
    const twinEl = document.getElementById("twin-insights");
    if (twinEl) {
      twinEl.textContent = insight;
      console.log("Digital twin insight set to:", insight);
    } else {
      console.error("twin-insights element not found.");
    }
  }

  // Expose renderVitals globally for external calls
  window.renderVitals = renderVitals;

  // Attach search filtering using Fuse.js
  if (searchEl && clearSearchBtn) {
    searchEl.addEventListener("input", function() {
      clearSearchBtn.style.display = (this.value.trim().length > 0) ? "block" : "none";
      if (this.value.trim().length > 0 && fuse) {
        const results = fuse.search(this.value.trim());
        const filtered = results.map(result => result.item);
        renderVitals(filtered);
      } else {
        renderVitals(vitalsDataCache);
      }
    });
    clearSearchBtn.addEventListener("click", function() {
      searchEl.value = "";
      clearSearchBtn.style.display = "none";
      renderVitals(vitalsDataCache);
    });
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
        // Ensure favorites always come first regardless of sort changes
        vitalsDataCache.sort((a, b) => (a.favorite === b.favorite) ? 0 : (a.favorite ? -1 : 1));
        console.log("Vitals data cache:", vitalsDataCache);
        fuse = new Fuse(vitalsDataCache, { keys: ["vital_key", "description"], threshold: 0.3 });
        
        document.getElementById("user-avatar").src = data.user.image;
        document.getElementById("greeting").textContent =
          (currentLang === "ar" ? LANG_AR.greeting : LANG_EN.greeting) + ", " + getTimeGreeting(currentLang) + ", " + data.user.name;
        const ageEl = document.getElementById("user-age");
        if (ageEl) {
          ageEl.textContent = (isNaN(AppSettings.age) || AppSettings.age === null)
            ? (currentLang === "ar" ? LANG_AR.age + ": N/A" : LANG_EN.age + ": N/A")
            : (currentLang === "ar" ? LANG_AR.age + ": " + AppSettings.age : LANG_EN.age + ": " + AppSettings.age);
        }
        
        renderVitals(vitalsDataCache);
        calculateDigitalTwin(vitalsDataCache);
      } catch (renderError) {
        console.error("Error processing vitals data:", renderError);
      } finally {
        if (loadingEl) loadingEl.style.display = "none";
      }
    });
  }
  
  // Helper: Time-based greeting
  function getTimeGreeting(lang) {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) return lang === "ar" ? "صباح الخير" : "Good morning";
    else if (hour < 18) return lang === "ar" ? "مساء الخير" : "Good afternoon";
    else return lang === "ar" ? "مساء الخير" : "Good evening";
  }
  
  return loadVitalsInternal().then(function() {
    console.log("loadVitalsInternal finished.");
    window.loadVitals = loadVitalsInternal;
  }).catch(function(err) {
    console.error("loadVitalsInternal error:", err);
  });
};

// Stub for toggling unit conversion between metric and converted unit.
function toggleConversion(vital, btn, valueEl) {
  if (!vital.converted) {
    vital.converted = true;
    const num = parseFloat(vital.value);
    if (!isNaN(num)) {
      vital.convertedValue = num * 2.20462; // Example: kg to lbs conversion
      vital.convertedUnit = "lbs";
    } else {
      vital.convertedValue = vital.value;
      vital.convertedUnit = vital.unit || "";
    }
  } else {
    vital.converted = false;
  }
  renderVitals(window.vitalsDataCache);
}

// Updated openEditModal for non‑list vitals using a bottom‑sheet modal with fixed height 400px,
// including Save, Cancel, and Restore Default Value buttons with validation.
function openEditModal(vital) {
  const currentLang = localStorage.getItem("lang") || "en";
  // Store original value if not already stored
  if (vital.original_value === undefined) {
    vital.original_value = vital.value;
  }
  const modalHtml = `
    <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" style="position: fixed; bottom: 0; margin: 0; width: 100%; height:400px; align-items:flex-start;">
        <div class="modal-content" style="height:100%;">
          <div class="modal-header d-flex align-items-center">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="order:-1;"></button>
            <h5 class="modal-title">${(currentLang === "ar" ? LANG_AR.edit : LANG_EN.edit)} ${(VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key}</h5>
          </div>
          <div class="modal-body">
            <p class="fw-bold">${(currentLang === "ar" ? "العنصر" : "Vital")}</p>
            <div class="mb-3">
              <label for="editVitalInput" class="form-label">${(currentLang === "ar" ? "القيمة" : "Value")}</label>
              <input type="text" class="form-control" id="editVitalInput" value="${vital.value}">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" id="restoreDefaultBtn" class="btn btn-secondary">
              ${currentLang === "ar" ? "استعادة القيمة الافتراضية" : "Restore Default"}
            </button>
            <button type="button" id="cancelEditBtn" class="btn btn-secondary" data-bs-dismiss="modal">
              ${currentLang === "ar" ? LANG_AR.cancel : LANG_EN.cancel}
            </button>
            <button type="button" id="saveEditBtn" class="btn btn-primary">
              ${currentLang === "ar" ? LANG_AR.save : LANG_EN.save}
            </button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modalEl = document.getElementById("editModal");
  const modalInstance = new bootstrap.Modal(modalEl);
  document.getElementById("saveEditBtn").onclick = function(e) {
    e.stopPropagation();
    let newValue = document.getElementById("editVitalInput").value.trim();
    if (newValue === "") {
      alert(currentLang === "ar" ? "القيمة لا يمكن أن تكون فارغة." : "Value cannot be empty.");
      return;
    }
    if (newValue.length > 100) {
      alert(currentLang === "ar" ? "يجب ألا تتجاوز القيمة 100 حرف." : "Value must be at most 100 characters.");
      return;
    }
    if (vital.type === "numeric") {
      const numVal = parseFloat(newValue);
      if (isNaN(numVal)) {
        alert(currentLang === "ar" ? "الرجاء إدخال قيمة رقمية." : "Please enter a numeric value.");
        return;
      }
      newValue = numVal;
    }
    saveVital(vital.id, newValue).then(success => {
      if (success) {
        alert(currentLang === "ar" ? "تم التحديث بنجاح." : "Update successful.");
        vital.value = newValue;
        if (typeof window.loadVitals === "function") {
          window.loadVitals();
        }
      } else {
        alert(currentLang === "ar" ? "فشل التحديث." : "Update failed.");
      }
      modalInstance.hide();
    }).catch(err => {
      console.error("Error saving vital:", err);
      alert(currentLang === "ar" ? "حدث خطأ أثناء الحفظ." : "An error occurred while saving.");
      modalInstance.hide();
    });
  };
  document.getElementById("restoreDefaultBtn").onclick = function(e) {
    e.stopPropagation();
    document.getElementById("editVitalInput").value = vital.original_value;
  };
  document.getElementById("cancelEditBtn").onclick = function() {
    modalInstance.hide();
  };
  modalEl.addEventListener('hidden.bs.modal', function() {
    modalEl.remove();
  });
  modalInstance.show();
}