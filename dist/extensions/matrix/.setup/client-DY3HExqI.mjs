import { i as __exportAll } from "./doctor-contract-CsTNmbMa.mjs";
import { C as resolveMatrixRoomId } from "./send-B1Y2L4wj.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/matrix/src/matrix/actions/client.ts
var client_exports = /* @__PURE__ */ __exportAll({
	withResolvedActionClient: () => withResolvedActionClient,
	withResolvedRoomAction: () => withResolvedRoomAction,
	withStartedActionClient: () => withStartedActionClient
});
const loadMatrixActionClientRuntime = createLazyRuntimeModule(() => import("./client-bootstrap-CZvJjr29.mjs"));
async function withResolvedActionClient(opts, run, mode = "stop") {
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
