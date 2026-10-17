import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as dispatchGatewayMethodInProcessRaw } from "./server-plugin-in-process-dispatch-CakmmEh-.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { t as iteratePluginRootContributions } from "./plugin-root-contributions-DmkAOBDy.mjs";
//#region src/gateway/server-methods/mcp-app-onboarding.ts
const schema = object({
	sessionKey: string().min(1),
	agentId: string().optional(),
	pluginId: string().min(1),
	idempotencyKey: string().min(1),
	expectedLeafEntryId: string().nullable().optional()
});
/** Installation only publishes metadata. This endpoint requires an explicit user click. */
const mcpAppOnboardingHandlers = { "mcp.app.onboard": async (options) => {
	try {
		const params = schema.parse(options.params);
		const access = options.sessionAccessAuthority;
		if (!access) throw new Error("Plugin onboarding session authority is unavailable");
		access.assertCurrent();
		const requestAuthority = readGatewayRequestMutationAuthority(options);
		const metadata = getGatewayPluginMetadataSnapshot();
		if (!metadata) throw new Error("Plugin metadata is not ready");
		const find = () => [...iteratePluginRootContributions({
			metadataSnapshot: metadata,
			config: options.context.getRuntimeConfig(),
			contribution: "skills"
		})].find(({ record }) => record.id === params.pluginId)?.record;
		const plugin = find();
		if (!plugin?.onboardingSkill) throw new Error("This plugin has no packaged onboarding skill");
		const file = await (await root(plugin.rootDir)).read(plugin.onboardingSkill, {
			maxBytes: 262144,
			hardlinks: "reject",
			symlinks: "reject"
		});
		access.assertCurrent();
		if (getGatewayPluginMetadataSnapshot() !== metadata || find() !== plugin) throw new Error("Plugin onboarding availability changed");
		const result = await dispatchGatewayMethodInProcessRaw("chat.send", {
			sessionKey: access.target.sessionKey,
			agentId: access.target.agentId,
			message: "Run the setup skill for plugin " + plugin.id + ".\n\n" + file.buffer.toString("utf8"),
			idempotencyKey: params.idempotencyKey,
			...params.expectedLeafEntryId !== void 0 ? { expectedLeafEntryId: params.expectedLeafEntryId } : {},
			suppressCommandInterpretation: true
		}, {
			disableSyntheticClient: true,
			requireScopedClient: true,
			signal: options.signal,
			hasCurrentClientAuthority: options.hasCurrentClientAuthority,
			prepareDispatchCurrent: async () => access.assertCurrent(),
			sessionMutationCommitGuard: requestAuthority.assertCurrent
		});
		options.respond(result.ok, result.payload, result.error);
	} catch (error) {
		options.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : String(error)));
	}
} };
//#endregion
export { mcpAppOnboardingHandlers };
