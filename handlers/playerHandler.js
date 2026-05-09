const { MAGPIE_SYSTEM, MAGPIE_HIVE } = require("../core/system");
module.exports = (io, socket) => {
    const playerID = socket.data.playerID;
    const ePrefix = `[PLAYER-${playerID}] [SOCKET-${socket.id}]: `;

    // @todo Bind the socket to the player entity in the HIVE 
    // const playerEntity = MAGPIE_HIVE.getEntity(playerID);

    socket.on("player_action", (payload) => {
        MAGPIE_SYSTEM.log(`${ePrefix} Action received: ${payload.type}`, "console", false);
        // Delegate to the entity's internal logic
        if (playerEntity) playerEntity.processAction(payload);
    });

    socket.on("disconnect", (reason) => {
        MAGPIE_SYSTEM.log(`${ePrefix} disconnected -- ${reason}`, "console", false);
        // Clean up: Mark entity as offline in the HIVE
        if (playerEntity) playerEntity.setOnline(false);
        socket.data = {};
    });
};