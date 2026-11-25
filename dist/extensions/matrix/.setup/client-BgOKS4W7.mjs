import { n as __exportAll } from "./runtime-doctor-migrations-CSvRANPN.mjs";
import { w as resolveMatrixRoomId } from "./send-COg4UAcR.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
// extensions/matrix/src/matrix/actions/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	withResolvedActionClient: () => withResolvedActionClient,
	withResolvedRoomAction: () => withResolvedRoomAction,
	withStartedActionClient: () => withStartedActionClient
});
const loadMatrixActionClientRuntime = createLazyRuntimeModule(() => import("./client-bootstrap-CHs5OQ1Z.mjs"));
async function withResolvedActionClient(opts, run) {
	const { withResolvedRuntimeMatrixClient } = await loadMatrixActionClientRuntime();
	return await withResolvedRuntimeMatrixClient(opts, run);
}
async function withStartedActionClient(opts, run) {
	return await withResolvedActionClient({
		...opts,
		readiness: "started"
	}, run);
}
async function withResolvedRoomAction(roomId, opts, run) {
	return await withResolvedActionClient(opts, async (client, abortSignal) => {
		return await run(client, await resolveMatrixRoomId(client, roomId), abortSignal);
	});
}
export { withStartedActionClient as i, withResolvedActionClient as n, withResolvedRoomAction as r, client_exports as t };
