// const socket = io();

// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         socket.emit('send-location', { latitude, longitude });
//     }, (error) => {
//         console.log(error);
//     },
//         {
//             enableHighAccuracy: true,
//             maximumAge: 0,
//             timeout: 5000,
//         })
// }

// const map = L.map("map").setView([0, 0], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "Kargokart"
// }).addTo(map)

// const markers = {}

// socket.on('receive-location', (data) =>{
//     const {id, latitude, longitude} = data;
//     map.setView([latitude, longitude], 16);

//     if(markers[id]){
//         markers[id].setLatLng([latitude, longitude]);
//     }
//     else{
//         markers[id] = L.marker([latitude, longitude]).addTo(map);
//     }
// })

// socket.on("user-disconnected", (id) =>{
//     if(markers[id]){
//         map.removeLayer(markers[id]);
//         delete markers[id];
//     }
// })


const socket = io("https://location-tracker-2-production.up.railway.app");  // Use your deployed app URL

// Geolocation tracking
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error) => {
        console.error("Geolocation error:", error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
    });
}

// Initialize map
const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Location Tracker"
}).addTo(map);

// Object to manage markers for each client
const markers = {};

// Get the unique device ID
let deviceId;

// Receive unique ID from the server
socket.on("assign-id", (data) => {
    deviceId = data.id;
    console.log("Assigned Device ID:", deviceId);
});

// Receive and update location
socket.on('receive-location', (data) => {
    const { id, latitude, longitude } = data;
    console.log(`Received location from ${id}:`, data);

    // If the data id matches the current device's id, update the marker for this device
    if (id === deviceId) {
        map.setView([latitude, longitude], 16);
    }

    // Create or update marker for other devices
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
    console.log(`User disconnected: ${id}`);
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
