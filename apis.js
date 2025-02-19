/* apis.js */

// API Endpoints
const AUTH_API_URL = "https://www.api.moh.gov.sa/v1/auth/login";
const STORAGE_KEY = "MOH_TOKEN";

// Retrieve temporary token from TWK
async function getTemporaryToken() {
    try {
        const response = await TWK.generateToken();
        if (!response.success) throw new Error("Failed to generate TWK token");
        return response.result.token;
    } catch (error) {
        console.error("Error retrieving TWK token", error);
        return null;
    }
}

// Authenticate and retrieve MOH token
async function loginByTWK() {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken) {
        return storedToken; // Return token if already stored
    }

    try {
        const twkToken = await getTemporaryToken();
        if (!twkToken) throw new Error("TWK token is null");

        const response = await fetch(AUTH_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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

// Fetch vitals from mock file
async function fetchVitals() {
    try {
        const response = await fetch("mock_vitals.json");
        return await response.json();
    } catch (error) {
        console.error("Error fetching vitals", error);
        return null;
    }
}

// Save edited vital data
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