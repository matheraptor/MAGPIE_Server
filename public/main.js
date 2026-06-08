/**
 *
 * @version 0.32.0
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
const urlPlayerID = params.get("playerID")
const pathParts = window.location.pathname.split("/")
const socket = io(window.location.origin, {
    auth: {
        token: localStorage.getItem("jwt_token")
    },
	query: {
		entityID: urlEntityID,
		playerID: urlPlayerID
		},
    transports: ["websocket", "polling"],
	secure: true
});
const router = {}
router.go = function(view, id = null) 
{
    // 1. Hide all sections
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    
    // 2. Select the specific element
    const viewEl = document.getElementById(`view-${view}`);
    
    // 3. Debugging: Check if it's found
    if(viewEl) 
	{
        viewEl.style.display = "block"; // Make the section visible
        console.log(`[ROUTER] Displaying: view-${view}`);
    } 
	else console.error(`[ROUTER] Could not find: view-${view}`);
}
router.addTableRow = function addTableRow(data) 
{
	const list = document.getElementById(data.tableID)
	const row = document.createElement("div")
	row.className = "table-row"
	row.innerHTML = `
		<div class="table-value">${data?.id}</div>
		<div class="table-value">${data?.species}</div>
		<div class="table-value">${data?.cost}</div>
		<div class="table-value">${data?.status}</div>
		<button class="table-button">${data?.button}</button>
	`
	list.appendChild(row)
}
if(urlPlayerID)
	router.go("player", playerID)
/**
 * 
 */
router.login = async function()
{
	const email = document.getElementById('login-email').value
	const pass = document.getElementById('login-password').value
	const response = await fetch("/login", {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, pass })
	})
	const data = await response.json()
	if(response.ok) 
	{
		console.log("Login successful. Token: ", data.token)
		localStorage.setItem("token", data.token)
	}
	else
		alert("Login failed: " + data.error)
}
//------------------------------------------------------------------------
//#region > inspect
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
		update('val-Vmag', data.Vmag.toFixed(3));
		update('val-knots', Math.floor(data.Vknots));
		if(!isNaN(data?.Amag))
			update('val-Amag', data.Amag?.toFixed(3));
		update("val-Tmag", data.Tmag?.toFixed(3));
		update("val-Rmag", data.Rmag.toFixed(3));
		update("val-states", data.states);
		if(data?.dR_mag && !isNaN(data.dR_mag))
			update("val-dR_mag", Number(data.dR_mag)?.toFixed(3));
		if(Number(data?.heading))
			update('val-heading', data.heading?.toFixed(1));
		if(Number(data?.pitch))
			update("val-pitch", data.pitch?.toFixed(1));
		if(Number(data?.roll))
			update("val-roll", data?.roll?.toFixed(1));
		update('val-body', data.CelestialBody);
		update('val-meta', data.metadate);
		update("val-targetID", data?.targetID);
		update("val-targetName", data?.targetName);
		update('val-Ct', `${Ct_lat}, ${Ct_lon}`)
		// update('val-tlat', data.targetCoords[0].toFixed(10));
		// update('val-tlon', data.targetCoords[1].toFixed(10));
		update('val-dist', Math.floor(data.distanceTo));
		update('val-eta', data.ETA);
		//
		if(data?.dR && data.dR.every(n => !isNaN(n)))
			update("val-dR", data.dR);
		if(data?.Bdist && data.Bdist.every(n => !isNaN(n)))
			update("val-Bdist", data.Bdist)
		if(data?.R1)
			update("val-R1", data.R1);
		if(data?.T1)
			update("val-T1", data.T1);
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
socket.on("sync_player_data", (data) => {
	const container = document.getElementById("player-slots-container")
	container.innerHTML = ""
	data.slots.forEach(slot => {
		addTableRow(slot)
	})
})
socket.on("player_connected", (player_data) => {
	MAGPIE.public.player = {
		ID: player_data.ID,
		username: player_data.username,
		email: player_data.email,
		isFrozen: player_data.isFrozen,
		EVP: player_data.EVP,
		CLOUT: player_data.CLOUT,
		creatureID: player_data.creatureID,
		slots: player_data.slots,
		updated: player_data.updated,
		status: player_data.status
	}
	router.go("view-player")
})
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

// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - ACCOUNT
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Verify
//------------------------------------------------------------------------

// #endregion
//------------------------------------------------------------------------
/**
 * 
 * 
 */
//------------------------------------------------------------------------
//#region > login
//------------------------------------------------------------------------
router.token = localStorage.getItem("jwt_token")
//#endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - ADOPTION
//========================================================================
router.onAdoption = function() {
    console.log("[ROUTER] Switching to Adoption store view...")
    router.go('adoption'); // No window.location.href!
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================