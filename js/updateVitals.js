// js/updateVitals.js

// Global function to load vitals, render cards, and attach events
window.loadVitals = function() {
  var vitalsListEl = document.getElementById("vitals-list");
  var loadingEl = document.getElementById("loading");
  var searchEl = document.getElementById("search");
  var clearSearchBtn = document.getElementById("clearSearchBtn");
  var vitalsDataCache = [];
  var fuse = null;
  var currentLang = localStorage.getItem("lang") || "en";
  var mockFile = currentLang === "ar" ? "mock/mock_vitals_ar.json" : "mock/mock_vitals_en.json";

  // Fetch vitals (mock or real)
  function fetchVitals() {
    if (USE_MOCK) {
      console.log("Fetching mock data from '" + mockFile + "' ...");
      return fetch(mockFile)
        .then(function(response) {
          console.log("Fetch response status:", response.status);
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

  // Helper: Convert Gregorian date to Hijri (simple approximation)
  function convertToHijri(date) {
    // NOTE: Replace this stub with a robust conversion library for production.
    var gYear = date.getFullYear();
    var hYear = Math.floor((gYear - 622) * 33 / 32);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    return month + "/" + day + "/" + hYear;
  }

  // Helper: Open bottom sheet for More Info with close icon at top left
  function showMoreInfoDialog(vital) {
    var modalHtml = '<div class="modal fade" id="moreInfoModal" tabindex="-1" aria-hidden="true">' +
                      '<div class="modal-dialog" style="position: fixed; bottom: 0; margin: 0; width: 100%; min-height:250px; align-items:flex-start;">' +
                        '<div class="modal-content">' +
                          '<div class="modal-header d-flex align-items-center">' +
                            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="order:-1;"></button>' +
                            '<h5 class="modal-title">' + (currentLang === "ar" ? "مزيد من المعلومات" : "More Information") + '</h5>' +
                          '</div>' +
                          '<div class="modal-body">' + vital.more_info + '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>';
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    var modalEl = document.getElementById("moreInfoModal");
    var modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
    modalEl.addEventListener('hidden.bs.modal', function () {
      modalEl.remove();
    });
  }

  // Updated openEditModal for non‑list vitals using bottom sheet modal with validation
  function openEditModal(vital) {
    var modalHtml = '<div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">' +
      '<div class="modal-dialog" style="position: fixed; bottom: 0; margin: 0; width: 100%; min-height:250px; align-items:flex-start;">' +
        '<div class="modal-content">' +
          '<div class="modal-header d-flex align-items-center">' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="order:-1;"></button>' +
            '<h5 class="modal-title">' + ((currentLang === "ar") ? "تحرير" : "Edit") + ' ' + ((VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key) + '</h5>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="mb-3">' +
              '<label for="editVitalInput" class="form-label">' + ((currentLang === "ar") ? "القيمة" : "Value") + '</label>' +
              '<input type="text" class="form-control" id="editVitalInput" value="' + vital.value + '">' +
            '</div>' +
          '</div>' +
          '<div class="modal-footer">' +
            '<button type="button" id="cancelEditBtn" class="btn btn-secondary" data-bs-dismiss="modal">' + ((currentLang === "ar") ? "إلغاء" : "Cancel") + '</button>' +
            '<button type="button" id="saveEditBtn" class="btn btn-primary">' + ((currentLang === "ar") ? "حفظ" : "Save") + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    var modalEl = document.getElementById("editModal");
    var modalInstance = new bootstrap.Modal(modalEl);
    document.getElementById("saveEditBtn").onclick = function(e) {
      e.stopPropagation();
      var newValue = document.getElementById("editVitalInput").value.trim();
      if (newValue === "") {
        alert((currentLang === "ar") ? "القيمة لا يمكن أن تكون فارغة." : "Value cannot be empty.");
        return;
      }
      if (newValue.length > 100) {
        alert((currentLang === "ar") ? "يجب ألا تتجاوز القيمة 100 حرف." : "Value must be at most 100 characters.");
        return;
      }
      if (vital.type === "numeric") {
        var numVal = parseFloat(newValue);
        if (isNaN(numVal)) {
          alert((currentLang === "ar") ? "الرجاء إدخال قيمة رقمية." : "Please enter a numeric value.");
          return;
        }
        newValue = numVal;
      }
      saveVital(vital.id, newValue).then(function(success) {
        if (success) {
          alert((currentLang === "ar") ? "تم التحديث بنجاح." : "Update successful.");
          vital.value = newValue;
          if (typeof window.loadVitals === "function") {
            window.loadVitals();
          }
        } else {
          alert((currentLang === "ar") ? "فشل التحديث." : "Update failed.");
        }
        modalInstance.hide();
      }).catch(function(err) {
        console.error("Error saving vital:", err);
        alert((currentLang === "ar") ? "حدث خطأ أثناء الحفظ." : "An error occurred while saving.");
        modalInstance.hide();
      });
    };
    document.getElementById("cancelEditBtn").onclick = function() {
      modalInstance.hide();
    };
    modalEl.addEventListener('hidden.bs.modal', function () {
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
      var vitalName = (VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key;
      
      var col = document.createElement("div");
      col.className = "col";
      
      var card = document.createElement("div");
      card.className = "card h-100";
      card.setAttribute("data-aos", "fade-up");

      // --- Card Header ---
      var cardHeader = document.createElement("div");
      cardHeader.className = "card-header d-flex justify-content-between align-items-center";
      
      // Favorite button
      var favBtn = document.createElement("button");
      favBtn.className = "btn btn-link p-0 me-2";
      var favImg = document.createElement("img");
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
      
      // Vital title span
      var titleSpan = document.createElement("span");
      titleSpan.textContent = vitalName;
      
      // More info button (icon only) at the tail of header
      var moreInfoBtn = document.createElement("button");
      moreInfoBtn.className = "btn btn-link p-0 ms-2";
      var moreInfoImg = document.createElement("img");
      moreInfoImg.src = "images/more_info.png";
      moreInfoImg.alt = "More Info";
      moreInfoImg.style.width = "20px";
      moreInfoImg.style.height = "20px";
      moreInfoBtn.appendChild(moreInfoImg);
      moreInfoBtn.onclick = function(e) {
        e.stopPropagation();
        showMoreInfoDialog(vital);
      };
      
      // Assemble header: left side holds favorite and title, right side holds more info icon
      var headerLeft = document.createElement("div");
      headerLeft.className = "d-flex align-items-center";
      headerLeft.appendChild(favBtn);
      headerLeft.appendChild(titleSpan);
      
      cardHeader.appendChild(headerLeft);
      cardHeader.appendChild(moreInfoBtn);
      card.appendChild(cardHeader);

      // --- Card Body ---
      var cardBody = document.createElement("div");
      cardBody.className = "card-body";
      var valueEl = document.createElement("p");
      valueEl.className = "card-text";
      
      if (vital.type === "numeric") {
        // Show converted value if applicable
        if (vital.converted) {
          valueEl.textContent = vital.convertedValue + " " + vital.convertedUnit;
        } else {
          valueEl.textContent = vital.value + (vital.unit ? " " + vital.unit : "");
        }
        if (vital.unit === "kg" || vital.unit === "cm") {
          var convertBtn = document.createElement("button");
          convertBtn.className = "btn btn-link p-0 me-2";
          convertBtn.title = (currentLang === "ar") ? "تحويل الوحدات" : "Convert Units";
          var convImg = document.createElement("img");
          convImg.src = "images/convert_units.png";
          convImg.alt = "Convert Units";
          convImg.style.width = "20px";
          convImg.style.height = "20px";
          convertBtn.appendChild(convImg);
          convertBtn.onclick = function(e) {
            e.stopPropagation();
            toggleConversion(vital, convertBtn, valueEl);
          };
          // Append conversion button after the value text
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

      // --- Card Footer (Two-column layout) ---
      var cardFooter = document.createElement("div");
      cardFooter.className = "card-footer d-flex justify-content-between align-items-center";
      
      // Left container: Last Updated and Hijri button
      var leftContainer = document.createElement("div");
      leftContainer.className = "d-flex align-items-center";
      var lastUpdatedText = document.createElement("span");
      lastUpdatedText.className = "text-muted small";
      lastUpdatedText.textContent = (currentLang === "ar") ? "آخر تحديث: " : "Last Updated: ";
      var lastUpdatedDate = new Date(vital.last_updated);
      var options = { timeZone: "Asia/Riyadh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
      lastUpdatedText.textContent += lastUpdatedDate.toLocaleString(currentLang, options);
      leftContainer.appendChild(lastUpdatedText);
      
      var hijriBtn = document.createElement("button");
      hijriBtn.className = "btn btn-link p-0 ms-1";
      hijriBtn.title = (currentLang === "ar") ? "تحويل إلى التقويم الهجري" : "Convert to Hijri";
      var hijriImg = document.createElement("img");
      hijriImg.src = "images/convert_hijri.png";
      hijriImg.alt = "Convert to Hijri";
      hijriImg.style.width = "20px";
      hijriImg.style.height = "20px";
      hijriBtn.appendChild(hijriImg);
      hijriBtn.onclick = function(e) {
        e.stopPropagation();
        var hijriDate = convertToHijri(lastUpdatedDate);
        alert((currentLang === "ar") ? "التاريخ الهجري: " + hijriDate : "Hijri Date: " + hijriDate);
      };
      leftContainer.appendChild(hijriBtn);
      
      // Right container: Copy and Edit buttons with spacing
      var rightContainer = document.createElement("div");
      rightContainer.className = "d-flex align-items-center";
      
      var copyBtn = document.createElement("button");
      copyBtn.className = "btn btn-link p-0 me-2";
      copyBtn.title = (currentLang === "ar") ? "نسخ" : "Copy";
      var copyImg = document.createElement("img");
      copyImg.src = "images/copy.png";
      copyImg.alt = "Copy";
      copyImg.style.width = "20px";
      copyImg.style.height = "20px";
      copyBtn.appendChild(copyImg);
      copyBtn.onclick = function(e) {
        e.stopPropagation();
        var textToCopy;
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
            var toastEl = document.getElementById("copyToast");
            var toast = new bootstrap.Toast(toastEl);
            toast.show();
          })
          .catch(function(err) {
            console.error("Copy failed:", err);
          });
      };
      rightContainer.appendChild(copyBtn);
      
      if (vital.editable && vital.type !== "list") {
        var editBtn = document.createElement("button");
        editBtn.className = "btn btn-link p-0";
        editBtn.title = (currentLang === "ar") ? "تحرير" : "Edit";
        var editImg = document.createElement("img");
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
      
      // Save vital data for draggable sorting
      card._vitalData = vital;
      col.appendChild(card);
      vitalsListEl.appendChild(col);
    });
    console.log("Rendered vitals HTML:", vitalsListEl.innerHTML);
  }

  // Helper: Calculate and display digital twin insights
  function calculateDigitalTwin(items) {
    var insight = (currentLang === "ar")
          ? "لديك " + items.length + " مدخلات. المراجعة الدورية تساعد على الوقاية والرعاية التنبؤية."
          : "You have " + items.length + " entries. Regular review aids in preventive and predictive care.";
    var twinEl = document.getElementById("twin-insights");
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
        var results = fuse.search(this.value.trim());
        var filtered = results.map(function(result) { return result.item; });
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
        // Ensure favorites always come first
        vitalsDataCache.sort(function(a, b) {
          return (a.favorite === b.favorite) ? 0 : (a.favorite ? -1 : 1);
        });
        console.log("Vitals data cache:", vitalsDataCache);
        fuse = new Fuse(vitalsDataCache, {
          keys: ["vital_key", "description"],
          threshold: 0.3
        });
        
        document.getElementById("user-avatar").src = data.user.image;
        document.getElementById("greeting").textContent =
          (currentLang === "ar" ? LANG_AR.greeting : LANG_EN.greeting) + ", " + getTimeGreeting(currentLang) + ", " + data.user.name;
        var ageEl = document.getElementById("user-age");
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
    var now = new Date();
    var hour = now.getHours();
    if (hour < 12) {
      return lang === "ar" ? "صباح الخير" : "Good morning";
    } else if (hour < 18) {
      return lang === "ar" ? "مساء الخير" : "Good afternoon";
    } else {
      return lang === "ar" ? "مساء الخير" : "Good evening";
    }
  }
  
  return loadVitalsInternal().then(function() {
    console.log("loadVitalsInternal finished.");
    window.loadVitals = loadVitalsInternal;
  }).catch(function(err) {
    console.error("loadVitalsInternal error:", err);
  });
};

// Stub for converting Gregorian date to Hijri (simple approximation)
function convertToHijri(date) {
  var gYear = date.getFullYear();
  var hYear = Math.floor((gYear - 622) * 33 / 32);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  return month + "/" + day + "/" + hYear;
}

// Stub for toggling unit conversion
function toggleConversion(vital, btn, valueEl) {
  if (!vital.converted) {
    vital.converted = true;
    // Ensure that vital.value is numeric
    var num = parseFloat(vital.value);
    if (!isNaN(num)) {
      vital.convertedValue = num * 2.20462;
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

// Updated openEditModal for non‑list vitals using bottom sheet modal with validation
function openEditModal(vital) {
  var currentLang = localStorage.getItem("lang") || "en";
  var modalHtml = '<div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">' +
    '<div class="modal-dialog" style="position: fixed; bottom: 0; margin: 0; width: 100%; min-height:250px; align-items:flex-start;">' +
      '<div class="modal-content">' +
        '<div class="modal-header d-flex align-items-center">' +
          '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="order:-1;"></button>' +
          '<h5 class="modal-title">' + ((currentLang === "ar") ? "تحرير" : "Edit") + ' ' + ((VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][AppSettings.language]) || vital.vital_key) + '</h5>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="mb-3">' +
            '<label for="editVitalInput" class="form-label">' + ((currentLang === "ar") ? "القيمة" : "Value") + '</label>' +
            '<input type="text" class="form-control" id="editVitalInput" value="' + vital.value + '">' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" id="cancelEditBtn" class="btn btn-secondary" data-bs-dismiss="modal">' + ((currentLang === "ar") ? "إلغاء" : "Cancel") + '</button>' +
          '<button type="button" id="saveEditBtn" class="btn btn-primary">' + ((currentLang === "ar") ? "حفظ" : "Save") + '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  var modalEl = document.getElementById("editModal");
  var modalInstance = new bootstrap.Modal(modalEl);
  document.getElementById("saveEditBtn").onclick = function(e) {
    e.stopPropagation();
    var newValue = document.getElementById("editVitalInput").value.trim();
    if (newValue === "") {
      alert((currentLang === "ar") ? "القيمة لا يمكن أن تكون فارغة." : "Value cannot be empty.");
      return;
    }
    if (newValue.length > 100) {
      alert((currentLang === "ar") ? "يجب ألا تتجاوز القيمة 100 حرف." : "Value must be at most 100 characters.");
      return;
    }
    if (vital.type === "numeric") {
      var numVal = parseFloat(newValue);
      if (isNaN(numVal)) {
        alert((currentLang === "ar") ? "الرجاء إدخال قيمة رقمية." : "Please enter a numeric value.");
        return;
      }
      newValue = numVal;
    }
    saveVital(vital.id, newValue).then(function(success) {
      if (success) {
        alert((currentLang === "ar") ? "تم التحديث بنجاح." : "Update successful.");
        vital.value = newValue;
        if (typeof window.loadVitals === "function") {
          window.loadVitals();
        }
      } else {
        alert((currentLang === "ar") ? "فشل التحديث." : "Update failed.");
      }
      modalInstance.hide();
    }).catch(function(err) {
      console.error("Error saving vital:", err);
      alert((currentLang === "ar") ? "حدث خطأ أثناء الحفظ." : "An error occurred while saving.");
      modalInstance.hide();
    });
  };
  document.getElementById("cancelEditBtn").onclick = function() {
    modalInstance.hide();
  };
  modalEl.addEventListener('hidden.bs.modal', function () {
    modalEl.remove();
  });
  modalInstance.show();
}