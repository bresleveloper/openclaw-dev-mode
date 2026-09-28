import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { captureChannelReadAuthority } from "openclaw/plugin-sdk/fetch-runtime";
//#region extensions/matrix/src/matrix/client-bootstrap.ts
const loadMatrixSharedClientRuntimeDeps = createLazyRuntimeModule(() => import("./client-ChrXpxos.mjs").then((n) => n.t).then((clientModule) => ({
	acquireSharedMatrixClient: clientModule.acquireSharedMatrixClient,
	resolveMatrixAuthContext: clientModule.resolveMatrixAuthContext
})));
async function ensureResolvedClientReadiness(params) {
	if (params.readiness === "started") {
		if (params.lease) await params.lease.start();
		else await params.client.start();
		return;
	}
	if (params.readiness === "prepared" || !params.readiness && params.preparedByDefault) await params.client.prepareForOneOff();
}
async function resolveRuntimeMatrixClientWithReadiness(opts) {
	const assertCurrent = captureChannelReadAuthority();
	assertCurrent?.();
	if (opts.client) {
		await ensureResolvedClientReadiness({
			client: opts.client,
			readiness: opts.readiness,
			preparedByDefault: false
		});
		assertCurrent?.();
		return { client: opts.client };
	}
	if (!opts.cfg) throw new Error("Matrix runtime client requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Matrix runtime client");
	const { acquireSharedMatrixClient, resolveMatrixAuthContext } = await loadMatrixSharedClientRuntimeDeps();
	assertCurrent?.();
	const authContext = resolveMatrixAuthContext({
		cfg,
		accountId: opts.accountId
	});
	const lease = await acquireSharedMatrixClient({
		cfg,
		timeoutMs: opts.timeoutMs,
		accountId: authContext.accountId,
		startClient: false,
		role: "transient"
	});
	try {
		assertCurrent?.();
		await ensureResolvedClientReadiness({
			client: lease.client,
			lease,
			readiness: opts.readiness,
			preparedByDefault: true
		});
		assertCurrent?.();
	} catch (err) {
		await lease.release({ mode: "stop" });
		throw err;
	}
	return {
		client: lease.client,
		lease
	};
}
async function withResolvedRuntimeMatrixClient(opts, run, stopMode = "stop") {
	const assertCurrent = captureChannelReadAuthority();
	assertCurrent?.();
	const resolved = await resolveRuntimeMatrixClientWithReadiness(opts);
	try {
		assertCurrent?.();
		return await run(resolved.client, resolved.lease?.abortSignal);
	} finally {
		try {
			await resolved.lease?.release({ mode: stopMode });
		} finally {
			assertCurrent?.();
		}
	}
}
//#endregion
export { resolveRuntimeMatrixClientWithReadiness, withResolvedRuntimeMatrixClient };
