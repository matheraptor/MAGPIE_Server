/**
 *
 * @version 0.18.9
 * 
 * @changelog 
 * @version 0.18.9 2026 03 31
 * - git sync
 * 
 * @version 0.18.8 2026 03 19
 * - ADDED: telemetry ETA to target
 */
const MAGPIE = {};
MAGPIE.public = {};
MAGPIE.public.meta = {
	firmwareName: "main",
	firmwareDate: "20260319",
	version: [0,18,8],
	name: "M.A.G.P.I.E. server public access frame"
};
const params = new URLSearchParams(window.location.search);
const urlEntityID = params.get('entityID');
const socket = io(`${window.location.protocol}//${window.location.hostname}:3000`, {
    auth: {
        token: localStorage.getItem("jwt_token")
    },
	query: {
		entityID: urlEntityID
		},
    transports: ["websocket"]
});



const router = {
	go(view) {
		document.querySelectorAll('section').forEach(s => s.style.display = 'none');
		document.getElementById(`view-${view}`).style.display = 'block';
	}
};
//------------------------------------------------------------------------
//#region > inspector
//------------------------------------------------------------------------
const inspector = {
	currentID: null,
	subscribe() {
		this.unsubscribe(); // Clear previous link first
		this.currentID = Number(document.getElementById('targetID').value.trim());
		socket.emit("subscribe_entity", this.currentID);
	},
	unsubscribe() {
		if (!this.currentID) return;
		socket.emit("unsubscribe_entity", this.currentID);
		this.currentID = null;
		// Clear all spans instead of overwriting the whole div
		document.querySelectorAll('#physics-stream span').forEach(s => s.innerText = "---");
	},
	handleUpdate(data) {
		if (data.entityID !== this.currentID) return;

		// Helper function to safely update text without breaking selection
		const update = (id, value) => {
			const el = document.getElementById(id);
			if (el && el.innerText !== String(value)) {
				el.innerText = value;
			}
		};
		const C0_lat = data.coords[0]?.toFixed(10);
		const C0_lon = data.coords[1]?.toFixed(10);
		const Ct_lat = data.targetCoords[0]?.toFixed(10);
		const Ct_lon = data.targetCoords[1]?.toFixed(10);
		update('val-id', data.entityID);
		update('val-name', data.entityName);
		update('val-C0', `${C0_lat}, ${C0_lon}`)
		// update('val-lat', data.coords[0].toFixed(10));
		// update('val-lon', data.coords[1].toFixed(10));
		update('val-asl', Math.floor(data.coords[2]));
		update('val-vspeed', data.Vspeed.toFixed(3));
		update('val-knots', Math.floor(data.Vknots));
		update('val-accel', data.Acceleration?.toFixed(3));
		update('val-heading', data.Heading?.toFixed(1));
		update('val-body', data.CelestialBody);
		update('val-meta', data.metadate);
		update('val-Ct', `${Ct_lat}, ${Ct_lon}`)
		// update('val-tlat', data.targetCoords[0].toFixed(10));
		// update('val-tlon', data.targetCoords[1].toFixed(10));
		update('val-dist', Math.floor(data.distanceTo));
		update('val-eta', data.ETA);
	}
};
inspector.copyToClipboard = function copyToClipboard(buttonElement) {
	const monitor = document.getElementById("physics-stream");
	const text = monitor.innerText;
	navigator.clipboard.writeText(text).then(() => {
		// alert("Telemetry copied to clipboard!");
		const originalText = buttonElement.innerText;
		buttonElement.innerText = "Copied";
		setTimeout(() => buttonElement.innerText = originalText, 2000);
	})
}
// const myButton = document.getElementById('myEntityButton');

// myButton.addEventListener('click', () => {
//     // This uses your template to navigate to the correct page
//     window.location.href = `/?id=${entity.id}`;
// });
//#endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > socket
//------------------------------------------------------------------------
socket.on("entity_update", (data) => {
	// console.log(data);
	inspector.handleUpdate(data)
});
socket.on("connect", () => {
	console.log(`%c Connected to server! ID: ${socket.id}`, "color: green; font-weight: bold;");
	//const params = new URLSearchParams(window.location.search);
	//const entityID = params.get('entityID');
	if(urlEntityID)
	{
		const target = document.getElementById('targetID');
		if(target) target.value = urlEntityID;
		inspector.currentID = Number(urlEntityID);
		router.go("inspector");
	}
});
socket.on("connect_error", (err) => {
	console.error("Connection failed:", err.message);
	if(err.message === "unauthorized")
		console.warn("Check your JWT token or ensure Dev Mode is ON in server config")
});
socket.on("disconnect", (reason) => {
	console.warn("Disconnected from server:", reason);
});
socket.on('metastate', (data) => {
	// Update your HTML elements
	const date = data.date;
	const year = date.year;
	const month = Object.keys(data.calendar.months)[date.month - 1];
	const day = date.day.toString().padStart(2,0);
	const hour = date.hour.toString().padStart(2,0);
	const minute = date.minute.toString().padStart(2,0);
	const second = date.second.toString().padStart(2,0);
	const weekDay = data.weekDayName;
	const timestring = `Y: ${year} M: ${month} D: ${day} ${weekDay} - ${hour}:${minute}:${second}Z`
	document.getElementById('metadate').textContent = `server metadate: ${timestring}`;
});
//#endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > events
//------------------------------------------------------------------------
// Add this at the very bottom of main.js
// main.js

// Add this at the very top of your main.js
/*window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const entityID = params.get('entityID');

    if (entityID) {
        // You mentioned targeting an input and subscribing
        const target = document.getElementById('targetID');
        if (target) {
            target.value = entityID;
            if (typeof inspector !== 'undefined') {
                router.go("inspector");
				inspector.subscribe();
            }
        }
    }
});
*/
// #endregion
//========================================================================
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > login
//------------------------------------------------------------------------
async function login(username, password) 
{
	const response = await fetch("./login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ID: username, PASS: password })
	});
	const data = await response.json();
	if(response.status === 429) alert(data.error + data.message);
	if(response.status === 403) alert(data.error);
	if(response.ok) localStorage.setItem("jwt_token", data.token);
	if(response.status === 401) alert("Invalid username or password");
	else alert("Server error; please, try again later.");
}
//#endregion
//------------------------------------------------------------------------

