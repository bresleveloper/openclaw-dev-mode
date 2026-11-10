import { n as __exportAll } from "./runtime-doctor-migrations-hxP-CXX7.mjs";
import { C as resolveMatrixRoomId } from "./send-BGgwE5pV.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/matrix/src/matrix/actions/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	withResolvedActionClient: () => withResolvedActionClient,
	withResolvedRoomAction: () => withResolvedRoomAction,
	withStartedActionClient: () => withStartedActionClient
});
const loadMatrixActionClientRuntime = createLazyRuntimeModule(() => import("./client-bootstrap-D1vLveT2.mjs"));
async function withResolvedActionClient(opts, run, mode = "persist") {
	const { withResolvedRuntimeMatrixClient } = await loadMatrixActionClientRuntime();
	return await withResolvedRuntimeMatrixClient(opts, run, mode);
}
async function withStartedActionClient(opts, run) {
	return await withResolvedActionClient({
		...opts,
		readiness: "started"
	}, run, "persist");
}
async function withResolvedRoomAction(roomId, opts, run) {
	return await withResolvedActionClient(opts, async (client, abortSignal) => {
		return await run(client, await resolveMatrixRoomId(client, roomId), abortSignal);
	});
}
//#endregion
export { withStartedActionClient as i, withResolvedActionClient as n, withResolvedRoomAction as r, client_exports as t };
