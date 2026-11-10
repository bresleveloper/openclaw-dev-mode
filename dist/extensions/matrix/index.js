import { n as registerMatrixCliMetadata } from "./.setup/cli-metadata-C60BW1oa.mjs";
import { a as setMatrixRuntimeLifecycle } from "./.setup/runtime-1kn1P6io.mjs";
import "./runtime-setter-api.js";
import { registerMatrixSubagentHooks } from "./subagent-hooks-api.js";
import { defineBundledChannelEntry } from "openclaw/plugin-sdk/channel-entry-contract";
import { runWithLocalStateMutationOwner } from "openclaw/plugin-sdk/gateway-runtime";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/matrix/index.ts
const loadMatrixHandlersRuntimeModule = createLazyRuntimeModule(() => import("./plugin-entry.handlers.runtime.js"));
function registerMatrixFullRuntime(api) {
	setMatrixRuntimeLifecycle(api.runtime, api.lifecycle);
	for (const [method, handler] of Object.entries({
		"matrix.verify.recoveryKey": "handleVerifyRecoveryKey",
		"matrix.verify.bootstrap": "handleVerificationBootstrap",
		"matrix.verify.status": "handleVerificationStatus"
	})) for (const ownerBound of [false, true]) api.registerGatewayMethod(ownerBound ? `${method}.owner` : method, async (ctx) => {
		let response;
		let assertOwnerCurrent;
		let accepted = false;
		const run = async (assertCurrent) => {
			const runtime = await loadMatrixHandlersRuntimeModule();
			assertCurrent?.();
			assertOwnerCurrent = assertCurrent;
			accepted = true;
			await runtime[handler](assertCurrent ? {
				...ctx,
				respond: (...args) => {
					response = args;
				}
			} : ctx);
		};
		if (!ownerBound && ctx.params.expectedOwnerId === void 0) {
			await run();
			return;
		}
		try {
			if (typeof ctx.params.expectedOwnerId !== "string" || !ctx.params.expectedOwnerId.trim()) throw new Error("expectedOwnerId must be a non-empty string");
			await runWithLocalStateMutationOwner(ctx.params.expectedOwnerId, ctx, run);
			assertOwnerCurrent?.();
			if (response) ctx.respond(...response);
		} catch (error) {
			ctx.respond(false, void 0, {
				code: "UNAVAILABLE",
				message: String(error),
				...!accepted ? { details: { mutationAccepted: false } } : {}
			});
		}
	});
	registerMatrixSubagentHooks(api);
}
var matrix_default = defineBundledChannelEntry({
	id: "matrix",
	name: "Matrix",
	description: "Matrix channel plugin (matrix-js-sdk)",
	importMetaUrl: import.meta.url,
	plugin: {
		specifier: "./channel-plugin-api.js",
		exportName: "matrixPlugin"
	},
	secrets: {
		specifier: "./secret-contract-api.js",
		exportName: "channelSecrets"
	},
	runtime: {
		specifier: "./runtime-setter-api.js",
		exportName: "setMatrixRuntime"
	},
	registerCliMetadata: registerMatrixCliMetadata,
	registerFull: registerMatrixFullRuntime
});
//#endregion
export { matrix_default as default, registerMatrixFullRuntime };
