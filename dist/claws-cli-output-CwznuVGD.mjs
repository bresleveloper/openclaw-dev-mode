import "./src-CZ2wJvNB.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as assertNoSymlinkParents } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { a as MAX_MANAGED_WORKSPACE_BYTES, f as CLAW_OUTPUT_STABILITY, i as MAX_MANAGED_FILE_BYTES, l as CLAW_ADD_PLAN_SCHEMA_VERSION, o as clawManifestWorkspaceConflictsWithPath, p as materializeClawToolProfile, u as CLAW_BOOTSTRAP_FILE_NAMES } from "./reader-C5RYMxIl.mjs";
import { n as inspectModelReference } from "./model-reference-validation-C35UFSy2.mjs";
import { a as digestClawMcpServer } from "./mcp-CSMpf6KZ.mjs";
import { relative, resolve } from "node:path";
import { lstat, realpath } from "node:fs/promises";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
//#region src/claws/application-plan.ts
function clawAddCapabilityChange(change) {
	return {
		...change,
		classification: "escalation",
		requiresDistinctConsent: true,
		digest: `sha256:${createHash("sha256").update(stableStringify(change.effect)).digest("hex")}`
	};
}
function clawAgentCapabilityChange(agentId, settings) {
	const effect = {
		...settings.model ? { model: settings.model } : {},
		...settings.subagents ? { subagents: settings.subagents } : {},
		...settings.sandbox ? { sandbox: settings.sandbox } : {},
		...settings.tools ? { tools: settings.tools } : {},
		...settings.memory ? { memory: settings.memory } : {},
		...settings.heartbeat ? { heartbeat: settings.heartbeat } : {}
	};
	if (Object.keys(effect).length === 0) return;
	return clawAddCapabilityChange({
		kind: "agent",
		id: agentId,
		path: "agent",
		action: "create",
		reason: settings.model || settings.subagents ? "The new agent declares model, delegation, sandbox, tool, memory-search, or recurring heartbeat configuration." : "The new agent declares sandbox, tool, memory-search, or recurring heartbeat capabilities.",
		effect
	});
}
function clawAgentConfigurationNotices(agent, config, agentIds) {
	const notices = [];
	const notice = (code, path, message) => {
		notices.push({
			level: "warning",
			phase: "plan",
			code,
			path: `$.profiles.openclaw.agent.${path}`,
			message
		});
	};
	for (const [index, target] of (agent.subagents?.allowAgents ?? []).entries()) if (!agentIds.has(target)) notice("delegation_target_unresolved", `subagents.allowAgents[${index}]`, `Delegation target ${JSON.stringify(target)} is not in the local agent roster; it will be applied as declared. Install that agent before delegating to it.`);
	const refs = agent.model ? [agent.model.primary, ...agent.model.fallbacks ?? []] : [];
	for (const [index, ref] of refs.entries()) {
		const slash = ref.indexOf("/");
		if (inspectModelReference({
			cfg: config,
			ref: {
				provider: ref.slice(0, slash),
				model: ref.slice(slash + 1)
			}
		}).status !== "known") notice("model_not_in_catalog", index === 0 ? "model.primary" : `model.fallbacks[${index - 1}]`, `Model ${JSON.stringify(ref)} is not in the local model catalog; it will be applied as declared. Configure it before running the agent.`);
	}
	return notices;
}
function clawProfileExtensionPackages(profile) {
	return (profile?.extensions ?? []).map((extension) => ({
		kind: "plugin",
		source: extension.source,
		ref: extension.ref,
		version: extension.version
	}));
}
function blocker$1(code, path, message) {
	return {
		level: "error",
		code,
		phase: "plan",
		path,
		message
	};
}
function findClawExtensionPackageCollisions(params) {
	const declaredPackageIds = new Set(params.packages.map((pkg) => `${pkg.kind}:${pkg.ref}`));
	const collisions = [];
	for (const [index, extension] of params.extensions.entries()) {
		const packageId = `plugin:${extension.ref}`;
		if (declaredPackageIds.has(packageId)) {
			collisions.push({
				index,
				diagnostic: blocker$1("extension_package_collision", `$.profiles.openclaw.extensions[${index}]`, `Extension package ${JSON.stringify(packageId)} is already declared by the portable manifest or another profile extension.`)
			});
			continue;
		}
		declaredPackageIds.add(packageId);
	}
	return collisions;
}
function extensionCapabilityChange(params) {
	const effect = {
		id: params.extension.id,
		source: params.extension.source,
		ref: params.extension.ref,
		version: params.extension.version,
		expectedFormat: params.extension.format,
		detectedFormat: params.preflight.detectedFormat ?? "unresolved",
		integrity: params.preflight.integrity ?? "unresolved",
		mapped: params.preflight.mapped ?? [],
		unavailable: params.preflight.unavailable ?? [],
		adapterIdentity: params.preflight.adapterIdentity ?? "unresolved",
		...params.preflight.installId ? { installId: params.preflight.installId } : {},
		...params.preflight.warning ? { riskWarning: params.preflight.warning } : {}
	};
	return clawAddCapabilityChange({
		kind: "package",
		id: `extension:${params.extension.id}`,
		path: `openclaw.extensions.${params.extension.id}`,
		action: params.preflight.action === "reuse" ? "reuse" : "install",
		reason: params.preflight.action === "reuse" ? "The OpenClaw profile requires access to an existing native extension." : "The OpenClaw profile requires installation of native extension content or executable code.",
		effect
	});
}
async function planClawExtensions(params) {
	const extensions = [];
	const actions = [];
	const capabilityChanges = [];
	const requirements = [];
	const blockers = [];
	for (const [index, extension] of params.extensions.entries()) {
		const preflight = params.packagePreflight ? await params.packagePreflight({
			kind: "plugin",
			source: extension.source,
			ref: extension.ref,
			version: extension.version
		}, params.workspace) : {
			ok: false,
			code: "package_install_unavailable",
			message: "Extension preflight is unavailable."
		};
		const completeProvenance = preflight.ok && Boolean(preflight.integrity && preflight.installId && preflight.action && preflight.detectedFormat && preflight.adapterIdentity);
		const incompleteProvenance = preflight.ok && !completeProvenance ? blocker$1("extension_provenance_incomplete", `$.profiles.openclaw.extensions[${index}]`, `Extension ${JSON.stringify(extension.id)} did not resolve complete canonical identity and adapter provenance.`) : void 0;
		const formatMismatch = preflight.ok && completeProvenance && preflight.detectedFormat !== extension.format ? blocker$1("extension_format_mismatch", `$.profiles.openclaw.extensions[${index}].format`, `Extension ${JSON.stringify(extension.id)} declares format ${JSON.stringify(extension.format)}, but the canonical plugin detector found ${JSON.stringify(preflight.detectedFormat ?? "unknown")}.`) : void 0;
		const diagnostic = !preflight.ok ? blocker$1(preflight.code ?? "extension_preflight_failed", `$.profiles.openclaw.extensions[${index}]`, preflight.message ?? "Extension preflight failed.") : incompleteProvenance ?? formatMismatch;
		if (diagnostic) blockers.push(diagnostic);
		if (preflight.ok && preflight.requirements) requirements.push(...preflight.requirements);
		const requirementState = diagnostic ? "conflicting" : preflight.action === "install" ? "missing-installable" : preflight.requirements && preflight.requirements.length > 0 ? "setup-required" : "satisfied";
		const extensionPlan = {
			...extension,
			...preflight.detectedFormat ? { detectedFormat: preflight.detectedFormat } : {},
			...preflight.integrity ? { integrity: preflight.integrity } : {},
			...preflight.installId ? { installId: preflight.installId } : {},
			...preflight.action ? { ownerAction: preflight.action } : {},
			requirementState,
			mapped: preflight.mapped ?? [],
			unavailable: preflight.unavailable ?? [],
			...preflight.adapterIdentity ? { adapterIdentity: preflight.adapterIdentity } : {},
			blocked: Boolean(diagnostic)
		};
		extensions.push(extensionPlan);
		actions.push({
			kind: "package",
			id: `plugin:${extension.ref}`,
			action: preflight.ok && preflight.action === "reuse" ? "reuse" : "install",
			target: `${extension.source}:${extension.ref}@${extension.version}`,
			...preflight.integrity ? { digest: preflight.integrity } : {},
			details: {
				kind: "plugin",
				source: extension.source,
				ref: extension.ref,
				version: extension.version,
				...preflight.integrity ? { integrity: preflight.integrity } : {},
				...preflight.installId ? { installId: preflight.installId } : {},
				...preflight.action ? { ownerAction: preflight.action } : {},
				requirementState,
				...preflight.requirements ? { prerequisites: preflight.requirements } : {},
				...completeProvenance ? { extension: {
					id: extension.id,
					format: extension.format,
					detectedFormat: preflight.detectedFormat,
					mapped: preflight.mapped ?? [],
					unavailable: preflight.unavailable ?? [],
					adapterIdentity: preflight.adapterIdentity
				} } : {},
				expectedState: !preflight.ok ? "unresolved" : preflight.action === "reuse" ? "present-exact" : "absent",
				...preflight.warning ? { riskWarning: preflight.warning } : {}
			},
			blocked: extensionPlan.blocked,
			...diagnostic ? { reason: diagnostic.message } : {}
		});
		capabilityChanges.push(extensionCapabilityChange({
			extension,
			preflight
		}));
	}
	return {
		extensions,
		actions,
		capabilityChanges,
		requirements,
		blockers
	};
}
//#endregion
//#region src/claws/lifecycle.ts
const AGENT_ID_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
function sourceReferencePath(root, path) {
	return `${root.replace(/\/+$/u, "")}/${path.replaceAll("\\", "/")}`;
}
function canonicalWorkspacePath(value) {
	return resolvePathViaExistingAncestorSync(resolve(resolveUserPath(value)));
}
function blocker(code, path, message) {
	return {
		level: "error",
		code,
		phase: "plan",
		path,
		message
	};
}
function blockedWorkspaceFileAction(params) {
	return {
		kind: "workspaceFile",
		id: params.id,
		action: "write",
		target: params.target,
		source: params.source,
		blocked: true,
		reason: params.reason
	};
}
function workspaceSourceErrorCode(error) {
	if (error instanceof FsSafeError) {
		if (error.code === "too-large") return "workspace_source_too_large";
		if (error.code === "symlink" || error.code === "hardlink" || error.code === "path-mismatch") return "workspace_source_unsafe";
	}
	if (error instanceof Error && error.message.includes("symlinked directory")) return "workspace_source_unsafe";
	return "workspace_source_invalid";
}
function workspaceSourceMessage(code, sourcePath) {
	if (code === "workspace_source_too_large") return `Workspace source ${JSON.stringify(sourcePath)} exceeds ${MAX_MANAGED_FILE_BYTES} bytes.`;
	if (code === "workspace_sources_too_large") return `Workspace sources exceed ${MAX_MANAGED_WORKSPACE_BYTES} aggregate bytes.`;
	if (code === "workspace_source_unsafe") return `Workspace source ${JSON.stringify(sourcePath)} must be a regular, non-symlinked, non-hardlinked file.`;
	return `Workspace source ${JSON.stringify(sourcePath)} must resolve to a file inside the Claw package.`;
}
async function inspectWorkspaceFileAction(params) {
	const requestedSource = resolve(params.source.packageRoot, params.sourcePath);
	const requestedTarget = resolve(params.workspace, params.targetPath);
	try {
		await assertNoSymlinkParents({
			rootDir: params.source.packageRoot,
			targetPath: requestedSource,
			allowMissing: false,
			messagePrefix: "Workspace source"
		});
		const opened = await params.sourceRoot.open(params.sourcePath, {
			hardlinks: "reject",
			symlinks: "reject"
		});
		await opened[Symbol.asyncDispose]();
		if (opened.stat.size > 1048576) throw new FsSafeError("too-large", `file exceeds limit of ${MAX_MANAGED_FILE_BYTES} bytes (got ${opened.stat.size})`);
		return { pending: {
			sourcePath: params.sourcePath,
			manifestPath: params.manifestPath,
			byteLength: opened.stat.size,
			action: {
				kind: "workspaceFile",
				id: params.id,
				action: "write",
				target: requestedTarget,
				source: opened.realPath,
				details: { expectedState: "absent" },
				blocked: false
			}
		} };
	} catch (error) {
		const code = workspaceSourceErrorCode(error);
		const message = workspaceSourceMessage(code, params.sourcePath);
		const diagnostic = blocker(code, params.manifestPath, message);
		return {
			action: blockedWorkspaceFileAction({
				id: params.id,
				target: requestedTarget,
				source: requestedSource,
				reason: diagnostic.message
			}),
			blocker: diagnostic
		};
	}
}
async function buildClawAddPlan(params) {
	const context = params.context ?? {};
	const finalId = context.agentId ?? params.manifest.agent.id;
	const workspace = canonicalWorkspacePath(context.workspace ?? resolve(homedir(), ".openclaw", `workspace-${finalId}`));
	const packageRoot = await realpath(params.source.packageRoot).catch(() => params.source.packageRoot);
	const manifestPath = resolvePathViaExistingAncestorSync(resolve(params.source.manifestPath));
	const source = {
		...params.source,
		packageRoot,
		manifestPath
	};
	const planSource = context.sourceReferenceRoot ? {
		...source,
		packageRoot: context.sourceReferenceRoot,
		manifestPath: sourceReferencePath(context.sourceReferenceRoot, relative(packageRoot, manifestPath))
	} : source;
	const planSourcePath = (path, fallback) => context.sourceReferenceRoot ? sourceReferencePath(context.sourceReferenceRoot, path) : fallback;
	const sourceRoot = await root(packageRoot);
	const blockers = [];
	const actions = [];
	const capabilityChanges = [];
	const readinessRequirements = [];
	if (!AGENT_ID_PATTERN.test(finalId)) blockers.push(blocker("invalid_agent_id", "$.agent.id", `Final agent id ${JSON.stringify(finalId)} is not a valid portable agent id.`));
	const existingAgentIds = new Set(context.existingAgentIds ?? []);
	const agentBlocked = existingAgentIds.has(finalId);
	const openClawAgentSettings = params.openClawProfile?.agent ?? {};
	const persistedOpenClawAgentSettings = params.reconstructLegacyDynamicToolProfilePlan ? openClawAgentSettings : materializeClawToolProfile(openClawAgentSettings);
	const agentConfig = {
		...params.manifest.agent,
		...persistedOpenClawAgentSettings,
		id: finalId,
		workspace
	};
	if (agentBlocked) blockers.push(blocker("agent_id_collision", "$.agent.id", `Agent id ${JSON.stringify(finalId)} already exists; Claws never merge into existing agents.`));
	actions.push({
		kind: "agent",
		id: finalId,
		action: "create",
		target: `agents.entries[${JSON.stringify(finalId)}]`,
		details: {
			...agentConfig,
			expectedState: "absent"
		},
		blocked: agentBlocked || !AGENT_ID_PATTERN.test(finalId)
	});
	const agentCapability = clawAgentCapabilityChange(finalId, openClawAgentSettings);
	if (agentCapability) capabilityChanges.push(agentCapability);
	const configuredWorkspaceConflict = new Set([...context.existingWorkspacePaths ?? []].map((path) => canonicalWorkspacePath(path))).has(workspace);
	const workspaceExistsOnDisk = await lstat(workspace).then(() => true).catch(() => false);
	const resumableWorkspace = context.resumableWorkspace ? canonicalWorkspacePath(context.resumableWorkspace) : void 0;
	const workspaceBlocked = configuredWorkspaceConflict || workspaceExistsOnDisk && resumableWorkspace !== workspace;
	if (workspaceBlocked) blockers.push(blocker("workspace_collision", "$.workspace", `Workspace ${JSON.stringify(workspace)} already exists; a Claw requires a new workspace.`));
	actions.push({
		kind: "workspace",
		id: finalId,
		action: "create",
		target: workspace,
		details: { expectedState: "absent" },
		blocked: workspaceBlocked,
		...workspaceBlocked ? { reason: `Workspace ${JSON.stringify(workspace)} already exists.` } : {}
	});
	if (params.packageBootstrap && params.includePackageBootstrap !== false) actions.push({
		kind: "bootstrap",
		id: "BOOTSTRAP.md",
		action: "write",
		target: resolve(workspace, "BOOTSTRAP.md"),
		source: planSourcePath(params.packageBootstrap.sourcePath, params.packageBootstrap.realPath),
		digest: params.packageBootstrap.digest,
		details: {
			sourcePath: params.packageBootstrap.sourcePath,
			byteLength: params.packageBootstrap.byteLength,
			expectedState: "absent-or-native-consumed",
			lifecycle: "native-seed-once"
		},
		blocked: workspaceBlocked,
		...workspaceBlocked ? { reason: `Workspace ${JSON.stringify(workspace)} already exists.` } : {}
	});
	const pendingWorkspaceFiles = [];
	async function addWorkspaceFileInspection(fileParams) {
		const result = await inspectWorkspaceFileAction({
			sourceRoot,
			source,
			workspace,
			sourcePath: fileParams.sourcePath,
			targetPath: fileParams.targetPath,
			id: fileParams.id,
			manifestPath: fileParams.manifestPath
		});
		const action = result.pending?.action ?? result.action;
		if (!action) throw new Error("Claw workspace source inspection did not produce an action");
		if (action.source) action.source = planSourcePath(fileParams.sourcePath, action.source);
		action.blocked ||= workspaceBlocked;
		if (workspaceBlocked) action.reason = `Workspace ${JSON.stringify(workspace)} already exists.`;
		actions.push(action);
		if (result.pending) pendingWorkspaceFiles.push(result.pending);
		if (result.blocker) blockers.push(result.blocker);
	}
	if (params.clawMarkdownBody && params.clawMarkdownBody.toString("utf8").trim().length > 0) {
		if (clawManifestWorkspaceConflictsWithPath(params.manifest, "SOUL.md")) {
			const diagnostic = blocker("claw_body_soul_conflict", "$.workspace", "CLAW.md body content and an explicit SOUL.md workspace declaration cannot both be present.");
			blockers.push(diagnostic);
			actions.push({
				kind: "workspaceFile",
				id: "SOUL.md",
				action: "write",
				target: resolve(workspace, "SOUL.md"),
				source: planSource.manifestPath,
				sourceKind: "clawMarkdownBody",
				blocked: true,
				reason: diagnostic.message
			});
		} else {
			const pending = {
				sourcePath: source.manifestPath,
				manifestPath: "$body",
				byteLength: params.clawMarkdownBody.byteLength,
				content: params.clawMarkdownBody,
				action: {
					kind: "workspaceFile",
					id: "SOUL.md",
					action: "write",
					target: resolve(workspace, "SOUL.md"),
					source: planSource.manifestPath,
					sourceKind: "clawMarkdownBody",
					details: { expectedState: "absent" },
					blocked: false
				}
			};
			pendingWorkspaceFiles.push(pending);
			actions.push(pending.action);
		}
	}
	for (const name of CLAW_BOOTSTRAP_FILE_NAMES) {
		const declaration = params.manifest.workspace.bootstrapFiles[name];
		if (!declaration) continue;
		await addWorkspaceFileInspection({
			sourcePath: declaration.source,
			targetPath: name,
			id: name,
			manifestPath: `$.workspace.bootstrapFiles.${name}`
		});
	}
	for (const [index, file] of params.manifest.workspace.files.entries()) await addWorkspaceFileInspection({
		sourcePath: file.source,
		targetPath: file.path,
		id: file.path,
		manifestPath: `$.workspace.files[${index}]`
	});
	if (pendingWorkspaceFiles.reduce((total, pending) => total + pending.byteLength, 0) > 4194304) {
		const diagnostic = blocker("workspace_sources_too_large", "$.workspace", workspaceSourceMessage("workspace_sources_too_large", ""));
		blockers.push(diagnostic);
		for (const pending of pendingWorkspaceFiles) {
			pending.action.blocked = true;
			pending.action.reason = diagnostic.message;
		}
	} else for (const pending of pendingWorkspaceFiles) {
		if (pending.content) {
			pending.action.digest = `sha256:${createHash("sha256").update(pending.content).digest("hex")}`;
			continue;
		}
		try {
			await assertNoSymlinkParents({
				rootDir: source.packageRoot,
				targetPath: resolve(source.packageRoot, pending.sourcePath),
				allowMissing: false,
				messagePrefix: "Workspace source"
			});
			const read = await sourceRoot.read(pending.sourcePath, {
				hardlinks: "reject",
				maxBytes: MAX_MANAGED_FILE_BYTES,
				symlinks: "reject"
			});
			pending.action.source = planSourcePath(pending.sourcePath, read.realPath);
			pending.action.digest = `sha256:${createHash("sha256").update(read.buffer).digest("hex")}`;
		} catch (error) {
			const code = workspaceSourceErrorCode(error);
			const message = workspaceSourceMessage(code, pending.sourcePath);
			const diagnostic = blocker(code, pending.manifestPath, message);
			pending.action.blocked = true;
			pending.action.reason = diagnostic.message;
			blockers.push(diagnostic);
		}
	}
	for (const [index, pkg] of params.manifest.packages.entries()) {
		const preflight = context.packagePreflight ? await context.packagePreflight(pkg, workspace) : {
			ok: false,
			code: "package_install_unavailable",
			message: "Package preflight is unavailable."
		};
		const diagnostic = preflight.ok ? void 0 : blocker(preflight.code ?? "package_install_unavailable", `$.packages[${index}]`, preflight.message ?? "Package preflight failed.");
		if (diagnostic) blockers.push(diagnostic);
		if (preflight.ok && preflight.requirements) readinessRequirements.push(...preflight.requirements);
		actions.push({
			kind: "package",
			id: `${pkg.kind}:${pkg.ref}`,
			action: preflight.ok && preflight.action === "reuse" ? "reuse" : "install",
			target: `${pkg.source}:${pkg.ref}@${pkg.version}`,
			digest: preflight.integrity,
			details: {
				...pkg,
				...preflight.integrity ? { integrity: preflight.integrity } : {},
				...preflight.installId ? { installId: preflight.installId } : {},
				...preflight.warning ? { riskWarning: preflight.warning } : {},
				...preflight.requirements ? { prerequisites: preflight.requirements } : {},
				expectedState: !preflight.ok ? "unresolved" : preflight.action === "reuse" ? "present-exact" : "absent",
				ownerAction: preflight.action,
				requirementState: !preflight.ok ? "conflicting" : preflight.action === "install" ? "missing-installable" : preflight.requirements && preflight.requirements.length > 0 ? "setup-required" : "satisfied"
			},
			blocked: !preflight.ok,
			...diagnostic ? { reason: diagnostic.message } : {}
		});
		capabilityChanges.push(clawAddCapabilityChange({
			kind: "package",
			id: `${pkg.kind}:${pkg.ref}`,
			path: `packages.${pkg.kind}.${pkg.ref}`,
			action: preflight.ok && preflight.action === "reuse" ? "reuse" : "install",
			reason: preflight.ok && preflight.action === "reuse" ? "The Claw requires access to an existing package capability." : "The Claw requires downloadable package content or executable code.",
			effect: {
				kind: pkg.kind,
				source: pkg.source,
				ref: pkg.ref,
				version: pkg.version,
				integrity: preflight.integrity ?? "unresolved",
				...preflight.installId ? { installId: preflight.installId } : {},
				...preflight.warning ? { riskWarning: preflight.warning } : {}
			}
		}));
	}
	const extensionPlan = await planClawExtensions({
		extensions: params.openClawProfile?.extensions ?? [],
		workspace,
		packagePreflight: context.packagePreflight
	});
	const extensions = extensionPlan.extensions;
	const extensionCollisions = findClawExtensionPackageCollisions({
		packages: params.manifest.packages,
		extensions: params.openClawProfile?.extensions ?? []
	});
	const collisionIndexes = new Set(extensionCollisions.map(({ index }) => index));
	blockers.push(...extensionCollisions.map(({ diagnostic }) => diagnostic));
	for (const [index, action] of extensionPlan.actions.entries()) {
		if (collisionIndexes.has(index)) continue;
		actions.push(action);
	}
	capabilityChanges.push(...extensionPlan.capabilityChanges);
	readinessRequirements.push(...extensionPlan.requirements);
	blockers.push(...extensionPlan.blockers);
	const existingMcpServerNames = new Set(context.existingMcpServerNames ?? []);
	for (const [name, server] of Object.entries(params.manifest.mcpServers)) {
		const existingServer = context.existingMcpServers?.[name];
		const exactExisting = existingServer !== void 0 && digestClawMcpServer(existingServer) === digestClawMcpServer(server);
		const blocked = !exactExisting && (existingMcpServerNames.has(name) || existingServer !== void 0);
		if (blocked) blockers.push(blocker("mcp_server_collision", `$.mcpServers.${name}`, `MCP server ${JSON.stringify(name)} already exists with different or unresolved configuration and will not be overwritten.`));
		if ("env" in server) for (const value of Object.values(server.env ?? {})) readinessRequirements.push({
			kind: "environment",
			mcpServer: name,
			name: value.slice(2, -1)
		});
		if ("auth" in server && server.auth === "oauth") readinessRequirements.push({
			kind: "oauth",
			mcpServer: name
		});
		actions.push({
			kind: "mcpServer",
			id: name,
			action: "configure",
			target: `mcp.servers.${name}`,
			details: {
				...server,
				expectedState: exactExisting ? "present-exact" : "absent",
				prerequisites: readinessRequirements.filter((requirement) => requirement.kind !== "plugin-setup" && requirement.mcpServer === name)
			},
			blocked
		});
		capabilityChanges.push(clawAddCapabilityChange({
			kind: "mcpServer",
			id: name,
			path: `mcpServers.${name}`,
			action: "configure",
			reason: "The Claw declares an MCP execution or network tool surface.",
			effect: {
				...server,
				..."env" in server && server.env ? { env: Object.keys(server.env).toSorted() } : {}
			}
		}));
	}
	for (const job of params.manifest.cronJobs) {
		actions.push({
			kind: "cronJob",
			id: job.id,
			action: "schedule",
			target: `cron:${job.id}:agent=${finalId}`,
			details: {
				...job,
				agentId: finalId,
				expectedState: "absent",
				...job.delivery?.channel === "last" ? { deliveryResolution: "local-channel-state:last" } : {}
			},
			blocked: false
		});
		capabilityChanges.push(clawAddCapabilityChange({
			kind: "cronJob",
			id: job.id,
			path: `cronJobs.${job.id}`,
			action: "schedule",
			reason: "The Claw declares recurring scheduled work.",
			effect: {
				...job,
				agentId: finalId
			}
		}));
	}
	capabilityChanges.sort((left, right) => `${left.kind}:${left.id}:${left.path}`.localeCompare(`${right.kind}:${right.id}:${right.path}`));
	const notices = clawAgentConfigurationNotices(openClawAgentSettings, context.config ?? {}, /* @__PURE__ */ new Set([...existingAgentIds, finalId]));
	const planIntegrity = `sha256:${createHash("sha256").update(stableStringify({
		manifestSchemaVersion: params.manifest.schemaVersion,
		clawIntegrity: source.integrity,
		finalId,
		workspace,
		actions,
		capabilityChanges,
		blockers,
		extensions,
		...notices.length > 0 ? { notices } : {}
	})).digest("hex")}`;
	return {
		schemaVersion: CLAW_ADD_PLAN_SCHEMA_VERSION,
		manifestSchemaVersion: params.manifest.schemaVersion,
		stability: CLAW_OUTPUT_STABILITY,
		dryRun: true,
		mutationAllowed: false,
		planIntegrity,
		claw: planSource,
		agent: {
			requestedId: params.manifest.agent.id,
			finalId,
			workspace,
			config: agentConfig
		},
		summary: {
			totalActions: actions.length,
			agentActions: actions.filter((action) => action.kind === "agent").length,
			workspaceActions: actions.filter((action) => action.kind === "workspace" || action.kind === "bootstrap" || action.kind === "workspaceFile").length,
			packageActions: actions.filter((action) => action.kind === "package").length,
			mcpServerActions: actions.filter((action) => action.kind === "mcpServer").length,
			cronJobActions: actions.filter((action) => action.kind === "cronJob").length,
			blockedActions: actions.filter((action) => action.blocked).length,
			capabilityEscalations: capabilityChanges.length
		},
		actions,
		capabilityChanges,
		readiness: {
			ready: readinessRequirements.length === 0,
			requirements: readinessRequirements
		},
		extensions,
		blockers,
		diagnostics: [...params.diagnostics ?? [], ...notices]
	};
}
//#endregion
//#region src/cli/claws-cli-output.ts
function emitClawFailure(runtime, json, message, payload) {
	if (json) writeRuntimeJson(runtime, payload);
	else runtime.error(message);
	runtime.exit(1);
}
function formatClawDiagnostics(diagnostics) {
	return diagnostics.map((diagnostic) => `${diagnostic.level.toUpperCase()} ${diagnostic.code} ${diagnostic.path}: ${diagnostic.message}`).join("\n");
}
function logClawExperimentalWarning(runtime) {
	runtime.log("Experimental: Claws contracts may change while RFC 0016 is under review.");
}
function logClawPlanNotices(diagnostics, runtime) {
	for (const diagnostic of diagnostics.filter((entry) => entry.level === "warning")) runtime.log(redactSensitiveText(`Notice: ${diagnostic.message}`));
}
function logClawAgentConfiguration(plan, runtime) {
	const { model, subagents } = plan.agent.config;
	if (model !== void 0) runtime.log(`Model: ${JSON.stringify(model)}`);
	if (subagents) {
		const targets = subagents.allowAgents?.join(", ") || (subagents.allowAgents ? "none" : "inherited");
		runtime.log(`Delegation: ${targets}; mode: ${subagents.delegationMode ?? "inherited"}`);
	}
	logClawPlanNotices(plan.diagnostics, runtime);
}
function logClawUpdatePlanSummary(plan, runtime) {
	runtime.log(`Agent: ${plan.agentId}`);
	runtime.log(`Update actions: ${plan.summary.totalActions}`);
	runtime.log(`Add: ${plan.summary.added}; change: ${plan.summary.changed}; remove: ${plan.summary.removed}; release: ${plan.summary.released}; unchanged: ${plan.summary.unchanged}; manual: ${plan.summary.manual}`);
	runtime.log(`Capability changes: ${plan.summary.capabilityChanges}; escalations requiring explicit review: ${plan.summary.capabilityEscalations}`);
	runtime.log(`Plan integrity: ${plan.planIntegrity}`);
	logClawPlanNotices(plan.diagnostics, runtime);
	if (plan.summary.capabilityEscalations > 0) runtime.log("Capability consent: the exact plan-integrity token binds every ! change disclosed below.");
	for (const change of plan.capabilityChanges) {
		const current = change.current?.summary ?? "unset";
		const desired = change.desired?.summary ?? "unset";
		runtime.log(`  ${change.requiresDistinctConsent ? "!" : "-"} ${change.path}: ${current} -> ${desired} (${change.action})`);
		runtime.log(redactSensitiveText(`      effect: ${JSON.stringify(change.effect)}`));
	}
	if (plan.readiness.requirements.length > 0) {
		runtime.log(`Setup requirements (${plan.readiness.requirements.length}):`);
		for (const requirement of plan.readiness.requirements) runtime.log(redactSensitiveText(`  - ${JSON.stringify(requirement)}`));
	}
	if (plan.blockers.length > 0) runtime.error(formatClawDiagnostics(plan.blockers));
}
//#endregion
export { logClawUpdatePlanSummary as a, findClawExtensionPackageCollisions as c, logClawExperimentalWarning as i, planClawExtensions as l, formatClawDiagnostics as n, buildClawAddPlan as o, logClawAgentConfiguration as r, clawProfileExtensionPackages as s, emitClawFailure as t };
