/* js/appointmentsWizard.js */
document.addEventListener("DOMContentLoaded", function() {
  const steps = document.querySelectorAll(".wizard-step");
  let currentStep = 0;
  
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });
  }
  
  document.getElementById("toStep2").addEventListener("click", function() {
    currentStep = 1;
    showStep(currentStep);
  });
  
  document.getElementById("backToStep1").addEventListener("click", function() {
    currentStep = 0;
    showStep(currentStep);
  });
  
  document.getElementById("toStep3").addEventListener("click", function() {
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("appointmentTime").value;
    if (!date || !time) {
      alert("Please select a valid date and time.");
      return;
    }
    document.getElementById("appointmentSummary").textContent = `Appointment on ${date} at ${time}`;
    currentStep = 2;
    showStep(currentStep);
  });
  
  document.getElementById("backToStep2").addEventListener("click", function() {
    currentStep = 1;
    showStep(currentStep);
  });
  
  document.getElementById("confirmAppointment").addEventListener("click", function() {
    setTimeout(() => {
      document.getElementById("appointmentResult").textContent = "Appointment confirmed!";
    }, 500);
  });
});