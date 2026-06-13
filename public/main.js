/**
 * @namespace MAGPIE_Client
 * @author Matheraptor
 * @licence GPL-3.0
 * @version 0.39.0
 * 
 */
class MAGPIE_CLIENT
{
    //
}
MAGPIE_CLIENT.meta = {
    name: "M.A.G.P.I.E. WebClient",
    desc: "",
    version: [0,39,0],
    firmwareName: "MAGPIE_Client",
    firmwareDate: "20260611"
}
MAGPIE_CLIENT.params = new URLSearchParams(window.location.search)
MAGPIE_CLIENT.pathParts = window.location.pathname.split("/")
MAGPIE_CLIENT.secure_socket = window.location.href.includes("https")
/**
 * @static 
 */
class MAGPIE_MONITOR
{
    //
}
/**
 * @static
 */
class MAGPIE_ROUTER
{
    //
}
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - SOCKET
//========================================================================
/** @type {import("socket.io-client").Socket} */
const socket = io(window.location.origin, {
    auth: {
        token: localStorage.getItem("jwt_token")
    },
    query: {
        entityID: MAGPIE_CLIENT.params.get("entityID"),
        playerID: MAGPIE_CLIENT.params.get("playerID")
    },
    transports: ["websocket", "polling"],
    secure: MAGPIE_CLIENT.secure_socket
})
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Connect
//------------------------------------------------------------------------
socket.on("connect", () => {
    console.log(`%c Connected to server! ID: ${socket.id}`, "color: green; font-weight: bold;")
    const entityID = MAGPIE_CLIENT.params.get("entityID")
    if(entityID)
    {
        const target = document.getElementById("targetID")
        if(target) target.value = entityID
        MAGPIE_CLIENT.MONITOR.currentID = Number(entityID)
        MAGPIE_ROUTER.go("monitor")
    }
})
// @todo socket.on('metastate', (data) => { 
// 	// Update your HTML elements
// 	const date = data.date;
// 	const year = date.year;
// 	const month = Object.keys(data.calendar.months)[date.month - 1];
// 	const day = date.day.toString().padStart(2,0);
// 	const hour = date.hour.toString().padStart(2,0);
// 	const minute = date.minute.toString().padStart(2,0);
// 	const second = date.second.toString().padStart(2,0);
// 	const weekDay = data.weekDayName;
// 	const timestring = `Y: ${year} M: ${month} D: ${day} ${weekDay} - ${hour}:${minute}:${second}Z`
// 	document.getElementById('metadate').textContent = `server metadate: ${timestring}`;
// });
// #endregion
//------------------------------------------------------------------------
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Entity upd
//------------------------------------------------------------------------
socket.on("entity_update", (data) => {
    MAGPIE_CLIENT.inspector.handleUpdate(data)
})
// #endregion
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
// #region - MONITOR
//========================================================================
MAGPIE_MONITOR.meta = {
    name: MAGPIE_CLIENT.meta.name + " monitor",
    desc: "",
    firmwareName: "MAGPIE_MONITOR"
}
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
// #region - ROUTER
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > go
//------------------------------------------------------------------------
MAGPIE_ROUTER.go = function routerGo(view, id = null)
{
    document.querySelectorAll("section").forEach(s => s.style.display = "none")
    const element = document.getElementById(`view-${view}`)
    if(element)
    {
        element.style.display = "block"
        console.log(`[ROUTER] Displaying: view-${view}`)
    }
    else console.error(`[ROUTER] Could not find: view-${view}`)
}
// #endregion
//------------------------------------------------------------------------
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================