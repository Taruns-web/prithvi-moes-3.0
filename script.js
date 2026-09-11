// ===============================
// PRITHVI WEBSITE JAVASCRIPT
// ===============================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


// ===============================
// THEME TOGGLE
// ===============================

const themeBtn = $("#themeBtn");

if (themeBtn) {
    const savedTheme = localStorage.getItem("prithviTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeBtn.textContent = "☀️";
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        const isLightMode =
            document.body.classList.contains("light-mode");

        themeBtn.textContent = isLightMode ? "☀️" : "🌙";

        localStorage.setItem(
            "prithviTheme",
            isLightMode ? "light" : "dark"
        );
    });
}


// ===============================
// SEARCH
// ===============================

const searchBtn = $("#searchBtn");
const searchInput = $("#searchInput");

function performSearch() {
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();

    if (
        query.includes("dashboard") ||
        query.includes("weather")
    ) {
        window.location.href = "dashboard.html";
    }
    else if (
        query.includes("hazard") ||
        query.includes("cyclone") ||
        query.includes("earthquake")
    ) {
        window.location.href = "hazards.html";
    }
    else if (query.includes("mission")) {
        window.location.href = "mission.html";
    }
    else if (
        query.includes("service") ||
        query.includes("ocean") ||
        query.includes("climate")
    ) {
        window.location.href = "services.html";
    }
    else {
        alert(
            "Please search for Dashboard, Hazards, Mission or Services."
        );
    }
}

if (searchBtn) {
    searchBtn.addEventListener("click", performSearch);
}

if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
}


// ===============================
// INDIA MAP DATA
// ===============================

let indiaMap = null;
let mapMarkers = [];

const hazardData = {
    Weather: [
        {
            name: "New Delhi",
            lat: 28.6139,
            lng: 77.2090,
            info: "Temperature monitoring"
        },
        {
            name: "Mumbai",
            lat: 19.0760,
            lng: 72.8777,
            info: "Coastal weather monitoring"
        },
        {
            name: "Chennai",
            lat: 13.0827,
            lng: 80.2707,
            info: "Coastal weather monitoring"
        }
    ],

    Cyclone: [
        {
            name: "Bay of Bengal",
            lat: 15.0,
            lng: 87.0,
            info: "Cyclone monitoring zone"
        },
        {
            name: "Odisha Coast",
            lat: 19.8,
            lng: 85.8,
            info: "Coastal storm monitoring"
        }
    ],

    Earthquake: [
        {
            name: "Himalayan Region",
            lat: 30.5,
            lng: 79.0,
            info: "Seismic monitoring region"
        },
        {
            name: "Gujarat",
            lat: 23.0,
            lng: 71.5,
            info: "Seismic monitoring region"
        }
    ],

    Rainfall: [
        {
            name: "Mumbai",
            lat: 19.0760,
            lng: 72.8777,
            info: "Rainfall monitoring"
        },
        {
            name: "Kolkata",
            lat: 22.5726,
            lng: 88.3639,
            info: "Rainfall monitoring"
        }
    ],

    Heatwave: [
        {
            name: "Rajasthan",
            lat: 27.0,
            lng: 73.0,
            info: "Heat-risk monitoring"
        },
        {
            name: "Delhi NCR",
            lat: 28.6,
            lng: 77.2,
            info: "Heat-risk monitoring"
        }
    ],

    Tsunami: [
        {
            name: "Andaman and Nicobar",
            lat: 11.7,
            lng: 92.7,
            info: "Coastal hazard monitoring"
        },
        {
            name: "Indian Ocean",
            lat: 8.0,
            lng: 80.0,
            info: "Ocean monitoring"
        }
    ]
};


// ===============================
// UPDATE MAP MARKERS
// ===============================
// ===============================
// UPDATE HAZARD MARKERS
// ===============================

function updateHazardMarkers(hazardName) {
    if (!indiaMap) return;

    // Purane markers remove karo
    mapMarkers.forEach((marker) => {
        indiaMap.removeLayer(marker);
    });

    mapMarkers = [];

    const selectedData =
        hazardData[hazardName] || hazardData.Weather;

    selectedData.forEach((point) => {
        const marker = L.marker([
            point.lat,
            point.lng
        ])
            .addTo(indiaMap)
            .bindPopup(
                `<strong>${point.name}</strong><br>${point.info}`
            );

        mapMarkers.push(marker);
    });
}


// ===============================
// INITIALIZE INDIA MAP
// ===============================

function initIndiaMap() {
    const mapElement = document.getElementById("indiaLiveMap");

    if (!mapElement) {
        console.log("Map container nahi mila.");
        return;
    }

    if (typeof L === "undefined") {
        console.error("Leaflet library load nahi hui.");

        mapElement.innerHTML = `
            <p style="color:white;padding:20px;">
                Map load nahi hua. Internet connection check karein.
            </p>
        `;

        return;
    }

    // Map dobara initialize na ho
    if (indiaMap !== null) return;

    indiaMap = L.map("indiaLiveMap").setView(
        [22.5937, 78.9629],
        5
    );

    // Satellite/photo type map
    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            maxZoom: 18,
            attribution:
                "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics"
        }
    ).addTo(indiaMap);

    // Default alerts
    updateHazardMarkers("Weather");

    setTimeout(() => {
        indiaMap.invalidateSize();
    }, 700);
}


