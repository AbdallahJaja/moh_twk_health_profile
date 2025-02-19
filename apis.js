/* apis.js */

// Fetch vitals from mock file or API
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
        const tokenResponse = await TWK.generateToken();
        if (!tokenResponse.success) throw new Error("Token generation failed");

        const response = await fetch(`${SAVE_VITALS_API_URL}/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + tokenResponse.result.token
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