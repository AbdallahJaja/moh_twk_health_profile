// js/editListModal.js
(function() {
  /**
   * Opens the "Edit List" modal for a list‑type vital.
   * The modal will display a dynamic list of input rows for editing the list items.
   * Each input is validated (non‑empty, max 100 characters) and the total combined length must not exceed 1000 characters.
   *
   * @param {object} vital – The vital object whose list value will be edited.
   */
  function openEditListModal(vital) {
    var currentLang = localStorage.getItem("lang") || "en";
    // Get modal elements
    var modalEl = document.getElementById("editListModal");
    var modalTitleEl = document.getElementById("editListModalLabel");
    var listContainerEl = document.getElementById("editListContainer");
    var addRowBtn = document.getElementById("addRowBtn");
    var saveBtn = document.getElementById("saveEditListBtn");
    var cancelBtn = document.getElementById("cancelEditListBtn");
    
    if (!modalEl || !modalTitleEl || !listContainerEl || !addRowBtn || !saveBtn || !cancelBtn) {
      console.error("Edit List modal elements are missing.");
      return;
    }
    
    // Set modal title (e.g., "Edit [vital name] Items")
    var vitalName = (VITALS_TRANSLATION[vital.vital_key] && VITALS_TRANSLATION[vital.vital_key][currentLang]) || vital.vital_key;
    modalTitleEl.innerHTML = (currentLang === "ar") ?
      '<img src="images/edit_list.svg" alt="Edit" style="width:20px;height:20px;margin-right:5px;"> تحرير عناصر ' + vitalName :
      '<img src="images/edit_list.svg" alt="Edit" style="width:20px;height:20px;margin-right:5px;"> Edit ' + vitalName + ' Items';
    
    // Clear any existing rows in the container
    listContainerEl.innerHTML = "";
    
    // Function to add a new input row for a list item
    function addInputRow(value) {
      var rowDiv = document.createElement("div");
      rowDiv.className = "input-group mb-2";
      
      // Label for the row (optional: show index or vital name)
      var inputLabel = document.createElement("span");
      inputLabel.className = "input-group-text";
      inputLabel.textContent = vitalName;
      
      // Create input element
      var input = document.createElement("input");
      input.type = "text";
      input.className = "form-control";
      input.placeholder = (currentLang === "ar") ? "أدخل قيمة" : "Enter value";
      input.maxLength = 100;
      input.value = value || "";
      
      // Delete button for this row
      var delBtnDiv = document.createElement("div");
      delBtnDiv.className = "input-group-append";
      var delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn btn-outline-danger";
      delBtn.innerHTML = '<img src="images/delete.svg" alt="Delete" style="width:20px;height:20px;">';
      delBtn.onclick = function() {
        rowDiv.remove();
      };
      delBtnDiv.appendChild(delBtn);
      
      rowDiv.appendChild(inputLabel);
      rowDiv.appendChild(input);
      rowDiv.appendChild(delBtnDiv);
      listContainerEl.appendChild(rowDiv);
    }
    
    // Pre-fill the modal with existing list items (if any)
    if (Array.isArray(vital.value) && vital.value.length > 0) {
      vital.value.forEach(function(item) {
        addInputRow(item);
      });
    } else {
      // If no existing items, add one blank row
      addInputRow("");
    }
    
    // Add row button: add a new blank input row
    addRowBtn.onclick = function() {
      addInputRow("");
    };
    
    // Save button: Validate and save input values
    saveBtn.onclick = function() {
      var inputs = listContainerEl.querySelectorAll("input");
      var newValues = [];
      var totalLength = 0;
      for (var i = 0; i < inputs.length; i++) {
        var val = inputs[i].value.trim();
        if (val === "") {
          alert((currentLang === "ar") ? "لا يمكن أن يكون الإدخال فارغًا." : "Empty values are not allowed.");
          return;
        }
        if (val.length > 100) {
          alert((currentLang === "ar") ? "يجب ألا يتجاوز كل إدخال 100 حرف." : "Each entry must be at most 100 characters.");
          return;
        }
        totalLength += val.length;
        newValues.push(val);
      }
      if (totalLength > 1000) {
        alert((currentLang === "ar") ? "إجمالي طول الإدخالات يجب ألا يتجاوز 1000 حرف." : "Total characters must be at most 1000.");
        return;
      }
      
      // Update the vital's value with the new list and re-render using existing function (assume renderVitalDetails is defined globally)
      vital.value = newValues;
      if (typeof renderVitalDetails === "function") {
        renderVitalDetails(vital);
      }
      
      // Hide the modal
      var modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    };
    
    // Cancel button simply hides the modal
    cancelBtn.onclick = function() {
      var modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
    };
    
    // Show the modal using Bootstrap's Modal API
    var modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
  }
  
  // Expose the function globally
  window.openEditListModal = openEditListModal;
})();