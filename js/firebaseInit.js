(function() {
  // Load Firebase App (compat) first
  var firebaseScript = document.createElement('script');
  firebaseScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js";
  firebaseScript.onload = function() {
    // Now load Analytics
    var analyticsScript = document.createElement('script');
    analyticsScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics-compat.js";
    analyticsScript.onload = function() {
      // Load Crashlytics
      var crashlyticsScript = document.createElement('script');
      crashlyticsScript.src = "https://www.gstatic.com/firebasejs/9.22.0/firebase-crashlytics-compat.js";
      crashlyticsScript.onload = function() {
        // Your Firebase configuration (replace placeholders with your actual config)
        const firebaseConfig = {
          apiKey: "AIzaSyDT4tYWgX2Id0ffvswwBQ9rFOvut9QNQXY",
          authDomain: "mohtwk-ebf40.firebaseapp.com",
          projectId: "mohtwk-ebf40",
          storageBucket: "mohtwk-ebf40.firebasestorage.app",
          messagingSenderId: "914599976221",
          appId: "1:914599976221:web:a31611a3935cf4b70855f4",
          measurementId: "G-TL9YGEZ7BZ"
        };
        
        // Initialize Firebase App
        firebase.initializeApp(firebaseConfig);
        // Initialize Analytics and Crashlytics
        firebase.analytics();
        firebase.crashlytics();
        console.log("Firebase initialized successfully.");
      };
      document.head.appendChild(crashlyticsScript);
    };
    document.head.appendChild(analyticsScript);
  };
  document.head.appendChild(firebaseScript);
})();