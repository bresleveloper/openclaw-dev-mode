import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
//#region src/state/openclaw-agent-execution-authority.ts
const OPEN = 0;
const CLOSING = 1;
const REVOKED = 2;
const RETIRED$1 = 3;
/** Each logical owner, native generation and borrower keeps its original cell. */
var AgentDatabaseExecutionLifetime = class {
	constructor() {
		this.state = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	}
	get open() {
		return Atomics.load(this.state, 0) === OPEN;
	}
	close() {
		Atomics.compareExchange(this.state, 0, OPEN, CLOSING);
	}
	reopen() {
		Atomics.compareExchange(this.state, 0, CLOSING, OPEN);
	}
	revoke() {
		Atomics.store(this.state, 0, REVOKED);
	}
	retire() {
		Atomics.store(this.state, 0, RETIRED$1);
	}
};
function readAgentDatabaseExecutionAuthority(authority) {
	return Atomics.load(authority.logical, 0) === OPEN && Atomics.load(authority.native, 0) === OPEN && Atomics.load(authority.logical, 0) === OPEN && Atomics.load(authority.native, 0) === OPEN;
}
//#endregion
//#region src/infra/sqlite-worker-request-custody.ts
const ACTIVE = 1;
const DISPATCHED = 2;
const POST_ATTEMPTED = 4;
const CANCELED = 8;
const RETIRED = 16;
function active(state) {
	return (state & ACTIVE) !== 0 && (state & 24) === 0;
}
/** Exact buffers retain generations; request IDs never identify authority. */
function readSqliteWorkerRequestCustody(descriptor) {
	return Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0)) && Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0));
}
var SqliteWorkerSlotCustody = class {
	constructor() {
		this.state = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
		Atomics.store(this.state, 0, 1);
	}
	createRequest() {
		return new SqliteWorkerRequestCustody(this.state);
	}
	retire() {
		Atomics.store(this.state, 0, 0);
	}
};
var SqliteWorkerRequestCustody = class {
	constructor(slot) {
		this.descriptor = {
			slot,
			request: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT))
		};
	}
	activate() {
		if (Atomics.compareExchange(this.descriptor.request, 0, 0, ACTIVE) !== 0) throw new SqliteWorkerError("SQLite worker request custody was already used", "closed");
	}
	assertCurrent() {
		if (!readSqliteWorkerRequestCustody(this.descriptor)) throw new SqliteWorkerError("SQLite worker job is no longer current", "closed");
	}
	get dispatched() {
		return (Atomics.load(this.descriptor.request, 0) & DISPATCHED) !== 0;
	}
	get postAttempted() {
		return (Atomics.load(this.descriptor.request, 0) & POST_ATTEMPTED) !== 0;
	}
	accept() {
		this.assertCurrent();
		Atomics.or(this.descriptor.request, 0, DISPATCHED);
	}
	post() {
		Atomics.or(this.descriptor.request, 0, POST_ATTEMPTED);
	}
	cancel() {
		if (!this.dispatched) Atomics.or(this.descriptor.request, 0, CANCELED);
	}
	retire() {
		Atomics.or(this.descriptor.request, 0, RETIRED);
	}
};
//#endregion
export { readAgentDatabaseExecutionAuthority as i, readSqliteWorkerRequestCustody as n, AgentDatabaseExecutionLifetime as r, SqliteWorkerSlotCustody as t };
