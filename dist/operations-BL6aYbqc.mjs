import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { g as isReservedSystemAgentId } from "./agent-database-admission-BFwcs62N.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { r as SYSTEM_AGENT_AUDIT_STORE_LABEL } from "./audit-Dw5g9WOB.mjs";
import { f as resolveSystemAgentConfigSchema, s as validateSystemAgentPluginInstallSpec, u as redactSystemAgentConfig } from "./operations-parse-B6VcQhEV.mjs";
import { _ as runConfigSetOperation, a as executeSetDefaultModel, c as formatConfigValidationLine, d as isPluginBackingDefaultInferenceRoute, f as loadOverviewForOperation, g as resolveTuiAgentId, h as resolveChannelSetupState, i as createNoExitRuntime, l as formatGatewayStatusLine, m as readConfigValueAtPath, o as executeSetup, p as readConfigFileSnapshotLazy, r as applyPersistentOperation, s as formatChannelDocsUrl, t as CONFIG_GET_OUTPUT_MAX_CHARS, u as getRegularAgentSetupNotice, v as runGatewayLifecycle } from "./operations-execution-helpers-O57D9w13.mjs";
//#region src/system-agent/plugin-install.ts
async function executePluginInstall(operation, runtime, opts) {
	const validationError = validateSystemAgentPluginInstallSpec(operation.spec);
	if (validationError) throw new Error(validationError);
	const { runPluginInstallCommand } = await import("./plugins-install-command-CX6-EnhF.mjs");
	return await applyPersistentOperation({
		auditOperation: "plugin.install",
		operation,
		runtime,
		opts,
		run: async (ctx) => {
			await ctx.commit(() => runPluginInstallCommand({
				raw: operation.spec,
				opts: {},
				runtime: createNoExitRuntime(ctx.runtime),
				allowInstallPolicyWarningPrompt: false,
				applyRuntime: ctx.deps?.applyPluginRuntime,
				...ctx.assertPersistentApply ? { beforePersistentApply: ctx.assertPersistentApply } : {}
			}));
			return {
				summary: `Installed plugin ${operation.spec}`,
				details: { spec: operation.spec }
			};
		}
	});
}
//#endregion
//#region src/system-agent/operations-execute.ts
const loadOverviewModule = async () => await import("./overview-Cd-7O-W5.mjs");
function boundedPluginReadRuntime(runtime) {
	let remaining = CONFIG_GET_OUTPUT_MAX_CHARS;
	const write = (sink, args) => {
		if (remaining <= 0) return;
		const text = args.join(" ");
		sink(text.length >= remaining ? `${truncateUtf16Safe(text, remaining)}\n… (output limit reached; narrow the plugin search)` : text);
		remaining -= text.length + 1;
	};
	return {
		...runtime,
		log: (...args) => write(runtime.log, args),
		error: (...args) => write(runtime.error, args)
	};
}
/** Execute a parsed OpenClaw operation after applying approval gates and audit logging. */
async function executeSystemAgentOperation(operation, runtime, opts = {}) {
	switch (operation.kind) {
		case "none":
			runtime.log(operation.message);
			return {
				applied: false,
				exitsInteractive: operation.message.includes("Bye.")
			};
		case "overview": {
			const overview = await loadOverviewForOperation(opts.deps);
			if (opts.deps?.formatOverview) runtime.log(opts.deps.formatOverview(overview));
			else {
				const { formatSystemAgentOverview } = await loadOverviewModule();
				runtime.log(formatSystemAgentOverview(overview));
			}
			return { applied: false };
		}
		case "agents": {
			const overview = await loadOverviewForOperation(opts.deps);
			runtime.log(["Agents:", ...overview.agents.map((agent) => {
				return `  - ${[
					agent.id,
					agent.isDefault ? "default" : void 0,
					agent.name ? `name=${agent.name}` : void 0,
					`model=${agent.model ?? "not configured"}`,
					agent.utilityModel ? `utility=${agent.utilityModel}` : void 0,
					agent.workspace ? `workspace=${shortenHomePath(resolveUserPath(agent.workspace))}` : void 0
				].filter(Boolean).join(" | ")}`;
			})].join("\n"));
			return { applied: false };
		}
		case "models": {
			const overview = await loadOverviewForOperation(opts.deps);
			runtime.log([
				`Default model: ${overview.defaultModel ?? "not configured"}`,
				...overview.setupModel ? [`Setup model: ${overview.setupModel}`] : [],
				...overview.utilityModel ? [`Utility model: ${overview.utilityModel}`] : [],
				`Codex: ${overview.tools.codex.found ? "found" : "not found"}`,
				`Claude Code: ${overview.tools.claude.found ? "found" : "not found"}`,
				`Gemini CLI: ${overview.tools.gemini.found ? "found" : "not found"}`,
				`OpenAI key: ${overview.tools.apiKeys.openai ? "found" : "not found"}`,
				`Anthropic key: ${overview.tools.apiKeys.anthropic ? "found" : "not found"}`
			].join("\n"));
			return { applied: false };
		}
		case "plugin-list": {
			const boundedRuntime = boundedPluginReadRuntime(runtime);
			await (opts.deps?.runPluginsList ?? (async (pluginRuntime) => {
				const { runPluginsListCommand } = await import("./plugins-list-command-BAOzjoe5.mjs");
				await runPluginsListCommand({}, pluginRuntime);
			}))(boundedRuntime);
			return { applied: false };
		}
		case "plugin-search": {
			const boundedRuntime = boundedPluginReadRuntime(runtime);
			await (opts.deps?.runPluginsSearch ?? (async (query, pluginRuntime) => {
				const { runPluginsSearchCommand } = await import("./plugins-search-command-2j9wbXXn.mjs");
				await runPluginsSearchCommand(query, {}, pluginRuntime);
			}))(operation.query, boundedRuntime);
			return { applied: false };
		}
		case "audit":
			runtime.log(`Audit state: ${SYSTEM_AGENT_AUDIT_STORE_LABEL}`);
			runtime.log("Only applied writes/actions are recorded; discovery stays quiet.");
			return { applied: false };
		case "config-validate": {
			const snapshot = await readConfigFileSnapshotLazy();
			runtime.log(formatConfigValidationLine(snapshot));
			return { applied: false };
		}
		case "config-get": {
			const snapshot = await readConfigFileSnapshotLazy();
			if (!snapshot.exists) {
				runtime.log(`Config missing: ${shortenHomePath(snapshot.path)}`);
				return { applied: false };
			}
			const cfg = snapshot.sourceConfig;
			const lookup = readConfigValueAtPath(redactSystemAgentConfig(cfg, {
				config: cfg,
				valid: snapshot.valid
			}), operation.path);
			if (!lookup.found) {
				runtime.log(`${operation.path}: not set. Use \`config schema ${operation.path}\` to see what is allowed.`);
				return { applied: false };
			}
			const rendered = JSON.stringify(lookup.value, null, 2) ?? "null";
			runtime.log(rendered.length > 2e3 ? `${operation.path} = ${truncateUtf16Safe(rendered, CONFIG_GET_OUTPUT_MAX_CHARS)}\n… (truncated)` : `${operation.path} = ${rendered}`);
			return { applied: false };
		}
		case "config-schema": {
			const { lookupConfigSchema } = await import("./schema-Dk65tvHA.mjs");
			const response = resolveSystemAgentConfigSchema();
			const path = operation.path ?? ".";
			const result = lookupConfigSchema(response, path);
			if (!result) {
				runtime.log(`No config schema at "${path}". Try \`config schema .\` for the root keys.`);
				return { applied: false };
			}
			const schema = result.schema;
			const childLines = result.children.slice(0, 40).map((child) => {
				const bits = [
					Array.isArray(child.type) ? child.type.join("|") : child.type ?? "object",
					child.required ? "required" : void 0,
					child.hasChildren ? "…" : void 0
				].filter(Boolean).join(", ");
				return `  - ${child.path} (${bits})`;
			});
			const output = [
				`Schema for ${result.path === "" ? "." : result.path}:`,
				schema.type ? `type: ${Array.isArray(schema.type) ? schema.type.join("|") : schema.type}` : void 0,
				result.hint?.label ? `label: ${result.hint.label}` : void 0,
				result.hint?.help ? `help: ${result.hint.help}` : void 0,
				schema.description ? `description: ${schema.description}` : void 0,
				schema.enum ? `allowed values: ${schema.enum.map((v) => JSON.stringify(v)).join(", ")}` : void 0,
				schema.default !== void 0 ? `default: ${JSON.stringify(schema.default)}` : void 0,
				...childLines.length > 0 ? ["keys:", ...childLines] : [],
				result.children.length > 40 ? `… +${result.children.length - 40} more keys` : void 0
			].filter((line) => line !== void 0).join("\n");
			runtime.log(output.length > 2e3 ? `${truncateUtf16Safe(output, CONFIG_GET_OUTPUT_MAX_CHARS)}\n… (truncated; request a specific setting path)` : output);
			return { applied: false };
		}
		case "channel-list": {
			const { resolved } = await resolveChannelSetupState(opts.deps);
			const entries = resolved.entries.toSorted((a, b) => a.id.localeCompare(b.id));
			runtime.log([
				"Channels:",
				...entries.map((entry) => `  - ${entry.id}${entry.meta.label ? ` (${entry.meta.label})` : ""}`),
				"",
				"Say `connect <channel>` to walk through setup (for example `connect telegram`)."
			].join("\n"));
			return { applied: false };
		}
		case "channel-info": {
			const { cfg, installedPlugins, resolved, isConfigured } = await resolveChannelSetupState(opts.deps);
			const channel = operation.channel.toLowerCase();
			const entry = resolved.entries.find((candidate) => candidate.id === channel);
			if (!entry) {
				const knownIds = resolved.entries.map((candidate) => candidate.id).toSorted();
				runtime.log([`Unknown channel: ${channel}`, `Known channels: ${knownIds.length > 0 ? knownIds.join(", ") : "none"}`].join("\n"));
				return { applied: false };
			}
			const installed = installedPlugins.some((plugin) => plugin.id === entry.id) || resolved.installedCatalogById.has(entry.id);
			runtime.log([
				`${entry.meta.label} (${entry.id})`,
				entry.meta.blurb,
				`Configured: ${isConfigured(cfg, entry.id) ? "yes" : "no"}`,
				`Installed: ${installed ? "yes" : "no"}`,
				`Docs: ${formatChannelDocsUrl(entry.meta.docsPath)}`,
				"",
				`Say \`connect ${entry.id}\` to set it up here, or \`open channel wizard for ${entry.id}\` for the masked terminal wizard.`
			].join("\n"));
			return { applied: false };
		}
		case "channel-setup":
			runtime.log([
				`Connecting ${operation.channel} needs an interactive session.`,
				"Run `openclaw setup` and say `connect " + operation.channel + "`,",
				"or run `openclaw channels add` for the terminal wizard."
			].join("\n"));
			return { applied: false };
		case "skills-setup":
			runtime.log([
				"Skills setup needs an interactive session.",
				"Run `openclaw setup` and say `configure skills`,",
				"or run `openclaw configure --section skills` for the terminal wizard."
			].join("\n"));
			return { applied: false };
		case "search-setup":
			runtime.log([
				"Web search setup needs an interactive session.",
				"Run `openclaw setup` and say `configure search`,",
				"or run `openclaw configure --section web` for the masked terminal wizard."
			].join("\n"));
			return { applied: false };
		case "gateway-config-setup":
			runtime.log([
				"Gateway configuration needs an interactive session.",
				"Run `openclaw setup` and say `configure gateway`,",
				"or run `openclaw configure --section gateway` for the masked terminal wizard."
			].join("\n"));
			return { applied: false };
		case "memory-import":
			runtime.log([
				"Memory import needs an interactive session.",
				"Open the Memory page in the Control UI,",
				"or run `openclaw onboard` for the terminal wizard."
			].join("\n"));
			return { applied: false };
		case "model-setup":
			runtime.log("Open Settings → Models → Connect provider. Check the connected Gateway and the selected System or agent scope in Settings before signing in. Enter credentials only in the protected sign-in controls, never in chat. Connecting another provider does not select it as the active model or require stopping the host. Model selection is separate; replacing credentials for a provider already in use can affect current work. Nothing has changed.");
			return { applied: false };
		case "model-accounts":
			runtime.log("Manage your personal accounts in Settings → Profile → Connected accounts, or run `openclaw models accounts list` / `openclaw models accounts login <provider>`. Check the Gateway, person, and Personal scope before signing in. Nothing has changed. Enter credentials only in the protected sign-in controls, never in chat.");
			return { applied: false };
		case "open-setup": {
			const command = operation.target === "guided" ? "openclaw onboard" : operation.target === "classic" ? "openclaw onboard --classic" : operation.target === "channels" ? `openclaw channels add${operation.channel ? ` --channel ${operation.channel}` : ""}` : operation.target === "search" ? "openclaw configure --section web" : "openclaw configure --section gateway";
			runtime.log(`This session cannot host an interactive wizard. Run \`${command}\` on the machine running OpenClaw.`);
			return { applied: false };
		}
		case "setup": return await executeSetup(operation, runtime, opts);
		case "config-set": return await applyPersistentOperation({
			auditOperation: "config.set",
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				await runConfigSetOperation({
					operation,
					ctx
				});
				return {
					summary: `Set config ${operation.path}`,
					details: { path: operation.path }
				};
			}
		});
		case "config-set-ref": return await applyPersistentOperation({
			auditOperation: "config.setRef",
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				await runConfigSetOperation({
					operation,
					ctx
				});
				return {
					summary: `Set config ${operation.path} SecretRef`,
					details: {
						path: operation.path,
						source: operation.source,
						provider: operation.provider ?? "default"
					}
				};
			}
		});
		case "plugin-install": return await executePluginInstall(operation, runtime, opts);
		case "plugin-activate-artifact": {
			const { executePluginArtifactActivation } = await import("./plugin-artifact-D5oMuo7p.mjs");
			return await executePluginArtifactActivation(operation, runtime, opts);
		}
		case "plugin-uninstall": {
			if (await isPluginBackingDefaultInferenceRoute(operation.pluginId)) {
				const message = [`Uninstalling ${operation.pluginId} could remove the provider behind OpenClaw's own active inference route.`, `Removing it has to happen with OpenClaw stopped: run \`openclaw plugins uninstall ${operation.pluginId}\` on the machine running it.`].join("\n");
				runtime.log(message);
				return {
					applied: false,
					message
				};
			}
			const result = await applyPersistentOperation({
				auditOperation: "plugin.uninstall",
				operation,
				runtime,
				opts,
				run: async (ctx) => {
					const runPluginUninstall = ctx.deps?.runPluginUninstall ?? (async (pluginId, pluginRuntime, options) => {
						const { runPluginUninstallCommand } = await import("./plugins-uninstall-command-BxpAHlHN.mjs");
						await runPluginUninstallCommand([pluginId], options, pluginRuntime);
					});
					if (await isPluginBackingDefaultInferenceRoute(operation.pluginId)) throw new Error(`Uninstall aborted: ${operation.pluginId} now backs the active inference route. Removing it has to happen with OpenClaw stopped: run \`openclaw plugins uninstall ${operation.pluginId}\` on the machine running it.`);
					await ctx.commit(() => runPluginUninstall(operation.pluginId, createNoExitRuntime(ctx.runtime), ctx.assertPersistentApply ? { beforePersistentApply: ctx.assertPersistentApply } : void 0));
					return {
						summary: `Uninstalled plugin ${operation.pluginId}`,
						details: { pluginId: operation.pluginId }
					};
				}
			});
			if (result.applied) runtime.log("Restart the Gateway to apply plugin changes.");
			return result;
		}
		case "create-agent":
			if (isReservedSystemAgentId(operation.agentId)) throw new Error(`Agent id "${normalizeAgentId(operation.agentId)}" is reserved for the system agent. Choose a different agent id.`);
			if (operation.model?.trim()) throw new Error("OpenClaw cannot save an explicit per-agent model until that new route can be live-tested. Retry without `model`; the new agent inherits the verified default, then use `set_default_model` with agentId to live-test and save its own model.");
			return await applyPersistentOperation({
				auditOperation: "agents.create",
				operation,
				runtime,
				opts,
				run: async (ctx) => {
					const createAgentForOperation = ctx.deps?.createAgent ?? (await import("./agent-create-CeM1gyZ2.mjs")).createAgent;
					const { createAgentIdentityConfig } = await import("./identity-file-DH40Wrbb.mjs");
					const result = await ctx.commit(() => createAgentForOperation({
						entry: {
							id: operation.agentId,
							...operation.name ? {
								name: operation.name,
								identity: createAgentIdentityConfig({ name: operation.name })
							} : {}
						},
						...operation.role ? { role: operation.role } : {},
						...operation.purpose ? { purpose: operation.purpose } : {},
						...operation.workspace ? { workspace: operation.workspace } : {},
						...ctx.assertPersistentApply ? { beforePersistentApply: ctx.assertPersistentApply } : {},
						provenance: {
							createdVia: "agent",
							creatorAgentId: operation.requesterAgentId ?? "openclaw"
						}
					}));
					if (result.status === "error") throw new Error(result.message);
					const name = result.config.agents?.entries?.[result.agentId]?.identity?.name ?? result.name;
					ctx.runtime.log(`Created agent ${name} (${result.agentId}). It now appears in the Agents home and the agent switcher; select it to start chatting.`);
					return {
						summary: `Created agent ${result.agentId}`,
						bootstrapPending: result.bootstrapPending,
						agentId: result.agentId,
						details: {
							agentId: result.agentId,
							workspace: result.workspace
						}
					};
				}
			});
		case "create-team": return await applyPersistentOperation({
			auditOperation: "agents.createTeam",
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				const { createAgentTeam } = await import("./agent-team-BdjrZoZs.mjs");
				const result = await ctx.commit(() => createAgentTeam({
					coordinator: operation.coordinatorId,
					prefix: operation.prefix,
					workspaceRoot: operation.workspaceRoot,
					beforePersistentApply: ctx.assertPersistentApply,
					provenance: {
						createdVia: "agent",
						creatorAgentId: opts.requesterAgentId ?? "openclaw"
					}
				}));
				if (result.status === "error") {
					if (result.retainedAgents?.length) {
						const summary = `Team creation incomplete. ${result.message}`;
						ctx.runtime.error(`${summary} Retained agents appear in the Agents home and the agent switcher. Resolve the failure before creating the missing agents.`);
						return {
							summary,
							details: { retainedAgentIds: result.retainedAgents.map(({ agentId }) => agentId) }
						};
					}
					throw new Error(result.message);
				}
				ctx.runtime.log(`Created team: ${result.agents.map(({ agentId }) => agentId).join(", ")}. Select chief of staff ${result.coordinatorId} in the Agents home or the agent switcher to start chatting; all four agents now appear there.`);
				return {
					summary: `Created team with chief of staff ${result.coordinatorId}`,
					agentId: result.coordinatorId,
					bootstrapPending: false
				};
			}
		});
		case "doctor":
			await (opts.deps?.runDoctor ?? (await import("./doctor-CWg1-CE5.mjs")).doctorCommand)(runtime, { nonInteractive: true });
			return { applied: false };
		case "doctor-fix":
			runtime.log("Doctor repairs can change the inference route that powers this session, so they run with OpenClaw stopped: `openclaw doctor --fix` on the machine running it.");
			return { applied: false };
		case "status": {
			const { statusCommand } = await import("./status.command-BUsLh55a.mjs");
			await statusCommand({ timeoutMs: 1e4 }, runtime);
			return { applied: false };
		}
		case "health": {
			const { healthCommand } = await import("./health-CpMYk3kO.mjs");
			await healthCommand({ timeoutMs: 1e4 }, runtime);
			return { applied: false };
		}
		case "gateway-status": {
			const overview = await loadOverviewForOperation(opts.deps);
			runtime.log(formatGatewayStatusLine(overview));
			return { applied: false };
		}
		case "gateway-start":
		case "gateway-stop":
		case "gateway-restart": return await applyPersistentOperation({
			auditOperation: operation.kind.replace("-", "."),
			operation,
			runtime,
			opts,
			run: async (ctx) => {
				const action = operation.kind === "gateway-start" ? "start" : operation.kind === "gateway-stop" ? "stop" : "restart";
				if (ctx.deps?.setupSurface === "gateway") {
					const host = ctx.deps.gatewayHostLifecycle;
					if (!host) throw new Error("Gateway host lifecycle is unavailable. Use the service manager on the Gateway host.");
					const result = await host.request(action, () => ctx.assertPersistentApply?.());
					if (!result.ok) throw new Error(result.error);
					const summary = result.value.outcome === "already-running" ? "Gateway already running" : `Scheduled Gateway ${action}`;
					ctx.runtime.log(summary);
					return { summary };
				}
				const run = action === "start" ? ctx.deps?.runGatewayStart : action === "stop" ? ctx.deps?.runGatewayStop : ctx.deps?.runGatewayRestart;
				if (await ctx.commit(run ?? (() => runGatewayLifecycle(action))) === false) throw new Error("Gateway restart did not complete");
				return { summary: action === "start" ? "Started Gateway" : action === "stop" ? "Stopped Gateway" : "Restarted Gateway" };
			}
		});
		case "open-tui": {
			const overview = await loadOverviewForOperation(opts.deps);
			const agentId = resolveTuiAgentId({
				requestedAgentId: operation.agentId,
				requestedWorkspace: operation.workspace,
				overview
			});
			const setupNotice = getRegularAgentSetupNotice(overview, agentId);
			if (setupNotice) {
				runtime.log(setupNotice);
				return {
					applied: false,
					message: setupNotice
				};
			}
			const session = agentId ? buildAgentMainSessionKey({ agentId }) : void 0;
			const result = await (opts.deps?.runTui ?? (await import("./tui-DLSRIP9m.mjs")).runTui)({
				local: !overview.gateway.reachable,
				session,
				deliver: false,
				historyLimit: 200,
				...operation.agentDraft === "hatch" ? { message: t("wizard.finalize.bootstrapHatchMessage") } : {}
			});
			if (result?.exitReason === "return-to-system-agent") {
				runtime.log(result.systemAgentMessage ? `[openclaw] returned from agent with request: ${result.systemAgentMessage}` : "[openclaw] returned from agent");
				return {
					applied: false,
					returnToShell: true,
					nextInput: result.systemAgentMessage
				};
			}
			return {
				applied: false,
				exitsInteractive: true
			};
		}
		case "set-default-model": return await executeSetDefaultModel(operation, runtime, opts);
		default: return { applied: false };
	}
}
//#endregion
export { executeSystemAgentOperation as t };
