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
const { MAGPIE } = require("./index");
const { 
	MAGPIE_DATE,
	MAGPIE_METASTATE,
	MAGPIE_LOG
} = require("./system")
const { MAGPIE_ENTITY } = require("./entity");
const { MAGPIE_PLAYER } = require("./player");
const { 
	MAGPIE_KEY, 
	MAGPIE_CONTEXT,
	MAGPIE_EXP 
} = require("./component");
worker.REGISTRY = {
	MAGPIE_LOG,
	MAGPIE_METASTATE,
	MAGPIE_DATE,
	MAGPIE_ENTITY,
	MAGPIE_PLAYER,
	MAGPIE_KEY,
	MAGPIE_CONTEXT,
	MAGPIE_EXP
}
/**
 * @typedef {import("better-sqlite3").Database} Database
 */
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
/**
 * @typedef {import("better-sqlite3").Statement} worker_statement
 * @type {Map<worker_statement, worker_statement>}
 */
worker.statementCache = new Map();
worker.ping = function ping()
{
	console.log("[DATABASE WORKER]: 'ping'");
	return "pong"
}
const { parentPort } = require("worker_threads");
const { table } = require("console");
const { stat } = require("fs");
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
/**
 * 
 * @param {worker_statement} cacheKey 
 * @param {worker_statement} sql 
 * @param {Database} db 
 * @returns {worker_statement}
 */
worker.getStatement = function getStatement(cacheKey, sql, db)
{
	let statement = worker.statementCache.get(cacheKey);
	if(!statement)
	{
		statement = db.prepare(sql);
		worker.statementCache.set(cacheKey, statement);
	}
	return statement
}
/**
 * @typedef {{}} statement_criteria
 * @param {Array} columns 
 * @param {statement_criteria} criteria
 * @returns {worker_statement} 
 */
worker.buildWhereClause = function buildWhereClause(columns, criteria)
{
	if(!columns || columns.length === 0) return "";
	const clauses = columns.map(col => {
		const entry = criteria[col];
		const operator = (entry && typeof entry === "object" && entry.op)
			? entry.op 
			: "=";
		return `${col} ${operator} ?`; 
	})
	return ` WHERE ${clauses.join(" AND ")}`;
}
/**
 * 
 * @param {Object} data
 * @returns {{values: String, columns: String[]}} 
 */
worker.rowSetter = function rowSetter(data)
{
	const columns = Object.keys(data);
	const values = worker._serializeValues(columns, data);
	return { values, columns }
}
worker._serializeValues = function _serializeValues(columns, data)
{
	return columns.map(col => {
		const val = data[col];
		return (val && typeof val === "object") 
			? JSON.stringify(val, this.replacer) 
			: val;
	})
}
/**
 * 
 * @param {*} key 
 * @param {*} value 
 * @returns {*}
 */
worker.replacer = function replacer(key, value)
{
	const type = Object.prototype.toString.call(value);
	if(type === "[object Float64Array]")
		return {"_firmware": "Float64Array", data: Array.from(value)}
	if(type === "[object Map]")
		return {"_firmware": "Map", data: Array.from(value.entries())}
	return value
}
/**
 * 
 * @param {*} key JSON.parse reviver key
 * @param {*} value JSON.parse reviver value
 * @returns {*} processed value
 */
