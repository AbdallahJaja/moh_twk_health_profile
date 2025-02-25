/* js/apis.js */

// Retrieves a temporary token from TWK
async function getTemporaryToken() {
  try {
    // const response = await TWK.generateToken();
    // if (!response.success) throw new Error("Failed to generate TWK token");
    // return response.result.token;
    return ""
  } catch (error) {
    console.error("Error retrieving TWK token", error);
    return null;
  }
}

// Logs in via TWK to get the MOH bearer token; caches it in localStorage
async function loginByTWK() {
  const storedToken = localStorage.getItem(STORAGE_KEY);
  if (storedToken) return storedToken;
  try {
    const twkToken = await getTemporaryToken();
    if (!twkToken) throw new Error("TWK token is null");
    const response = await fetch(AUTH_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temp_token: twkToken })
    });
    const data = await response.json();
    if (!data.success) throw new Error("MOH authentication failed");
    localStorage.setItem(STORAGE_KEY, data.token);
    return data.token;
  } catch (error) {
    console.error("Error during authentication", error);
    return null;
  }
}

// Fetches vitals: if USE_MOCK is true, load mock_vitals.json; otherwise, call real API
async function fetchVitals() {
  if (USE_MOCK) {
    try {
      const response = await fetch("js/mock_vitals.json");
      return await response.json();
    } catch (error) {
      console.error("Error fetching mock vitals", error);
      return null;
    }
  } else {
    try {
      const token = await loginByTWK();
      const response = await fetch(VITALS_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching vitals from API", error);
      return null;
    }
  }
}

// Fetches visits: if USE_MOCK is true, load mock_visits.json; otherwise, call real API
async function fetchVisits() {
  if (USE_MOCK) {
    try {
      const response = await fetch("mock_visits.json");
      return await response.json();
    } catch (error) {
      console.error("Error fetching mock visits", error);
      return null;
    }
  } else {
    try {
      const token = await loginByTWK();
      const response = await fetch(VISITS_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching visits from API", error);
      return null;
    }
  }
}

// Saves an edited vital using the MOH token in the Authorization header
async function saveVital(id, newValue) {
  try {
    const mohToken = await loginByTWK();
    if (!mohToken) throw new Error("MOH token not available");
    const response = await fetch(`${SAVE_VITALS_API_URL}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mohToken}`
      },
      body: JSON.stringify({ value: newValue })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error saving vital", error);
    return false;
  }
}