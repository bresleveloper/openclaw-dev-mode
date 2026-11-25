import { n as resolveOpenShellPluginConfig, r as buildOpenShellBaseArgv } from "./config-xMr6yx5f.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { mutateConfigFile, readConfigFileSnapshotForWrite } from "openclaw/plugin-sdk/config-mutation";
import { runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { listAgentIds } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/health";
// extensions/openshell/src/worker-launch.ts
function createOpenShellWorkerNodeConfig(worker) {
	const { provider, credentialEnv, api, baseUrl, ...model } = worker.model;
	return {
		models: { providers: { [provider]: {
			api,
			baseUrl,
			apiKey: "${" + credentialEnv + "}",
			models: [{
				...model,
				name: model.id,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				}
			}]
		} } },
		nodeHost: { workerRuns: {
			enabled: true,
			isolation: "none"
		} },
		...worker.agentWorkspace ? {
			agents: {
				defaults: {
					workspace: worker.agentWorkspace.remoteRoot,
					skipBootstrap: true
				},
				entries: { [worker.agentWorkspace.agentId]: { workspace: worker.agentWorkspace.remoteRoot } }
			},
			plugins: {
				allow: ["file-transfer"],
				entries: { "file-transfer": { enabled: true } }
			}
		} : {}
	};
}
const OPEN_SHELL_AGENT_WORKSPACE_CHECK = String.raw`(root, stateDir) => {
  const fs = require("node:fs");
  const path = require("node:path");
  const state = path.resolve(stateDir);
  if (root === state || root.startsWith(state + "/") || state.startsWith(root + "/")) {
    throw new Error("Agent workspace must be separate from private node state");
  }
  let stat;
  try { stat = fs.statSync(root); } catch {
    throw new Error("Prepare the canonical agent workspace directory in this sandbox before starting or configuring its worker; setup never copies or seeds agent files");
  }
  if (!stat.isDirectory() || fs.realpathSync(root) !== root || stat.uid !== process.getuid() || (stat.mode & 0o077) !== 0) {
    throw new Error("Canonical agent workspace must be a private directory owned by the node user without symlink aliases");
  }
  fs.accessSync(root, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);
}`;
const OPEN_SHELL_WORKER_BOOTSTRAP = String.raw`
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
process.umask(0o077);
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => {
  input += chunk;
  if (Buffer.byteLength(input) > 131072) {
    console.error("OpenShell worker bootstrap input is too large");
    process.exit(1);
  }
});
process.stdin.on("end", () => {
  try {
    const { worker, config, target } = JSON.parse(input);
    input = "";
    const credential = process.env[worker.model.credentialEnv];
    if (!credential || !credential.startsWith("openshell:resolve:env:")) {
      throw new Error("OpenShell did not provide a broker placeholder for the configured credential environment; refusing worker startup");
    }
    if (worker.agentWorkspace) {
      (${OPEN_SHELL_AGENT_WORKSPACE_CHECK})(worker.agentWorkspace.remoteRoot, worker.stateDir);
    }
    const stateDir = path.resolve(worker.stateDir);
    fs.mkdirSync(stateDir, { recursive: true, mode: 0o700 });
    if (fs.realpathSync(stateDir) !== stateDir) {
      throw new Error("OpenShell worker state directory must not contain symlinks");
    }
    const stat = fs.statSync(stateDir);
    if ((stat.mode & 0o077) !== 0 || stat.uid !== process.getuid()) {
      throw new Error("OpenShell worker state directory must be private and owned by the node user");
    }
    const configPath = path.join(stateDir, "openclaw.json");
    try {
      fs.writeFileSync(configPath, JSON.stringify(config), { flag: "wx", mode: 0o600 });
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const existing = fs.lstatSync(configPath);
      if (!existing.isFile() || existing.isSymbolicLink() || (existing.mode & 0o077) !== 0 ||
          JSON.stringify(JSON.parse(fs.readFileSync(configPath, "utf8"))) !== JSON.stringify(config)) {
        throw new Error("OpenShell worker configuration already exists with different content or unsafe permissions; preserve the existing node and use another private stateDir");
      }
    }
    const env = {};
    for (const key of ["PATH", "HOME", "TMPDIR", "TMP", "TEMP", "LANG", "TZ", "NODE_EXTRA_CA_CERTS", "NODE_USE_SYSTEM_CA"]) {
      if (process.env[key]) env[key] = process.env[key];
    }
    // Node does not consume OpenShell's OpenSSL CA variable by itself.
    if (!env.NODE_EXTRA_CA_CERTS && process.env.SSL_CERT_FILE) {
      env.NODE_EXTRA_CA_CERTS = process.env.SSL_CERT_FILE;
    }
    env[worker.model.credentialEnv] = credential;
    env.OPENCLAW_STATE_DIR = stateDir;
    env.OPENCLAW_CONFIG_PATH = configPath;
    let targetPath;
    let args = ["node", "run", "--session-host"];
    if (target) {
      targetPath = path.join(stateDir, "pairing-target");
      fs.writeFileSync(targetPath, target, { flag: "wx", mode: 0o600 });
      args = ["connect", "--target-file", targetPath, "--session-host"];
    }
    const child = spawn(worker.nodeCommand, args, { env, stdio: "inherit" });
    for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
    const cleanup = () => {
      if (targetPath) {
        try { fs.unlinkSync(targetPath); } catch (error) { if (error.code !== "ENOENT") throw error; }
      }
    };
    child.on("error", () => {
      cleanup();
      console.error("OpenShell worker could not start the configured OpenClaw executable");
      process.exitCode = 1;
    });
    child.on("exit", (code, signal) => {
      cleanup();
      process.exitCode = code ?? (signal ? 1 : 0);
    });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
});
`;
// extensions/openshell/src/worker-workspace.ts
const WORKSPACE_COMMANDS = [
	"file.fetch",
	"file.stat",
	"file.write",
	"file.create",
	"dir.list",
	"workspace.memory",
	"workspace.skills"
];
/** Compose existing File Transfer configuration; never replace an operator's grants. */
function prepareOpenShellAgentWorkspace(config, workspace, nodeId, runtimeConfig) {
	const plugins = config.plugins;
	const entry = plugins?.entries?.["file-transfer"];
	if (plugins?.enabled === false || entry?.enabled === false || plugins?.deny?.includes("file-transfer") || plugins?.allow?.length && !plugins.allow.includes("file-transfer")) throw new Error("Agent workspace binding requires File Transfer; preserve the existing plugin restriction and enable it explicitly before retrying.");
	const commands = config.gateway?.nodes?.commands;
	const missing = WORKSPACE_COMMANDS.filter((command) => !commands?.allow?.includes(command) || commands.deny?.includes(command));
	if (missing.length) throw new Error("Agent workspace binding needs existing Gateway node-command grants (and pairing approval): " + missing.join(", ") + ". Review gateway.nodes.commands; setup does not change command approvals.");
	const ids = listAgentIds(runtimeConfig);
	if (!ids.includes(workspace.agentId)) throw new Error("Agent workspace binding requires an exact configured agent ID.");
	const previous = entry?.config ?? {};
	if (previous.policyVersion !== void 0 && previous.policyVersion !== 2 || previous.policyVersion === void 0 && Object.keys(previous).length > 0) throw new Error("Review existing File Transfer permissions with file-transfer approvals migrate before adding an agent workspace binding.");
	const workspaces = asOptionalRecord(previous.workspaces) ?? {};
	const binding = {
		nodeId,
		remoteRoot: workspace.remoteRoot
	};
	const matches = (value) => {
		const old = asOptionalRecord(value);
		return old?.nodeId === nodeId && old.remoteRoot === workspace.remoteRoot;
	};
	if (workspaces[workspace.agentId] && !matches(workspaces[workspace.agentId])) throw new Error("This agent already has a different canonical workspace binding; setup does not migrate or replace it.");
	const localRoot = path.resolve(resolveAgentWorkspaceDir(runtimeConfig, workspace.agentId));
	for (const id of ids) if (id !== workspace.agentId && path.resolve(resolveAgentWorkspaceDir(runtimeConfig, id)) === localRoot && !matches(workspaces[id])) throw new Error("Another agent shares this Gateway workspace. Give the selected agent its own workspace before binding it remotely.");
	const nodes = asOptionalRecord(previous.nodes) ?? {};
	const root = workspace.remoteRoot;
	const policy = {
		ask: "off",
		followSymlinks: false,
		allowReadPaths: [root, root + "/**"],
		allowWritePaths: [
			"AGENTS.md",
			"SOUL.md",
			"IDENTITY.md",
			"USER.md",
			"BOOTSTRAP.md",
			"MEMORY.md",
			"DREAMS.md",
			"memory",
			"memory/**",
			"skills",
			"skills/**",
			".clawhub/lock.json",
			".clawdhub/lock.json",
			".openclaw/skill-installs",
			".openclaw/skill-installs/**",
			"media/inbound/openclaw-staged-*",
			"media/inbound/openclaw-staged-*/**"
		].map((relative) => root + "/" + relative)
	};
	return {
		...entry,
		enabled: true,
		config: {
			...previous,
			policyVersion: 2,
			workspaces: {
				...workspaces,
				[workspace.agentId]: binding
			},
			nodes: Object.keys(nodes).length > 0 ? nodes : { [nodeId]: policy }
		}
	};
}
// extensions/openshell/src/worker-cli.ts
function requireWorker(config) {
	const plugin = resolveOpenShellPluginConfig(config.plugins?.entries?.openshell?.config);
	if (!plugin.worker || plugin.providers.length === 0) throw new Error("Configure openshell.worker and at least one existing openshell.providers credential provider first. Worker setup never auto-creates providers or reads host model credentials.");
	return {
		plugin,
		worker: plugin.worker
	};
}
function requireName(value) {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 19) throw new Error("OpenShell worker sandbox names must be 1–19 lowercase letters, digits, or single hyphens.");
	return value;
}
async function readPairingTarget(file) {
	if (!file) return;
	const handle = await fsPromises.open(file, "r");
	try {
		const stat = await handle.stat();
		if (!stat.isFile() || stat.size > 65536) throw new Error("Pairing target must be a regular file of at most 64 KiB.");
		const target = (await handle.readFile("utf8")).trim();
		if (!target || Buffer.byteLength(target) > 65536) throw new Error("Pairing target file must contain a nonempty join URL or setup code of at most 64 KiB.");
		return target;
	} finally {
		await handle.close();
	}
}
async function runOpenShellWorker(config, sandbox, options) {
	const { plugin, worker } = requireWorker(config);
	requireName(sandbox);
	const target = await readPairingTarget(options.targetFile);
	const argv = buildOpenShellBaseArgv(plugin);
	for (const provider of plugin.providers) if ((await runUtf8CommandWithTimeout([
		...argv,
		"sandbox",
		"provider",
		"attach",
		sandbox,
		provider,
		"--wait"
	], {
		timeoutMs: plugin.timeoutMs,
		killProcessTree: true
	})).code !== 0) throw new Error("OpenShell credential attachment is not ready; inspect sandbox provider status before retrying. No node was started.");
	const controller = new AbortController();
	const stop = () => controller.abort();
	process.once("SIGINT", stop);
	process.once("SIGTERM", stop);
	const failures = [];
	try {
		if ((await runUtf8CommandWithTimeout([
			...argv,
			"sandbox",
			"exec",
			sandbox,
			"--no-tty",
			"--no-login-shell",
			"--",
			worker.nodeExecutable,
			"-e",
			OPEN_SHELL_WORKER_BOOTSTRAP
		], {
			input: JSON.stringify({
				worker,
				config: createOpenShellWorkerNodeConfig(worker),
				target
			}),
			signal: controller.signal,
			killProcessTree: true,
			outputCapture: "discard",
			onOutputChunk: (chunk, stream) => {
				(stream === "stdout" ? process.stdout : process.stderr).write(chunk);
			}
		})).code !== 0) throw new Error("OpenShell worker node stopped unsuccessfully. Inspect the node and sandbox before restarting; no Gateway inference fallback was enabled.");
	} catch (error) {
		failures.push(error);
	}
	try {
		if ((await runUtf8CommandWithTimeout([
			...argv,
			"sandbox",
			"stop",
			sandbox
		], {
			timeoutMs: plugin.timeoutMs,
			killProcessTree: true
		})).code !== 0) throw new Error("OpenShell stop failed");
	} catch (error) {
		failures.push(new Error("OpenShell sandbox stop was not confirmed; the remote node may still be active. Inspect and stop this dedicated sandbox before retrying.", { cause: error }));
	} finally {
		process.off("SIGINT", stop);
		process.off("SIGTERM", stop);
	}
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "OpenShell worker failed and sandbox stop was not confirmed; inspect and stop the dedicated sandbox before retrying.");
}
async function configureWorkerProfile(sandbox, options) {
	requireName(sandbox);
	const profile = options.workerProfile?.trim();
	if (!profile || [
		"__proto__",
		"prototype",
		"constructor"
	].includes(profile)) throw new Error("Supply an exact --worker-profile name.");
	const prepared = await readConfigFileSnapshotForWrite();
	if (!prepared.snapshot.valid) throw new Error("Fix the Gateway configuration before configuring a worker profile.");
	const source = prepared.snapshot.sourceConfig;
	const { plugin, worker } = requireWorker(prepared.snapshot.runtimeConfig);
	if (source.gateway?.mode === "remote") throw new Error("Run worker configure on the Gateway host; remote-mode local config is not the Gateway config.");
	const identity = await runUtf8CommandWithTimeout([
		...buildOpenShellBaseArgv(plugin),
		"sandbox",
		"exec",
		sandbox,
		"--no-tty",
		"--no-login-shell",
		"--env",
		"OPENCLAW_STATE_DIR=" + worker.stateDir,
		"--env",
		"OPENCLAW_CONFIG_PATH=" + path.posix.join(worker.stateDir, "openclaw.json"),
		"--",
		worker.nodeCommand,
		"node",
		"identity",
		"--json"
	], {
		timeoutMs: plugin.timeoutMs,
		killProcessTree: true
	});
	if (identity.code !== 0) throw new Error("Could not read the node identity inside this sandbox. Start and pair its worker node first.");
	let device;
	try {
		device = z.object({ deviceId: z.string().regex(/^[a-f0-9]{64}$/) }).parse(JSON.parse(identity.stdout)).deviceId;
	} catch {
		throw new Error("OpenShell sandbox returned an invalid node identity.");
	}
	if (options.device && options.device.trim() !== device) throw new Error("The expected device does not match this OpenShell sandbox node. No configuration was changed.");
	const previous = source.cloudWorkers?.profiles?.[profile];
	if (previous && (previous.provider !== "device" || previous.settings?.device !== device || previous.settings?.inference !== "worker")) throw new Error("That profile already has a different worker binding. Reclaim its sessions and choose a new profile name; existing placements are not rewritten.");
	if (options.required && source.cloudWorkers?.requiredProfile && source.cloudWorkers.requiredProfile !== profile) throw new Error("Another required worker profile is configured. Preserve it or remove it explicitly before changing the required destination.");
	const nextProfile = previous ?? {
		provider: "device",
		settings: {
			device,
			inference: "worker"
		}
	};
	const agentWorkspace = worker.agentWorkspace;
	const fileTransfer = agentWorkspace ? prepareOpenShellAgentWorkspace(source, agentWorkspace, device, prepared.snapshot.runtimeConfig) : void 0;
	if (agentWorkspace) {
		const script = [
			"const fs = require(\"node:fs\"); const path = require(\"node:path\");",
			"const {workspace, stateDir} = JSON.parse(fs.readFileSync(0, \"utf8\"));",
			"(" + OPEN_SHELL_AGENT_WORKSPACE_CHECK + ")(workspace.remoteRoot, stateDir);",
			"const file = path.join(stateDir, \"openclaw.json\"); const stat = fs.lstatSync(file);",
			"if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o077) || stat.uid !== process.getuid()) throw new Error(\"Unsafe node configuration\");",
			"const cfg = JSON.parse(fs.readFileSync(file, \"utf8\"));",
			"if (cfg.agents?.entries?.[workspace.agentId]?.workspace !== workspace.remoteRoot || cfg.plugins?.entries?.[\"file-transfer\"]?.enabled !== true) throw new Error(\"Start the node with this agentWorkspace configuration first\");",
			"process.stdout.write(workspace.remoteRoot);"
		].join("\n");
		const verified = await runUtf8CommandWithTimeout([
			...buildOpenShellBaseArgv(plugin),
			"sandbox",
			"exec",
			sandbox,
			"--no-tty",
			"--no-login-shell",
			"--",
			worker.nodeExecutable,
			"-e",
			script
		], {
			timeoutMs: plugin.timeoutMs,
			killProcessTree: true,
			input: JSON.stringify({
				workspace: agentWorkspace,
				stateDir: worker.stateDir
			})
		});
		if (verified.code !== 0 || verified.stdout.trim() !== agentWorkspace.remoteRoot) throw new Error("Canonical agent workspace is not ready. Prepare its private directory and start this node with the matching agentWorkspace settings first; no Gateway configuration was changed.");
	}
	if (options.apply) await mutateConfigFile({
		base: "source",
		baseHash: prepared.snapshot.hash,
		writeOptions: prepared.writeOptions,
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			const workers = draft.cloudWorkers ??= {};
			workers.profiles = {
				...workers.profiles,
				[profile]: nextProfile
			};
			if (options.required) workers.requiredProfile = profile;
			if (fileTransfer) {
				const plugins = draft.plugins ??= {};
				plugins.entries = {
					...plugins.entries,
					"file-transfer": fileTransfer
				};
			}
		}
	});
	process.stdout.write(JSON.stringify({
		applied: options.apply === true,
		cloudWorkers: {
			profiles: { [profile]: nextProfile },
			...options.required ? { requiredProfile: profile } : {}
		},
		...agentWorkspace ? { agentWorkspace: {
			...agentWorkspace,
			nodeId: device,
			tools: ["file_fetch", "file_write"],
			note: "Remote canonical files; no local copy or fallback. Existing File Transfer policy and command approvals remain authoritative. Ordinary coding tools still use the session task workspace."
		} } : {},
		model: worker.model.provider + "/" + worker.model.id,
		next: "Use this model's non-secret metadata and the OpenClaw runtime on the Gateway. Device pairing, current availability, worker capability, and model admission are checked at dispatch. The device identity was read inside the selected sandbox; broker egress remains the OpenShell deployment trust contract."
	}, null, 2) + "\n");
}
function registerOpenShellWorkerCli(program, config) {
	const worker = program.command("openshell").description("Manage OpenShell brokered workers").command("worker").description("Run a native worker node inside an OpenShell sandbox");
	worker.command("create <sandbox>").description("Create a retained broker-attached sandbox (never auto-import host credentials)").action(async (sandbox) => {
		const { plugin } = requireWorker(config);
		requireName(sandbox);
		if ((await runUtf8CommandWithTimeout([
			...buildOpenShellBaseArgv(plugin),
			"sandbox",
			"create",
			"--name",
			sandbox,
			"--from",
			plugin.from,
			"--detach",
			"--no-auto-providers",
			...plugin.policy ? ["--policy", plugin.policy] : [],
			...plugin.providers.flatMap((provider) => ["--provider", provider]),
			"--",
			"sleep",
			"infinity"
		], {
			timeoutMs: Math.max(plugin.timeoutMs, 3e5),
			killProcessTree: true
		})).code !== 0) throw new Error("OpenShell worker sandbox creation did not complete. Inspect the named sandbox before retrying; it has not been deleted or replaced.");
		process.stdout.write("Sandbox created. Run openshell worker run with a private pairing target file to enroll its node. The sandbox is retained until explicitly stopped/deleted.\n");
	});
	worker.command("run <sandbox>").description("Run a dedicated brokered node; stops the entire sandbox on exit or cancellation").option("--target-file <path>", "Private local file containing a single-use OpenClaw join URL or setup code; never put it in argv").action((sandbox, options) => runOpenShellWorker(config, sandbox, options));
	worker.command("configure <sandbox>").description("Preview or apply a paired-device worker-inference profile on this Gateway").requiredOption("--worker-profile <id>", "New Gateway worker profile name").option("--device <id>", "Optional expected paired device ID; rejects a sandbox mismatch").option("--required", "Require this profile for all sessions; unavailable workers block turns").option("--apply", "Persist the displayed profile; otherwise leave configuration unchanged").action(configureWorkerProfile);
}
export { registerOpenShellWorkerCli };
