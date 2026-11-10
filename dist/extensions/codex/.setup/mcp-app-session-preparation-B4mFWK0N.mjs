import { g as sessionBindingIdentity } from "./session-binding-record-BXXjih0v.mjs";
import { d as readCodexRequirementsToml } from "./config-security-BxV4sSRz.mjs";
import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { i as withCodexAppServerGitConfig } from "./transport-stdio-DeNmLOea.mjs";
import { n as buildCodexAppServerRuntimeFingerprint, r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-CKBEird9.mjs";
import { i as resolveCodexBindingAppServerConnection } from "./binding-connection-aU49tL0m.mjs";
import { r as resolveOpenClawExecPolicyForCodexAppServer } from "./config-DEC5R1wk.mjs";
import { r as resolveCodexAppServerAuthProfileId } from "./auth-profile-auwzSwwy.mjs";
import { A as ensureCodexAppServerClientRuntime, o as getLeasedSharedCodexAppServerClient, p as releaseLeasedSharedCodexAppServerClient } from "./shared-client-BEHXwqz5.mjs";
import { d as mergeCodexThreadConfigs } from "./project-doc-thread-config-CH6QVPwq.mjs";
import { i as resolveCodexSessionBinding } from "./session-binding-2ihjGcI_.mjs";
import { a as rollbackCodexAppServerBindingSubscription, r as retainCodexAppServerBindingSubscription, t as isSameCodexAppServerThreadOwner } from "./thread-ownership-D2aUUPS_.mjs";
import { c as resolveCodexPluginThreadConfigStartupPolicy, s as prepareCodexPluginThreadConfigStartupProvider, t as startOrResumeThread } from "./thread-lifecycle-run-CPhQIZC-.mjs";
import { n as applyCodexSessionPermissionPolicy } from "./session-permission-policy-DRL1P1o8.mjs";
import { z } from "zod";
import { loadCodexBundleMcpThreadConfig } from "openclaw/plugin-sdk/agent-harness-runtime";
import { loadExecApprovalsReadOnlyAsync } from "openclaw/plugin-sdk/exec-approvals-runtime";
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
		using _ = { [Symbol.dispose]: admitted.release };
		const assertCurrent = () => {
			assertSourceCurrent();
			admitted.authority.assertLegacyCurrent();
		};
		assertCurrent();
		const prepareThread = async () => {
			const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
				permissionMode: input.permissionMode,
				execOverrides: input.execOverrides,
				approvals: input.permissionMode === "full" ? void 0 : await loadExecApprovalsReadOnlyAsync(),
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
			const ownedLocalProcess = appServer.start.transport === "stdio" && !isCodexAppServerProxyLaunch(appServer.start.args) && !appServer.remoteWorkspaceRoot;
			const baseStartOptions = appServer.start.transport === "stdio" && !isCodexAppServerProxyLaunch(appServer.start.args) ? {
				...appServer.start,
				env: {
					...appServer.start.env,
					...environment?.credentialScrubEnv,
					...environment?.localIdentityEnv,
					...environment?.localProcessEnv
				}
			} : appServer.start;
			const shellGitConfigParameters = ownedLocalProcess ? environment?.localGitConfigParameters : void 0;
			const startOptions = shellGitConfigParameters ? withCodexAppServerGitConfig(baseStartOptions, shellGitConfigParameters) : baseStartOptions;
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
				const pluginThreadConfig = prepareCodexPluginThreadConfigStartupProvider({
					startupPolicy: pluginPolicy,
					appCacheKey
				})?.({
					requestTimeoutMs: appServer.requestTimeoutMs,
					signal: input.abortSignal ?? new AbortController().signal,
					client,
					configCwd: input.workspaceDir
				});
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
					authority: admitted.authority,
					agentId: input.agentId,
					agentDir: input.agentDir,
					cwd: input.workspaceDir,
					appServer,
					shellGitConfigParameters,
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
			const current = await params.bindingStore.readAsync(sessionBindingIdentity(input));
			assertCurrent();
			return current ?? await prepareThread();
		});
		assertCurrent();
		return thread;
	});
}
//#endregion
export { prepareCodexMcpAppSession };
