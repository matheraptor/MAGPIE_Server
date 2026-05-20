const { MAGPIE_PHYSICS } = require('./core/physics');
global.MAGPIE_SYSTEM = { error: (msg, e) => console.log(msg), Utility: { isValidID: () => true } };
global.MAGPIE = {
    KEY: {
        POVART: { FWD: [0, 1, 0], UP: [0, 0, 1], RIGHT: [1, 0, 0], ARRAY: 30, P_X: 0, P_Y: 1, P_Z: 2, P_C: 3, O_YZ: 4, O_XZ: 5, O_XY: 6, O_W: 7, V_X: 8, V_Y: 9, V_Z: 10, A_X: 11, A_Y: 12, A_Z: 13, R_YZ: 14, R_XZ: 15, R_XY: 16, T_YZ: 17, T_XZ: 18, T_XY: 19, E_ID: 20 },
        STATS: { ARRAY: 0 },
        PHYSICS: { EARTH: { RADIUS: 6371008 }, G: 6.6743e-11 }
    }
};

const povart = MAGPIE_PHYSICS.initPOVART(1, 101);
MAGPIE_PHYSICS.setOrientation(povart, [0, 0, 0, 1]);
const povart2 = MAGPIE_PHYSICS.setPosition(povart, [6371008, 0, 0]);

console.log("povart:", povart.slice(0, 3));
console.log("povart2:", povart2 ? povart2.slice(0, 3) : "undefined");
const decomp = MAGPIE_PHYSICS.decomp_POVART(povart);
console.log("P0:", decomp.P0);