// ===============================
// HAZARD BUTTONS
// ===============================

$$("[data-hazard]").forEach((button) => {
    button.addEventListener("click", () => {
        const hazardName = button.dataset.hazard;

        updateHazardMarkers(hazardName);

        $$(".hazard-btn").forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
});


// ===============================
// AI CHAT
// ===============================

// =====================================
// AI PRITHVI CHATBOT
// =====================================

const aiInput = document.querySelector("#aiInput");
const aiSend = document.querySelector("#aiSend");
const aiMessages = document.querySelector("#aiMessages");

const suggestionButtons =
    document.querySelectorAll(".suggestion-btn");

function addAIMessage(text, type) {
    if (!aiMessages) return;

    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "ai-message user-message"
            : "ai-message bot-message";

    const icon = type === "user" ? "👤" : "🌍";

    message.innerHTML = `
        <div class="message-icon">${icon}</div>
        <div>${text}</div>
    `;

    aiMessages.appendChild(message);

    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function getAIResponse(question) {
    const q = question.toLowerCase();

    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("namaste")
    ) {
        return "Namaste! Main AI Prithvi hoon. Aap Earth, weather aur natural hazards ke baare mein pooch sakte hain.";
    }

    if (
        q.includes("weather") ||
        q.includes("mausam") ||
        q.includes("temperature")
    ) {
        return "Weather mein temperature, rainfall, wind aur atmospheric conditions ki information hoti hai. Accurate updates ke liye official weather alerts check karein.";
    }

    if (
        q.includes("cyclone") ||
        q.includes("toofan")
    ) {
        return "Cyclone ek powerful rotating storm hota hai. Cyclone ke time ghar ke andar rahein, coastal areas se door rahein aur official alerts follow karein.";
    }

    if (
        q.includes("earthquake") ||
        q.includes("bhukamp")
    ) {
        return "Earthquake ke waqt Drop, Cover and Hold follow karein. Windows aur heavy objects se door rahein.";
    }

    if (
        q.includes("rain") ||
        q.includes("rainfall") ||
        q.includes("barish")
    ) {
        return "Rainfall monitoring se heavy rain aur flood risk ko samajhne mein help milti hai. Heavy rainfall ke time low-lying areas se bachkar rahein.";
    }

    if (
        q.includes("mission mausam") ||
        q.includes("mission")
    ) {
        return "Mission Mausam ka aim India ko weather-ready aur climate-smart banana hai. Ismein advanced observations, forecasting, AI/ML aur early-warning systems par focus kiya jaata hai.";
    }

    if (
        q.includes("ocean") ||
        q.includes("samundar") ||
        q.includes("wave")
    ) {
        return "Ocean monitoring se waves, sea conditions, coastal hazards aur marine activities ke liye useful information milti hai.";
    }

    if (
        q.includes("climate") ||
        q.includes("jalvayu")
    ) {
        return "Climate long-term weather patterns ko describe karta hai. Climate data se temperature, rainfall aur environmental changes ko samjha jaata hai.";
    }

    if (
        q.includes("help") ||
        q.includes("kya kar")
    ) {
        return "Main weather, cyclone, earthquake, rainfall, ocean, climate aur Mission Mausam se related basic questions ka answer de sakta hoon.";
    }

    return "Mujhe is question ka exact answer nahi pata, lekin aap weather, cyclone, earthquake, rainfall, ocean, climate ya Mission Mausam ke baare mein pooch sakte hain.";
}

function sendAIMessage() {
    if (!aiInput || !aiMessages) return;

    const question = aiInput.value.trim();

    if (question === "") return;

    addAIMessage(question, "user");

    aiInput.value = "";

    // Typing indicator
    const typing = document.createElement("div");
    typing.className = "ai-message bot-message";
    typing.id = "typingMessage";

    typing.innerHTML = `
        <div class="message-icon">🌍</div>
        <div>AI Prithvi is thinking...</div>
    `;

    aiMessages.appendChild(typing);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    setTimeout(() => {
        const typingMessage = document.querySelector(
            "#typingMessage"
        );

        if (typingMessage) {
            typingMessage.remove();
        }

        const response = getAIResponse(question);

        addAIMessage(response, "bot");
    }, 700);
}

if (aiSend) {
    aiSend.addEventListener("click", sendAIMessage);
}

if (aiInput) {
    aiInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendAIMessage();
        }
    });
}

// Suggestion buttons
suggestionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!aiInput) return;

        aiInput.value = button.textContent.trim();
        sendAIMessage();
    });
});

// ===============================
// NAVBAR SCROLL EFFECT
// ===============================

window.addEventListener("scroll", () => {
    const navbar = $(".navbar");

    if (navbar) {
        navbar.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );
    }
});


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    initIndiaMap();

    setTimeout(() => {
        if (indiaMap) {
            indiaMap.invalidateSize();
        }
    }, 1000);
});