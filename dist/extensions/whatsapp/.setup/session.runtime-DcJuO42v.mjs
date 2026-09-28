import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { BufferJSON, DEFAULT_CONNECTION_CONFIG, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWASocket, useMultiFileAuthState } from "baileys";
//#region extensions/whatsapp/src/session.runtime.ts
var session_runtime_exports = /* @__PURE__ */ __exportAll({
	BufferJSON: () => BufferJSON,
	createBaileysSignalRepository: () => createBaileysSignalRepository,
	fetchLatestBaileysVersion: () => fetchLatestBaileysVersion,
	makeCacheableSignalKeyStore: () => makeCacheableSignalKeyStore,
	makeWASocket: () => makeWASocket,
	useMultiFileAuthState: () => useMultiFileAuthState
});
function createBaileysSignalRepository(...args) {
	return DEFAULT_CONNECTION_CONFIG.makeSignalRepository(...args);
}
//#endregion
export { makeWASocket as a, makeCacheableSignalKeyStore as i, createBaileysSignalRepository as n, session_runtime_exports as o, fetchLatestBaileysVersion as r, useMultiFileAuthState as s, BufferJSON as t };
