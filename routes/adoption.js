/**
 * @version 0.37.0
 * 
 */
const adoption = {}
const socket = window?.socket
adoption.species_list = document.getElementById("species-list")
adoption.embryos_list = document.getElementById("embryos-list")
adoption.nav_home_button = document.getElementById("nav-home-button")
adoption.nav_species_button = document.getElementById("nav-species-button")
const router = {}
router.token = localStorage.getItem("jwt_token")
router.adopt = function(creatureID)
{
	const button = document.getElementById(`adopt-${creatureID}`)
	if(!router?.playerID)
	{
		button.innerHTML = "Login required"
		return button.onclick = "router.login()"
	}
	const message = `[SOCKET] Requesting adoption for [CREATURE-${creatureID}]...`
	console.log(message)
	button.innerHTML = "Requesting..."
	button.onclick = "" 
	socket.emit("adopt_creature_request", {
		socket: socket,
		creatureID,
		playerID: router.playerID
	})
}
router.login = function()
{
	return window.location.href = "/login.html"
}
router.onSpeciesButton = function()
{
	adoption.embryos_list.style.display = "none"
	adoption.species_list.style.display = "grid";
	adoption.nav_species_button.style.display = "none"
}
router.onSpeciesSelect = function(speciesID)
{
	adoption.species_list.style.display = "none"
	adoption.nav_species_button.style.display = "inline-block"
	adoption.embryos_list = "grid"
	socket.emit("species_embryos", {socket, speciesID})
}
socket.on("species_embryos_error", (speciesID) => {
	console.warn(`[SOCKET] unable to retrieve embryos list for [SPECIES-${specie}]`)
})
socket.on("species_embryos_empty", (speciesID) => {
	console.log(`[SOCKET] empty embryos list received for [SPECIES-${speciesID}]`)
	adoption.embryos_list.innerHTML = `<div class="table-value" style="grid-column: span 8; color: darkgreen;">no embryos</div>`
})
socket.on("species_embryos_success", (data) => {
	const { embryo_data, speciesID } = data
	console.log(`[SOCKET] ${embryo_data?.length}x embryo data received for [SPECIES-${speciesID}]`)
	const list = []
	embryo_data.forEach(data => {
		const { ID, species, growth, EVP } = data;
		
	})
	adoption.embryos_list.innerHTML
})
socket.on("adopt_creature_error", (data) => {
	console.warn(data.message)
	const button = document.getElementById(`adopt-${data.creatureID}`)
	button.innerHTML = "Error"
	button.style.background = "#af0b0b"
})
socket.on("adopt_creature_success", (data) => {
	console.log(data.message)
	const button = document.getElementById(`adopt-${data.creatureID}`)
	button.style.background = "#07ab04"
	button.innerHTML = "Checkout!"
	button.onclick = `window.location.href = '/player?playerID=${data.playerID}/slots'`
})
adoption.pushEmbryoRow = function(embryo_data)
{
	const { ID, species, growth, EVP } = embryo_data
	const growthPhase = Math.floor((1 - Math.abs(growth)) * 100)
	const button = `router.adopt(${ID})`
	const html = `
	<div class="table-value" style="grid-column: span 3;">[EMBRYO-${ID}]</div>
	<div class="table-value" style="grid-column: span 3;">${species}</div>
	<div class="table-value" style="grid-column: span 2;">${growthPhase}%</div>
	<div class="table-value">❤️${EVP}</div>
	<button id='adopt-${ID}' class="table-button" onClick=>ADOPT</button>
	`
}