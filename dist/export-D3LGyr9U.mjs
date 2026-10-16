import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import "./utils-DgZn2dLu.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as isAvatarDataUrl, r as isAvatarHttpUrl } from "./avatar-policy-DiIdI6oM.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DQmvZkAl.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-B5B8MlNt.mjs";
import { n as prepareLocalAgentAvatarFile } from "./identity-avatar-file-CzAdV6tU.mjs";
import { a as isPortableClawAvatar, l as digestClawBytes } from "./schema-portability-DPQGHUzw.mjs";
import { t as CLAW_BOOTSTRAP_FILE_NAMES } from "./manifest-contract-DWbLdUlq.mjs";
import { a as MAX_MANAGED_WORKSPACE_BYTES, c as parseClawOpenClawProfile, l as materializeClawToolProfile, n as readClawManifestFile, r as MAX_CLAW_MANIFEST_BYTES, s as parseClawManifest } from "./reader-tis62fDs.mjs";
import { m as CLAW_OUTPUT_STABILITY } from "./mcp-A-4-BIRV.mjs";
import "./lifecycle-state-D5IOOLG7.mjs";
import { c as readClawStatus } from "./package-remove-plan-BJkvcHDT.mjs";
import { basename, dirname, relative, resolve, sep } from "node:path";
import { mkdir, realpath, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import { stringify } from "yaml";
//#region src/claws/export.ts
const CLAW_EXPORT_RESULT_SCHEMA_VERSION = "openclaw.clawExportResult.v1";
const MAX_EXPORT_FILE_BYTES = 1048576;
function decodeUtf8(content) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(content);
	} catch {
		return;
	}
}
const DRIFTED_BOOTSTRAP_STATES = /* @__PURE__ */ new Set([
	"modified",
	"unsafe",
	"unknown"
]);
var ClawExportError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawExportError";
	}
};
function definedFields(fields) {
	const result = {};
	for (const key in fields) if (fields[key] !== void 0) result[key] = fields[key];
	return result;
}
function portableAgent(agent, avatar) {
	const identity = definedFields({
		name: agent.identity?.name || void 0,
		theme: agent.identity?.theme || void 0,
		emoji: agent.identity?.emoji || void 0,
		avatar: avatar || void 0
	});
	return {
		id: agent.id,
		...definedFields({
			name: agent.name || void 0,
			description: agent.description || void 0,
			identity: Object.keys(identity).length > 0 ? identity : void 0
		})
	};
}
function portableOpenClawProfile(agent, extensions) {
	const configuredTools = definedFields({
		profile: agent.tools?.profile || void 0,
		allow: agent.tools?.allow?.length ? agent.tools.allow : void 0,
		alsoAllow: agent.tools?.alsoAllow?.length ? agent.tools.alsoAllow : void 0,
		deny: agent.tools?.deny?.length ? agent.tools.deny : void 0,
		fs: agent.tools?.fs?.workspaceOnly === true ? { workspaceOnly: true } : void 0
	});
	let tools = configuredTools;
	if (configuredTools.profile || configuredTools.allow?.length) try {
		tools = materializeClawToolProfile({ tools: configuredTools }).tools ?? {};
	} catch (error) {
		throw new ClawExportError("tool_profile_consent_required", `Could not freeze the exported tool profile: ${error.message}`);
	}
	const settings = definedFields({
		model: typeof agent.model === "string" ? { primary: agent.model } : agent.model,
		subagents: agent.subagents ? definedFields({
			allowAgents: agent.subagents.allowAgents,
			delegationMode: agent.subagents.delegationMode
		}) : void 0,
		groupChat: agent.groupChat?.mentionPatterns?.length ? { mentionPatterns: agent.groupChat.mentionPatterns } : void 0,
		sandbox: agent.sandbox ? definedFields({
			mode: agent.sandbox.mode || void 0,
			scope: agent.sandbox.scope || void 0,
			workspaceAccess: agent.sandbox.workspaceAccess || void 0
		}) : void 0,
		tools: Object.keys(tools).length > 0 ? tools : void 0,
		memory: agent.memory?.search ? { search: definedFields({
			enabled: agent.memory.search.enabled,
			rememberAcrossConversations: agent.memory.search.rememberAcrossConversations,
			sources: agent.memory.search.sources?.length ? agent.memory.search.sources : void 0
		}) } : void 0,
		heartbeat: agent.heartbeat ? definedFields({
			every: agent.heartbeat.every || void 0,
			activeHours: agent.heartbeat.activeHours ? definedFields({
				start: agent.heartbeat.activeHours.start || void 0,
				end: agent.heartbeat.activeHours.end || void 0,
				timezone: agent.heartbeat.activeHours.timezone || void 0
			}) : void 0,
			lightContext: agent.heartbeat.lightContext,
			isolatedSession: agent.heartbeat.isolatedSession,
			timeoutSeconds: agent.heartbeat.timeoutSeconds
		}) : void 0,
		humanDelay: agent.humanDelay ? definedFields({
			mode: agent.humanDelay.mode || void 0,
			minMs: agent.humanDelay.minMs,
			maxMs: agent.humanDelay.maxMs
		}) : void 0
	});
	if (extensions.length === 0 && Object.keys(settings).length === 0) return;
	const parsed = parseClawOpenClawProfile({
		schemaVersion: 1,
		agent: settings,
		extensions
	});
	if (!parsed.ok) throw new ClawExportError("export_openclaw_profile_invalid", parsed.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
	return parsed.profile;
}
function normalizedRelativePath(value) {
	return value.split(sep).join("/");
}
function comparePortableText(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
function isClawBootstrapFileName(value) {
	return CLAW_BOOTSTRAP_FILE_NAMES.includes(value);
}
async function readPortableAvatar(params) {
	const source = params.agent.identity?.avatar?.trim();
	if (!source) return {};
	if (isAvatarHttpUrl(source)) return {};
	if (isAvatarDataUrl(source)) return isPortableClawAvatar(source) ? { source } : {};
	const prepared = await prepareLocalAgentAvatarFile({
		cfg: params.config,
		agentId: params.agent.id,
		source,
		readBody: true
	});
	if (!prepared.ok || !prepared.file.body) return {};
	const path = normalizedRelativePath(relative(params.workspace, prepared.file.path));
	return {
		source: path,
		sidecar: {
			path,
			content: prepared.file.body
		}
	};
}
function derivativePackageVersion(manifest, contents) {
	const hash = createHash("sha256").update(JSON.stringify(manifest));
	for (const file of contents.toSorted((left, right) => comparePortableText(left.path, right.path))) hash.update(file.path).update("\0").update(file.content).update("\0");
	return `0.0.0-export.${hash.digest("hex")}`;
}
async function readAuthorBootstrap(path) {
	const resolvedPath = resolve(resolveUserPath(path));
	try {
		const read = await (await root(dirname(resolvedPath))).read(basename(resolvedPath), {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
			symlinks: "reject"
		});
		if (new TextDecoder("utf-8", { fatal: true }).decode(read.buffer).trim().length === 0) throw new ClawExportError("bootstrap_empty", "Export BOOTSTRAP.md must contain reviewed first-run instructions.");
		return read.buffer;
	} catch (error) {
		if (error instanceof ClawExportError) throw error;
		const tooLarge = error instanceof FsSafeError && error.code === "too-large";
		throw new ClawExportError(tooLarge ? "bootstrap_oversized" : "bootstrap_invalid", tooLarge ? `Export BOOTSTRAP.md exceeds ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES} bytes.` : `Could not read a safe UTF-8 BOOTSTRAP.md from ${JSON.stringify(resolvedPath)}: ${error.message}`);
	}
}
function portableMcpServer(server) {
	const common = {
		...server.toolFilter && typeof server.toolFilter === "object" ? { toolFilter: server.toolFilter } : {},
		...typeof server.timeout === "number" ? { timeout: server.timeout } : {},
		...typeof server.connectTimeout === "number" ? { connectTimeout: server.connectTimeout } : {}
	};
	if (typeof server.url === "string") {
		if (server.transport !== "sse" && server.transport !== "streamable-http") throw new Error("Managed remote MCP server has an unsupported transport.");
		return {
			url: server.url,
			transport: server.transport,
			...server.auth === "oauth" ? { auth: "oauth" } : {},
			...common
		};
	}
	if (typeof server.command !== "string") throw new Error("Managed MCP server has neither a command nor a remote URL.");
	return {
		command: server.command,
		...server.transport === "stdio" ? { transport: server.transport } : {},
		...Array.isArray(server.args) ? { args: server.args } : {},
		...server.env && typeof server.env === "object" ? { env: server.env } : {},
		...common
	};
}
async function exportClawAgent(agentId, outputDirectory, options) {
	const record = (await readClawStatus(agentId, options)).records.find((candidate) => candidate.install.agentId === agentId);
	if (!record) throw new ClawExportError("claw_not_found", `No installed Claw agent matches ${JSON.stringify(agentId)}.`);
	if (record.install.status !== "complete") throw new ClawExportError("install_incomplete", `Installed Claw agent ${JSON.stringify(agentId)} is in ${JSON.stringify(record.install.status)} state; finish or repair it before export.`);
	const agent = listAgentEntries(options.config).find((candidate) => candidate.id === agentId);
	if (!agent) throw new ClawExportError("agent_missing", `Installed Claw agent ${JSON.stringify(agentId)} is missing from config.`);
	const currentWorkspace = await realpath(resolve(resolveAgentWorkspaceDir(options.config, agentId))).catch(() => resolve(resolveAgentWorkspaceDir(options.config, agentId)));
	if (currentWorkspace !== record.install.workspace) throw new ClawExportError("workspace_changed", `Agent ${JSON.stringify(agentId)} now resolves to workspace ${JSON.stringify(currentWorkspace)} instead of its recorded Claw workspace ${JSON.stringify(record.install.workspace)}.`);
	if (record.agentState !== "present") throw new ClawExportError("agent_drifted", `Agent ${JSON.stringify(agentId)} no longer matches its recorded Claw configuration.`);
	const driftedFiles = record.workspaceFiles.filter((file) => file.state !== "unchanged");
	if (driftedFiles.length > 0) throw new ClawExportError("workspace_files_drifted", `Cannot export drifted managed files: ${driftedFiles.map((file) => `${file.path} (${file.state})`).join(", ")}.`);
	const driftedPackages = record.packages.filter((pkg) => pkg.state !== "present" || pkg.extensionCompatibility !== void 0 && pkg.extensionCompatibility.state !== "compatible");
	if (driftedPackages.length > 0) throw new ClawExportError("packages_drifted", `Cannot export drifted packages: ${driftedPackages.map((pkg) => `${pkg.kind}:${pkg.ref}@${pkg.version} (${pkg.extensionCompatibility?.state ?? pkg.state})`).join(", ")}.`);
	if (record.install.bootstrap && !options.bootstrapPath && DRIFTED_BOOTSTRAP_STATES.has(record.bootstrapState)) throw new ClawExportError("bootstrap_drifted", `Cannot export the package bootstrap ${JSON.stringify(record.bootstrap.path)} in ${JSON.stringify(record.bootstrapState)} state; restore the seeded file or pass a reviewed --bootstrap replacement.`);
	const unresolvedCronJobs = record.cronJobs.filter((cron) => cron.status !== "complete" || !cron.schedulerJobId);
	const unavailableMcpServers = record.mcpServers.filter((server) => server.state !== "present");
	if (unavailableMcpServers.length > 0) throw new ClawExportError("mcp_servers_unavailable", `Cannot export MCP servers with unresolved ownership or drift: ${unavailableMcpServers.map((server) => server.name).join(", ")}.`);
	if (unresolvedCronJobs.length > 0) throw new ClawExportError("cron_jobs_unavailable", `Cannot export cron declarations with unresolved ownership: ${unresolvedCronJobs.map((cron) => cron.manifestId).join(", ")}.`);
	const authorBootstrap = options.bootstrapPath ? await readAuthorBootstrap(options.bootstrapPath) : void 0;
	const workspace = await root(record.install.workspace, {
		hardlinks: "reject",
		maxBytes: MAX_EXPORT_FILE_BYTES,
		symlinks: "reject"
	});
	const allContents = await Promise.all(record.workspaceFiles.map(async (file) => ({
		path: normalizedRelativePath(file.path),
		content: await workspace.readBytes(file.path, { maxBytes: MAX_EXPORT_FILE_BYTES })
	})));
	const soul = allContents.find((file) => file.path === "SOUL.md");
	const decodedSoul = soul ? decodeUtf8(soul.content) : void 0;
	let clawMarkdownBody = soul && decodedSoul !== void 0 && decodedSoul.trim().length > 0 ? soul.content : void 0;
	const contents = allContents.filter((file) => file !== soul || !clawMarkdownBody);
	const avatar = await readPortableAvatar({
		config: options.config,
		agent,
		workspace: record.install.workspace
	});
	const managedPaths = new Set(contents.map((file) => file.path));
	if (avatar.sidecar && !managedPaths.has(avatar.sidecar.path)) contents.push(avatar.sidecar);
	let pendingPackageBootstrap;
	if (!authorBootstrap && record.install.bootstrap && record.bootstrapState === "pending") {
		try {
			pendingPackageBootstrap = await workspace.readBytes("BOOTSTRAP.md", { maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES });
		} catch (error) {
			throw new ClawExportError("bootstrap_drifted", `Cannot export the package bootstrap because BOOTSTRAP.md changed after inspection: ${error.message}`);
		}
		if (digestClawBytes(pendingPackageBootstrap) !== record.install.bootstrap.contentDigest) throw new ClawExportError("bootstrap_drifted", "Cannot export the package bootstrap because BOOTSTRAP.md changed after inspection.");
	}
	const exportedBootstrap = authorBootstrap ?? pendingPackageBootstrap;
	const bootstrapFiles = {};
	const files = [];
	for (const file of contents) {
		const source = `workspace/${file.path}`;
		if (isClawBootstrapFileName(file.path)) bootstrapFiles[file.path] = { source };
		else files.push({
			source,
			path: file.path
		});
	}
	const configuredMcpServers = normalizeConfiguredMcpServers(options.sourceMcpServers ?? options.config.mcp?.servers);
	const openClawProfile = portableOpenClawProfile(agent, record.packages.filter((pkg) => pkg.extension).map((pkg) => ({
		id: pkg.extension.id,
		kind: "plugin",
		format: pkg.extension.format,
		source: pkg.source,
		ref: pkg.ref,
		version: pkg.version
	})).toSorted((left, right) => comparePortableText(left.id, right.id)));
	const openClawProfilePath = "profiles/openclaw.yml";
	const openClawProfileRaw = openClawProfile ? Buffer.from(stringify(openClawProfile)) : void 0;
	const portablePackages = record.packages.filter((pkg) => !pkg.extension).map((pkg) => ({
		kind: pkg.kind,
		source: pkg.source,
		ref: pkg.ref,
		version: pkg.version
	})).toSorted((left, right) => {
		return comparePortableText(`${left.kind}:${left.ref}:${left.version}`, `${right.kind}:${right.ref}:${right.version}`);
	});
	const manifest = {
		schemaVersion: 1,
		agent: portableAgent(agent, avatar.source),
		workspace: {
			bootstrapFiles,
			files
		},
		packages: portablePackages,
		mcpServers: Object.fromEntries(record.mcpServers.map((ref) => [ref.name, portableMcpServer(configuredMcpServers[ref.name])])),
		cronJobs: record.cronJobs.map((cron) => cron.job).toSorted((left, right) => left.id.localeCompare(right.id))
	};
	const serializeClawMarkdown = (body) => Buffer.concat([Buffer.from(`---\n${stringify(manifest)}---\n`), ...body ? [body] : []]);
	let clawMarkdownRaw = serializeClawMarkdown(clawMarkdownBody);
	if (clawMarkdownBody && clawMarkdownRaw.byteLength > 1048576) {
		clawMarkdownBody = void 0;
		contents.push(soul);
		bootstrapFiles["SOUL.md"] = { source: "workspace/SOUL.md" };
		clawMarkdownRaw = serializeClawMarkdown(void 0);
	}
	if (clawMarkdownRaw.byteLength > 1048576) throw new ClawExportError("claw_manifest_oversized", `Exported CLAW.md exceeds ${MAX_CLAW_MANIFEST_BYTES} bytes.`);
	if (contents.reduce((total, file) => total + file.content.byteLength, 0) + (clawMarkdownBody?.byteLength ?? 0) > 4194304) throw new ClawExportError("workspace_files_oversized", `Exported workspace content exceeds ${MAX_MANAGED_WORKSPACE_BYTES} aggregate bytes.`);
	const parsed = parseClawManifest(manifest);
	if (!parsed.ok) throw new ClawExportError("export_manifest_invalid", parsed.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
	const target = resolve(resolveUserPath(outputDirectory));
	await mkdir(dirname(target), { recursive: true });
	try {
		await mkdir(target);
	} catch (error) {
		throw new ClawExportError("output_collision", `Export directory ${JSON.stringify(target)} must not already exist: ${error.message}`);
	}
	const filesWritten = [];
	try {
		const output = await root(target, {
			hardlinks: "reject",
			maxBytes: MAX_EXPORT_FILE_BYTES,
			symlinks: "reject"
		});
		for (const file of contents) {
			const path = `workspace/${file.path}`;
			await output.write(path, file.content, {
				mkdir: true,
				overwrite: false
			});
			filesWritten.push(path);
		}
		if (openClawProfileRaw) {
			await output.write(openClawProfilePath, openClawProfileRaw, {
				mkdir: true,
				overwrite: false
			});
			filesWritten.push(openClawProfilePath);
		}
		const packageJson = {
			name: `openclaw-claw-${record.install.agentId}`,
			version: derivativePackageVersion(manifest, [
				...contents,
				...clawMarkdownBody ? [{
					path: "CLAW.md#body",
					content: clawMarkdownBody
				}] : [],
				...openClawProfileRaw ? [{
					path: openClawProfilePath,
					content: openClawProfileRaw
				}] : [],
				...exportedBootstrap ? [{
					path: "BOOTSTRAP.md",
					content: exportedBootstrap
				}] : []
			]),
			type: "module",
			openclaw: { claw: "CLAW.md" }
		};
		await output.write("package.json", Buffer.from(`${JSON.stringify(packageJson, null, 2)}\n`), { overwrite: false });
		filesWritten.push("package.json");
		await output.write("CLAW.md", clawMarkdownRaw, { overwrite: false });
		filesWritten.push("CLAW.md");
		if (exportedBootstrap) {
			await output.write("BOOTSTRAP.md", exportedBootstrap, { overwrite: false });
			filesWritten.push("BOOTSTRAP.md");
		}
		const reread = await readClawManifestFile(target);
		if (!reread.ok) throw new ClawExportError("export_package_invalid", reread.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
	} catch (error) {
		await rm(target, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		if (error instanceof ClawExportError) throw error;
		throw new ClawExportError("export_write_failed", coerceErrorMessage(error));
	}
	return {
		schemaVersion: CLAW_EXPORT_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		agentId,
		outputDirectory: target,
		manifest,
		...openClawProfile ? { openClawProfile } : {},
		filesWritten
	};
}
//#endregion
export { portableOpenClawProfile as a, portableAgent as i, ClawExportError as n, exportClawAgent as r, CLAW_EXPORT_RESULT_SCHEMA_VERSION as t };
