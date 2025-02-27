/* js/settings.js */
window.AppSettings = window.AppSettings || {
  theme: "light",
  language: localStorage.getItem("lang") || "en",
  textDirection: "ltr",
  age: null,
  init: function() {
    // TWK.getDeviceInfo()
    //   .then((deviceInfo) => {
        AppSettings.theme ="dark" ;//deviceInfo.theme || "light";
        AppSettings.language = localStorage.getItem("lang") || "en";//deviceInfo.language || "en";
        AppSettings.textDirection = AppSettings.language === "ar" ? "rtl" : "ltr";
        document.body.classList.add(AppSettings.theme);
        document.body.dir = AppSettings.textDirection;
      // })
      // .catch((err) => console.error("Error fetching device info", err));
    
    // TWK.getUserBirthDate()
    //   .then((response) => {
    //     if (response.success && response.result) {
          const birthDate = new Date("08/17/1986");
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          AppSettings.age = age;
      //   }
      // })
      // .catch((err) => console.error("Error fetching user birth date", err));
  }
};

document.addEventListener("DOMContentLoaded", AppSettings.init);