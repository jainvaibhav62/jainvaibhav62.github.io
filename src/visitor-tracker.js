(function () {
    // =====================================================================
    // FIREBASE CONFIG — Replace with your Firebase project credentials
    // Instructions: https://console.firebase.google.com
    // =====================================================================
    const firebaseConfig = {
    apiKey: "AIzaSyCmdXcjCCPpYdYO_fdoVILyLdivrOpYF1k",
    authDomain: "vj-portfolio-c8faf.firebaseapp.com",
    databaseURL: "https://vj-portfolio-c8faf-default-rtdb.firebaseio.com",
    projectId: "vj-portfolio-c8faf",
    storageBucket: "vj-portfolio-c8faf.firebasestorage.app",
    messagingSenderId: "842450117476",
    appId: "1:842450117476:web:f6ffa6cc9c2066b00ad071",
    measurementId: "G-G6BHX50YCS"
    };

    // Don't run if config hasn't been filled in
    if (firebaseConfig.apiKey === "YOUR_API_KEY") return;

    firebase.initializeApp(firebaseConfig);
    var db = firebase.database();

    // Fetch visitor geolocation (free, no signup, HTTPS, 1000 req/day)
    fetch('https://ipapi.co/json/')
        .then(function (res) { return res.json(); })
        .then(function (geo) {
            var visit = {
                city: geo.city || 'Unknown',
                region: geo.region || 'Unknown',
                country: geo.country_name || 'Unknown',
                lat: geo.latitude || null,
                lon: geo.longitude || null,
                timezone: geo.timezone || null,
                org: geo.org || null,
                timestamp: new Date().toISOString(),
                page: window.location.pathname,
                referrer: document.referrer || 'direct',
                userAgent: navigator.userAgent
            };

            db.ref('visits').push(visit);
        })
        .catch(function () {
            // Silently fail — don't break the site if tracking fails
        });
})();
