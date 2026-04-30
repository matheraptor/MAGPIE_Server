/**
 * @namespace database_worker
 * @author Matheraptor
 * @version 0.20.0
 * 
 * @typedef {import("better-sqlite3").RunResult} database_result
 * 
 */
const worker = {};
worker.meta = {};
/**
 * @name thread
 * @desc 
 * 
 */
//========================================================================
// #region - THREAD
//========================================================================
const Database = require("better-sqlite3");
worker.world = new Database("./db/world.db");
/**
 * @desc Why this is a "must" for your VM:
 * - Default Mode (DELETE): Every time you write data, SQLite locks 
 * the file, waits for the disk, and deletes a journal file. This is 
 * slow and can make your Socket.io connection "stutter."
 * - WAL Mode: Writes are appended to a separate -wal file. 
 * This allows your app to read and write at the same time, which 
 * is much lighter on the CPU and keeps your 150ms latency stable 
 * even during heavy database activity.
 */
worker.world.pragma('journal_mode = WAL');
worker.world.pragma('foreign_keys = ON');
worker.server = new Database("./db/server.db");
worker.server.pragma('journal_mode = WAL');
worker.server.pragma('foreign_keys = ON');
//
worker.statementCache = new Map();
worker.ping = function ping()
{
	console.log("[DATABASE WORKER]: 'ping'");
	return "pong"
}
const { parentPort } = require("worker_threads");
parentPort?.on("message", async ({ method, args, requestID }) => {
	if(!parentPort) return
	try
	{
		if(!worker[method])
			throw new Error(`[DATABASE WORKER].${method} is invalid method`);
		const result = await worker[method](...args);
		parentPort.postMessage({ requestID, result });
	}
	catch(e)
	{
		parentPort.postMessage({ requestID, error: e.message })
	}
})
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name low-level
 * @desc 
 * 
 */
//========================================================================
// #region - LOW
//========================================================================
worker.REGISTRY = require("./index");

/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================