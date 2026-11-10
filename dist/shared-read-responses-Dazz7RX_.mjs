import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { _ as readGatewayAccessRevision } from "./operator-role-policy-Coro3qc5.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as SerializedJsonPayload } from "./serialized-json-IhaVUH2u.mjs";
import { n as withPreparedGatewayRead } from "./prepared-read-C_6yTKv-.mjs";
//#region src/gateway/shared-read-responses.ts
const owners = /* @__PURE__ */ new WeakMap();
const MAX_ENTRIES = 16;
const MAX_PAYLOAD_BYTES = 1048576;
const MAX_AGE_MS = 5e3;
/** Retire in-flight work before the event can cause a new client read. */
function invalidateSharedReadResponses(owner, event) {
	const entries = owners.get(owner);
	for (const entry of entries?.values() ?? []) if (event === void 0 || entry.sharing.shareInvalidationEvents.includes(event)) entry.retire();
}
function captureRevision(context) {
	const config = context.getRuntimeConfig();
	const policy = context.getCommittedRuntimeConfig?.();
	const access = readGatewayAccessRevision();
	const projection = getSessionRowProjection(context);
	const runners = context.workerPlacementRunnerAvailabilityReader;
	const runnerRevision = runners?.version();
	let rows = projection?.sharingRevision;
	return {
		publishRows: () => {
			rows = projection?.sharingRevision;
		},
		current: () => context.getRuntimeConfig() === config && context.getCommittedRuntimeConfig?.() === policy && readGatewayAccessRevision() === access && getSessionRowProjection(context) === projection && context.workerPlacementRunnerAvailabilityReader === runners && runners?.version() === runnerRevision && projection?.sharingRevision === rows
	};
}
function createEntry(entries, key, facts) {
	return runInDetachedAsyncContext(() => {
		const completion = createDeferredCore();
		const duration = Math.min(facts.sharing.shareMaxAgeMs, MAX_AGE_MS);
		const entry = {
			...facts,
			expires: Date.now() + duration,
			settled: completion.promise,
			settle: completion.resolve,
			retire: () => {
				clearTimeout(timer);
				if (entries.get(key) === entry) entries.delete(key);
				completion.resolve();
			}
		};
		const timer = setTimeout(entry.retire, duration);
		timer.unref();
		entries.set(key, entry);
		return entry;
	});
}
/** Share only a method-declared read, after each caller prepares its own authority. */
async function dispatchSharedRead(handler, options, sharing, assertCurrent) {
	const owner = options.context.broadcast;
	await withPreparedGatewayRead(handler, options, async (read) => {
		const deliver = (...response) => {
			assertCurrent();
			if (response[0]) {
				read.assertCurrent?.();
				read.beforeRespond?.();
			}
			(read.respond ?? options.respond)(...response);
		};
		const caller = {
			client: options.client,
			read: { shareable: read.shareable }
		};
		const shareKey = sharing.shareKey(caller, options.params);
		assertCurrent();
		if (shareKey === null) {
			await read.run(deliver);
			return;
		}
		read.assertCurrent?.();
		let entries = owners.get(owner);
		if (!entries) {
			entries = /* @__PURE__ */ new Map();
			owners.set(owner, entries);
		}
		const key = JSON.stringify([options.req.method, shareKey]);
		const existing = entries.get(key);
		const valid = (entry) => entry.handler === handler && entry.sharing.shareKey === sharing.shareKey && entries.get(key) === entry && entry.expires > Date.now() && entry.current();
		if (existing && valid(existing)) {
			await racePromiseWithAbortSignal(existing.settled, options.signal);
			if (existing.result && valid(existing) && sharing.shareKey(caller, options.params) === shareKey) deliver(...existing.result);
			else {
				assertCurrent();
				read.assertCurrent?.();
				await read.run(deliver);
			}
			return;
		}
		existing?.retire();
		for (const entry of entries.values()) if (entry.expires <= Date.now() || entries.size >= MAX_ENTRIES) entry.retire();
		const entry = createEntry(entries, key, {
			handler,
			sharing,
			...captureRevision(options.context)
		});
		try {
			await read.run((...response) => {
				assertCurrent();
				if (response[0]) {
					read.assertCurrent?.();
					entry.publishRows();
					const payload = new SerializedJsonPayload(response[1]);
					response[1] = payload;
					if (valid(entry) && payload.bytes.byteLength <= MAX_PAYLOAD_BYTES) entry.result = response;
				}
				deliver(...response);
			});
		} finally {
			if (!entry.result) entry.retire();
			entry.settle();
		}
	});
}
//#endregion
export { invalidateSharedReadResponses as n, dispatchSharedRead as t };
