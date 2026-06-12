const { MAGPIE_SYSTEM } = require("../src/system")
module.exports = (io, socket) => {
    const leaveEntityRooms = () => {
        socket.rooms.forEach(room => {
            if(room.startsWith("entity_")) socket.leave(room);
        })
    };
    const { entityID } = socket.handshake.query;
    if(entityID)
    {
        socket.join(`entity_${entityID}`);
        //@todo debug entityHandler subscription
        MAGPIE_SYSTEM.log(`[SOCKET-${socket.id}] initial subscription to entity_${entityID}`, "console", false)
    }
    socket.on("subscribe_entity", (id) => {
        leaveEntityRooms();
        socket.join(`entity_${id}`);
        MAGPIE_SYSTEM.log(`[SOCKET-${socket.id}] subscribed to entity_${id}`, "console", false)
    })
    socket.on("unsubscribe_entity", () => {
        leaveEntityRooms();
        MAGPIE_SYSTEM.log(`[SOCKET-${socket.id}] unsubscribed from all entities`, "console", false)
    })
}