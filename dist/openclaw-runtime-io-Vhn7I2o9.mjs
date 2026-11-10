import "./utils-gjJ-tD2q.mjs";
import { u as retryAsync } from "./src-Bzfi3cQM.mjs";
import "./subsystem-mStysHHC.mjs";
import "./sqlite-wal-D2XTertL.mjs";
import "./fs-safe-6Z4UiMS4.mjs";
import "./mime-C3j3dfQb.mjs";
import "./run-with-concurrency-Dtu208ef.mjs";
//#region packages/memory-host-sdk/src/host/read-retry.ts
const TRANSIENT_MEMORY_READ_ERRNO = -11;
const TRANSIENT_MEMORY_READ_CODES = /* @__PURE__ */ new Set([
	"EAGAIN",
	"EWOULDBLOCK",
	"EDEADLK"
]);
const TRANSIENT_MEMORY_READ_MESSAGE = /Unknown system error -11\b/i;
/** Retry a memory read with the narrow transient error predicate. */
async function retryTransientMemoryRead(read, label = "memory read") {
	return await retryAsync(read, {
		attempts: 3,
		minDelayMs: 25,
		maxDelayMs: 50,
		label,
		shouldRetry: (error) => {
			const details = error;
			const code = details?.code;
			return typeof code === "string" && TRANSIENT_MEMORY_READ_CODES.has(code) || details?.errno === TRANSIENT_MEMORY_READ_ERRNO || error instanceof Error && TRANSIENT_MEMORY_READ_MESSAGE.test(error.message);
		}
	});
}
//#endregion
export { retryTransientMemoryRead as t };