worker.reviver = function reviver(key, value)
{
	if(value === null || typeof value !== "object") return value;
	const typeTag = value["_firmware"];
	if(!typeTag) return value;
	if(typeTag === "Float64Array") return new Float64Array(value.data);
	if(typeTag === "Map") return new Map(value.data);
	const ctor = worker.REGISTRY[typeTag];
	if(ctor) Object.setPrototypeOf(value, ctor.prototype);
	return value
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - LOW
//========================================================================
/**
 * @name I/O
 * @desc 
 * 
 */
//========================================================================
// #region - I/O
//========================================================================
/**
 * @name Get
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Get
//------------------------------------------------------------------------
/**
 * @desc you can pass either a Direct Value (for strict equality) 
 * or an Operator Object.
 * Operators Supported:
 * - `=` (Default)
 * - `>` (Greater than)
 * - `<` (Less than)
 * - `>=` / `<=` (Greater/Less or equal)
 * - `!=` (Not equal)
 * - `LIKE` (Pattern matching, use `%` in value)
 * @example using `%` in criteria:
 * |Criteria Object|What it finds|
 * |---|---|
 * |`{ name: { op: 'LIKE', val: 'Mag%' } }`|*Names starting with "Mag" (e.g., Magpie, Magnet)*|
 * |`{ name: { op: 'LIKE', val: '%pie' } }`|*Names ending with "pie" (e.g., Magpie, Applepie)*|
 * |`{ name: { op: 'LIKE', val: '%gpi%' } }`|*Names containing "gpi" anywhere*|
 * ```js
 * 
 * ```
 * Usage Examples
 * 
 * |Intent|criteria Object|Generated SQL Snippet|
 * |---|---|---|
 * |*Find by ID*|`{ ID: 101 }`|`WHERE ID = 101`|
 * |*Filter by Type*|`{ type: 'GUEST' }`|`WHERE type = 'GUEST'`|
 * |*Multiple Filters*|`{ type: 'GUEST', mapId: 5 }`|`WHERE type = 'GUEST' AND mapId = 5`|
 * |*Get Everything*|`{}` *(Empty Object)*|*(No `WHERE` clause)*|
 * |*operators*|`{key : {op: OP, val: VALUE}}`|`WHERE key op val`|
 * ```js
 * 
 * ```
 * @tip When using LIKE, 
 * remember that SQLite is case-insensitive for ASCII characters by default 
 * (e.g., 'mag%' will find "Magpie").
 * 
 * @param {String} tableName 
 * @param {Object} criteria 
 * @param {Database} db
 * @returns {database_result}
 */
worker.getRow = function getRow(tableName, criteria = {}, db)
{
	const columns = Object.keys(criteria).sort();
	const whereClause = this.buildWhereClause(columns, criteria);
	const sql = `SELECT * from ${tableName} ${whereClause}`;
	const statement = this.getStatement(`GET:${tableName}:${whereClause}`, sql, db);
	const values = columns.map(col => {
		const entry = criteria[col];
		return (entry && entry.op !== undefined) ? entry.val : entry;
	})
	const result = statement.all(...values);
	return result;
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name delete
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Delete
//------------------------------------------------------------------------
/**
 * 
 * @param {String} tableName 
 * @param {statement_criteria} criteria
 * @param {Database} db
 * @returns {database_result} 
 */
worker.deleteRow = function deleteRow(tableName, criteria, db)
{
	const columns = Object.keys(criteria);
	const cacheKey = `DELETE:${tableName}:${columns.join(",")}`;
	const cache = worker.statementCache;
	/** @type {worker_statement} */
	let statement = cache.get(cacheKey);
	if(!statement)
	{
		const whereClause = columns.map(col => `${col} = ?`)
			.join(" AND ");
		const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
		statement = db.prepare(sql);
		cache.set(cacheKey, statement);
	}
	const values = Object.values(criteria);
	const info = statement.run(...values);
	return (info);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name Set
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Set
//------------------------------------------------------------------------
/**
 * 
 * @param {String} tableName 
 * @param {Object[]} values 
 * @param {String[]} columns 
 * @param {Database} db
 * @returns {database_result} 
 */
worker.setRow = function setRow(tableName, values, columns, db)
{
	const columnNames = columns.join(", ");
	const placeholders = columns.map(() => "?").join(", ");
	const sql = `INSERT OR REPLACE INTO ${tableName} (${columnNames})`
		+ ` VALUES (${placeholders})`;
	const cacheKey = `SAVE:${tableName}:${columns.join(",")}`;
	const statement = worker.getStatement(cacheKey, sql, db);
	return statement.run(...values);
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name Table
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Table
//------------------------------------------------------------------------
/**
 * 
 * @param {String} tableName 
 * @param {Object} schema 
 * @param {Database} db
 * @returns {database_result} 
 */
worker.createTable = function createTable(tableName, schema, db)
{
	try
	{
		const columnDefinitions = Object.entries(schema)
			.map(([name, type]) => {
				return `${name} ${type}`;
			})
		const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
			${columnDefinitions.join(", ")}
		)`;
		const result = db.prepare(query).run();
		if(!result)
			throw new Error(`${result} is invalid result`)
		return result
	}
	catch(e)
	{
		console.error(e)
		throw e
	}
}
// #endregion
//------------------------------------------------------------------------
/**
 * @name transaction
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Trans.
//------------------------------------------------------------------------
/**
 * 
 * @param {Database} db 
 * @param {Function} callback 
 * @returns {import("better-sqlite3").Transaction}
 */
worker.makeTransaction = function makeTransaction(db, callback)
{
	const transaction = db.transaction((...args) => {
		return callback(...args);
	})
	return transaction()
}
/**
 * 
 * @param {String} tableName 
 * @param {Array[]} rows 
 * @param {String[]} columns 
 * @param {Database} db 
 */
worker.setRowTransaction = function setRowTransaction(tableName, rows, columns, db)
{
	this.makeTransaction(db, () => {
		const columnNames = columns.join(", ");
		const placeholders = columns.map(() => "?").join(", ");
		const sql = `INSER OR REPLACE INTO ${tableName} (${columnNames})`
			+ ` VALUES (${placeholders})`;
		const cacheKey = `SAVE:${tableName}:${columns.join(",")}`;
		const statement = worker.getStatement(cacheKey, sql, db);
		for(const values of rows)
		{
			statement.run(...values);
		}
	})
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
/**
 * @name Wrappers
 * @desc 
 * 
 */
//========================================================================
// #region - Wrappers
//========================================================================
/**
 * @desc helper function for "inserting" data.
 * we’ll build an Auto-Inserter. 
 * The tricky part with SQL is that the number of ? placeholders 
 * must exactly match the number of columns you are sending.
 * This function will automatically generate the INSERT INTO... 
 * string based on whatever object you pass it.
 * @sister of {@link MAGPIE_DATABASE.loadRow} and {@link MAGPIE_DATABASE.getRow}
 * @param {String} tableName - The table to save into.
 * @param {object} data - The object containing the row data.
 * @param {Database} db
 * @returns {Promise<database_result>}
 */
worker.saveRow = async function saveRow(tableName, data, db)
{
	return this.saveRowSync(tableName, data, db);
}
/**
 * 
 * @param {String} tableName 
 * @param {Object} data 
 * @param {Database} db
 * @returns {database_result} 
 */
worker.saveRowSync = function saveRowSync(tableName, data, db)
{
	const { values, columns } = this.rowSetter(data);
	const save = this.setRow(tableName, values, columns, db);
	return save
}
/**
 * 
 * @param {String} tableName 
 * @param {Object} criteria 
 * @param {Database} db 
 * @returns {database_payload}
 */
worker.loadRow = function loadRow(tableName, criteria, db)
{
	const results = worker.getRow(tableName, criteria, db);
		return this.resultsLoader(results);
}
/**
 * @typedef {Object[]} database_payload
 * @param {database_result} results
 * @returns {database_payload} 
 */
worker.resultsLoader = function resultsLoader(results)
{
	if(!results || results.length < 1) return [];
	return results.map((row) => JSON.parse(row.data, this.reviver));
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
 * @name Seams
 * @desc 
 * 
 */
//========================================================================
// #region - Seams
//========================================================================
/**
 * 
 * @param {String} tableName 
 * @param {database_payload} payload 
 * @returns {database_result}
 */
worker.saveWorldRow = function saveWorldRow(tableName, payload)
{
	return this.saveRowSync(tableName, payload, worker.world)
}
/**
 * 
 * @param {String} tableName 
 * @param {database_payload} payload 
 * @returns {database_result}
 */
worker.saveServerRow = function saveServerRow(tableName, payload)
{
	return this.saveRowSync(tableName, payload, worker.server)
}
/**
 * 
 * @param {String} tableName 
 * @param {statement_criteria} criteria 
 * @returns {database_payload}
 */
worker.loadWorldRow = function loadWorldRow(tableName, criteria)
{
	return this.loadRow(tableName, criteria, worker.world)[0]
}
/**
 * 
 * @param {String} tableName 
 * @param {statement_criteria} criteria 
 * @returns {database_payload}
 */
worker.loadServerRow = function loadServerRow(tableName, criteria)
{
	return this.loadRow(tableName, criteria, worker.server)[0]
}
/**
 * 
 * @param {String} tableName 
 * @param {statement_criteria} criteria 
 * @returns {database_result}
 */
worker.deleteWorldRow = function deleteWorldRow(tableName, criteria)
{
	return this.deleteRow(tableName, criteria, this.world)
}
/**
 * 
 * @param {String} tableName 
 * @param {statement_criteria} criteria 
 * @returns {database_result}
 */
worker.deleteServerRow = function deleteServerRow(tableName, criteria)
{
	return this.deleteRow(tableName, criteria, this.server)
}
/**
 * 
 * @param {String} tableName 
 * @param {Object} schema 
 * @returns {database_result}
 */
worker.createWorldTable = function createWorldTable(tableName, schema)
{
	return this.createTable(tableName, schema, this.world)
}
/**
 * 
 * @param {String} tableName 
 * @param {Object} schema 
 * @returns {database_result}
 */
worker.createServerTable = function createServerTable(tableName, schema)
{
	return this.createTable(tableName, schema, this.server)
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
module.exports = worker;
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// END OF FILE 
//========================================================================