/* settings.js */
const AppSettings = {
  theme: "light",
  language: "en",
  textDirection: "ltr",
  init: function () {
    TWK.getDeviceInfo()
      .then((deviceInfo) => {
        AppSettings.theme = deviceInfo.theme || "light";
        AppSettings.language = deviceInfo.language || "en";
        AppSettings.textDirection = AppSettings.language === "ar" ? "rtl" : "ltr";

        document.body.classList.add(AppSettings.theme);
        document.body.dir = AppSettings.textDirection;
      })
      .catch((err) => console.error("Error fetching device info", err));
  }
};

document.addEventListener("DOMContentLoaded", AppSettings.init);
