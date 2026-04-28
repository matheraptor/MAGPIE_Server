/**
 * @name DATABASE
 * @desc 
 * 
 */
//========================================================================
// #region - DATABASE
//========================================================================
const { response } = require("express");
const { MAGPIE } = require("./index");
const { 
    MAGPIE_SYSTEM,
    MAGPIE_IO,
    MAGPIE_METASTATE,
    MAGPIE_RUNTIME,
    MAGPIE_PHYSICS
} = require("./system");

class MAGPIE_DATABASE
{
    static {
        //
    }
}
/**
 * @name Worker
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Worker
//------------------------------------------------------------------------
MAGPIE_DATABASE._pending = new Map();
MAGPIE_DATABASE.sync = require("./database_worker.js");
const { Worker } = require("worker_threads")
MAGPIE_DATABASE.worker = new Worker("./core/database_worker.js");
MAGPIE_DATABASE.call = function call(method, ...args)
{
    const requestID = Date.now() + Math.floor(Math.random() * 10000000);
    return new Promise((resolve, reject) => {
        if(this._pending.has(requestID))
            console.error("collision!");
        MAGPIE_DATABASE._pending.set(requestID, { resolve, reject });
        MAGPIE_DATABASE.worker.postMessage({ method, args, requestID });
    })
}
MAGPIE_DATABASE.worker.on("message", (response) => {
    const { requestID, result, error } = response;
    const tools = MAGPIE_DATABASE._pending.get(requestID);
    if(!tools) return;
    const { resolve, reject } = tools;
    if(error) reject(error);
    else resolve(result);
    MAGPIE_DATABASE._pending.delete(requestID);
});
MAGPIE_DATABASE.worker.on("error", (err) => console.error("[DATABASE WORKER].ERROR: ", err));
MAGPIE_DATABASE.worker.on("exit", (code) => console.log("[DATABASE WORKER].EXITED with code: ", code));
MAGPIE_DATABASE.pingWorker = async function pingWorker()
{
    const ePrefix = "[DATABASE].pingWorker";
    console.log(ePrefix + "...");
    try
    {
        const result = await MAGPIE_DATABASE.call("ping");;
        console.log(ePrefix + `: ${result}`);
    }
    catch(e)
    {
        console.error(ePrefix + ": " + e.message, e)
    }
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
module.exports = {
    MAGPIE,
    MAGPIE_SYSTEM,
    MAGPIE_IO,
    MAGPIE_METASTATE,
    MAGPIE_RUNTIME,
    MAGPIE_PHYSICS,
    MAGPIE_DATABASE: MAGPIE_DATABASE
}