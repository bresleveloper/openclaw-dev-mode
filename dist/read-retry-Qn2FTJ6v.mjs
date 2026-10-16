import { u as retryAsync } from "./src-D1BHGNTj.mjs";
//#region packages/memory-host-sdk/src/host/read-retry.ts
const TRANSIENT_MEMORY_READ_ERRNO = -11;
const TRANSIENT_MEMORY_READ_CODES = /* @__PURE__ */ new Set([
	"EAGAIN",
	"EWOULDBLOCK",
	"EDEADLK"
]);
const TRANSIENT_MEMORY_READ_MESSAGE = /Unknown system error -11\b/i;
/** Return true for transient memory read failures that should be retried. */
function isTransientMemoryReadError(error) {
	const details = error;
	const code = details?.code;
	if (typeof code === "string" && TRANSIENT_MEMORY_READ_CODES.has(code)) return true;
	if (details?.errno === TRANSIENT_MEMORY_READ_ERRNO) return true;
	return error instanceof Error && TRANSIENT_MEMORY_READ_MESSAGE.test(error.message);
}
/** Retry a memory read with the narrow transient error predicate. */
async function retryTransientMemoryRead(read, label = "memory read") {
	return await retryAsync(read, {
		attempts: 3,
		minDelayMs: 25,
		maxDelayMs: 50,
		label,
		shouldRetry: isTransientMemoryReadError
	});
}
//#endregion
export { retryTransientMemoryRead as n, isTransientMemoryReadError as t };
