import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as StateDatabaseAdmissionPendingError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { ht as readSqliteDatabaseAdmissions } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as currentSqliteOperationTiming } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/infra/sqlite-worker-database-admission-relay.ts
const REQUESTED = 0;
const GRANTED = 1;
const admissionUpstream = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionUpstream"), () => ({}));
/** A served worker relays descendant facts through its existing lifetime channel. */
function bindSqliteDatabaseAdmissionUpstream(port) {
	const current = admissionUpstream.connection;
	if (current) {
		if (current.port !== port) throw new SqliteWorkerError("SQLite admission upstream changed owner", "closed");
		return;
	}
	const connection = {
		port,
		closed: false
	};
	admissionUpstream.connection = connection;
	port.once("close", () => {
		connection.closed = true;
	});
	port.unref();
}
function getSqliteDatabaseAdmissionUpstream() {
	return admissionUpstream.connection;
}
/** Format facts use this private channel independently of transaction authority. */
function exchangeSqliteDatabaseAdmissions(port, admissions, location, create) {
	return exchangeDatabaseAdmissions(port, admissions, location, create);
}
function exchangeDatabaseAdmissions(port, admissions, location, create) {
	const { port1, port2 } = new MessageChannel();
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const timing = currentSqliteOperationTiming();
	const startedAt = Date.now();
	try {
		port.postMessage({
			kind: "sqlite-database-admissions",
			admissions,
			location,
			create,
			port: port2,
			decision: decision.buffer
		}, [port2]);
		while (Atomics.load(decision, 0) === REQUESTED) Atomics.wait(decision, 0, REQUESTED);
		const outcome = Atomics.load(decision, 0);
		if (outcome === 4 && location && create === true) throw new StateDatabaseAdmissionPendingError(location, `OpenClaw state at ${location} is undergoing schema admission; retry when it finishes.`);
		if (outcome !== GRANTED) throw new SqliteWorkerError("SQLite admission facts exchange failed", "unavailable");
		const reply = readSqliteDatabaseAdmissions(receiveMessageOnPort(port1)?.message);
		if (!reply) throw new SqliteWorkerError("SQLite admission facts reply is unavailable", "unavailable");
		return reply;
	} finally {
		if (timing) timing.databaseAdmissionWaitMs += Date.now() - startedAt;
		port1.close();
		port2.close();
	}
}
//#endregion
export { getSqliteDatabaseAdmissionUpstream as i, exchangeDatabaseAdmissions as n, exchangeSqliteDatabaseAdmissions as r, bindSqliteDatabaseAdmissionUpstream as t };
