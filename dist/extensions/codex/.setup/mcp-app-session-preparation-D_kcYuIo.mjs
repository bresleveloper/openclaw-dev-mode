import { m as sessionBindingIdentity } from "./session-binding-record-BZB8RgcF.mjs";
import { f as readCodexRequirementsToml } from "./config-security-KAPScztc.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-BQq-CHTF.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { n as buildCodexAppServerRuntimeFingerprint, r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-BW8rd98k.mjs";
import { i as resolveCodexBindingAppServerConnection } from "./binding-connection-C-08ez1w.mjs";
import { r as resolveOpenClawExecPolicyForCodexAppServer } from "./config-0Gxk3_eq.mjs";
import { r as resolveCodexAppServerAuthProfileId } from "./auth-profile-CgHQ8Vot.mjs";
import { I as ensureCodexAppServerClientRuntime, c as getLeasedSharedCodexAppServerClient, h as releaseLeasedSharedCodexAppServerClient } from "./shared-client-r9NcV_GJ.mjs";
import { Ct as mergeCodexThreadConfigs, _t as buildCodexPluginThreadConfigInputFingerprint } from "./thread-requests-DMd-wcni.mjs";
import { s as startOrResumeThread } from "./thread-lifecycle-DGgqkt-m.mjs";
import { r as resolveCodexSessionBinding } from "./session-binding-Ce7BqiPN.mjs";
import { a as rollbackCodexAppServerBindingSubscription, r as retainCodexAppServerBindingSubscription, t as isSameCodexAppServerThreadOwner } from "./thread-ownership-B1z1lAmI.mjs";
import { n as resolveCodexPluginThreadConfigStartupPolicy, t as createCodexPluginThreadConfigStartupProvider } from "./plugin-thread-config-deadline-DTyag3sC.mjs";
import { n as applyCodexSessionPermissionPolicy } from "./session-permission-policy-BxIUJ0Zd.mjs";
import { z } from "zod";
import { loadCodexBundleMcpThreadConfig } from "openclaw/plugin-sdk/agent-harness-runtime";
import { loadExecApprovals } from "openclaw/plugin-sdk/exec-approvals-runtime";
import { buildCodexUserMcpServersThreadConfigPatchForRuntime } from "openclaw/plugin-sdk/codex-mcp-projection";
//#region extensions/codex/src/app-server/mcp-app-session-preparation.ts
/** Runs the existing thread lifecycle only. This path has no prompt or turn submission. */
async function prepareCodexMcpAppSession(params) {
	const { preparation } = params;
	if (preparation.version !== 1 || preparation.purpose !== "mcp-app") throw new Error("Unsupported native session preparation capability");
	return preparation.run(async () => {
		const input = preparation.params;
		const assertSourceCurrent = () => {
			params.assertCurrent();
			input.hostCapabilities.assertActive();
			input.abortSignal?.throwIfAborted();
		};
		assertSourceCurrent();
		const pluginConfig = readCodexPluginConfig(params.pluginConfig);
		const admitted = await resolveCodexSessionBinding({
			bindingStore: params.bindingStore,
			identity: sessionBindingIdentity(input),
			config: input.config,
			storePath: input.sessionTarget?.storePath,
			reclaimStale: true,
			signal: input.abortSignal,
			assertCurrent: assertSourceCurrent
		});
		const assertCurrent = () => {
			assertSourceCurrent();
			admitted.authority.assertLegacyCurrent();
		};
		assertCurrent();
		const prepareThread = async () => {
			const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
				permissionMode: input.permissionMode,
				execOverrides: input.execOverrides,
				approvals: input.permissionMode === "full" ? void 0 : loadExecApprovals(),
				config: input.config,
				agentId: input.agentId
			});
			const { appServer: runtimeOptions } = await resolveCodexBindingAppServerConnection({
				binding: admitted.binding,
				pluginConfig,
				execPolicy,
				modelProvider: input.provider,
				model: input.modelId,
				config: input.config,
				agentDir: input.agentDir,
				requirementsToml: readCodexRequirementsToml({}),
				openClawSandboxActive: false,
				sessionPermissionMode: input.permissionMode,
				assertCurrent
			});
			assertCurrent();
			const appServer = applyCodexSessionPermissionPolicy({
				appServer: runtimeOptions,
				pluginConfig,
				permissionMode: input.permissionMode,
				sessionRoot: input.sessionRoot,
				defaultRoot: input.workspaceDir,
				canUseAutoReview: false
			});
			const environment = input.hostCapabilities.preparedEnvironment?.();
			const startOptions = appServer.start.transport === "stdio" && !isCodexAppServerProxyLaunch(appServer.start.args) ? {
				...appServer.start,
				env: {
					...appServer.start.env,
					...environment?.credentialScrubEnv,
					...environment?.localIdentityEnv,
					...environment?.localProcessEnv
				}
			} : appServer.start;
			const authProfileId = resolveCodexAppServerAuthProfileId({
				authProfileId: input.authProfileId ?? admitted.binding?.authProfileId,
				store: input.authProfileStore,
				config: input.config
			});
			const client = await getLeasedSharedCodexAppServerClient({
				startOptions,
				pluginConfig: params.pluginConfig,
				agentId: input.agentId,
				agentDir: input.agentDir,
				config: input.config,
				authProfileStore: input.authProfileStore,
				authProfileId: admitted.binding?.connectionScope === "supervision" || appServer.start.homeScope === "user" ? null : authProfileId,
				abandonSignal: input.abortSignal,
				assertCurrent,
				timeoutMs: appServer.requestTimeoutMs
			});
			try {
				assertCurrent();
				ensureCodexAppServerClientRuntime(client, {
					agentDir: input.agentDir,
					authProfileId,
					authProfileStore: input.authProfileStore,
					config: input.config
				});
				const pluginPolicy = resolveCodexPluginThreadConfigStartupPolicy({
					pluginConfig,
					nativeToolSurfaceEnabled: true
				});
				const appCacheKey = buildCodexPluginAppCacheKey({
					appServer,
					agentDir: input.agentDir,
					authProfileId,
					appServerVersion: client.getServerVersion(),
					runtimeIdentity: client.getRuntimeIdentity()
				});
				const pluginThreadConfig = pluginPolicy.pluginThreadConfigRequired ? createCodexPluginThreadConfigStartupProvider({
					inputFingerprint: buildCodexPluginThreadConfigInputFingerprint({
						pluginConfig: pluginPolicy.pluginThreadConfigPluginConfig,
						appCacheKey
					}),
					enabledPluginConfigKeys: pluginPolicy.enabledPluginConfigKeys,
					policy: pluginPolicy.resolvedPluginPolicy,
					requestTimeoutMs: appServer.requestTimeoutMs,
					signal: input.abortSignal ?? new AbortController().signal,
					pluginConfig: pluginPolicy.pluginThreadConfigPluginConfig,
					client,
					configCwd: input.workspaceDir,
					appCacheKey
				}) : void 0;
				const bundle = await loadCodexBundleMcpThreadConfig({
					workspaceDir: input.workspaceDir,
					agentId: input.agentId,
					cfg: input.config,
					toolOverrides: input.toolOverrides
				});
				assertCurrent();
				const user = await buildCodexUserMcpServersThreadConfigPatchForRuntime(input.config, {
					agentId: input.agentId,
					agentDir: input.agentDir,
					toolOverrides: input.toolOverrides,
					allowLiteralOAuthProjection: appServer.connectionClass !== "remote"
				});
				assertCurrent();
				const modelSource = input.hostCapabilities.retainSourceAuthority?.();
				let nativeModelAdmission;
				try {
					modelSource?.assertCurrent();
					nativeModelAdmission = modelSource ? modelSource.modelPolicyRequired !== false ? "required" : "optional" : void 0;
				} finally {
					modelSource?.release();
				}
				const bundleConfig = bundle.configPatch ? z.record(z.string(), z.json()).parse(bundle.configPatch) : void 0;
				const thread = await startOrResumeThread({
					client,
					bindingStore: params.bindingStore,
					params: {
						...input,
						authProfileId
					},
					assertCurrent,
					agentId: input.agentId,
					agentDir: input.agentDir,
					cwd: input.workspaceDir,
					appServer,
					dynamicTools: [],
					nativeCodeModeEnabled: false,
					webSearchAllowed: false,
					persistentWebSearchAllowed: false,
					userMcpServersEnabled: false,
					nativeModelAdmission,
					pluginThreadConfig,
					appServerRuntimeFingerprint: buildCodexAppServerRuntimeFingerprint({
						appServer,
						appServerVersion: client.getServerVersion(),
						runtimeIdentity: client.getRuntimeIdentity()
					}),
					config: mergeCodexThreadConfigs(bundleConfig, user),
					signal: input.abortSignal
				});
				let retained = false;
				try {
					retained = await params.bindingStore.withLease(sessionBindingIdentity(input), async () => {
						assertCurrent();
						if (!isSameCodexAppServerThreadOwner(params.bindingStore.read(sessionBindingIdentity(input)), thread)) return false;
						thread.liveThreadOwnership?.assertCurrent();
						return await retainCodexAppServerBindingSubscription(client, thread.threadId, {
							release: thread.liveThreadOwnership?.release,
							configFingerprint: thread.liveThreadConfigFingerprint,
							serviceTier: thread.liveThreadOwnership?.serviceTier,
							ephemeralPolicy: thread.liveThreadEphemeralPolicy
						});
					});
					if (!retained) throw new Error("Native MCP session ownership changed before retention");
					return thread;
				} finally {
					if (!retained) {
						if (thread.liveThreadOwnership) await thread.liveThreadOwnership.release(thread.threadId);
						else await rollbackCodexAppServerBindingSubscription(client, thread.threadId, false);
					}
				}
			} finally {
				releaseLeasedSharedCodexAppServerClient(client);
			}
		};
		if (admitted.binding) return await prepareThread();
		const thread = await params.bindingStore.withLease(sessionBindingIdentity(input), async () => {
			assertCurrent();
			return params.bindingStore.read(sessionBindingIdentity(input)) ?? await prepareThread();
		});
		assertCurrent();
		return thread;
	});
}
//#endregion
export { prepareCodexMcpAppSession };
