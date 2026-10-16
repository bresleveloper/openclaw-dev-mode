import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { p as resolveGatewayServiceDescription } from "./constants-BLghGsId.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-O33D01XW.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { n as resolveGatewayStateDir, t as resolveDaemonHomeDir } from "./paths-DMJOvLwv.mjs";
import { o as resolveGatewaySupervisorLogPaths } from "./restart-logs-6OI2aKFf.mjs";
import { t as getWindowsCmdExePath } from "./windows-install-roots-Qi4d52Il.mjs";
import { c as withGatewayServiceInstallationRecovery, i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-CoX8GMUL.mjs";
import { t as execFileUtf8 } from "./exec-file-DeUuidUQ.mjs";
import { i as ServiceOwnershipRefusalError } from "./service-inspection-error-Bsltcpi4.mjs";
import { i as readServiceFileState, n as matchesServiceFilePublication, r as publishServiceFile } from "./service-stage-DxRqPldv.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-CDVrpZuO.mjs";
import { a as normalizeEnvVarKey } from "./host-env-security-BgpkByrc.mjs";
import { a as normalizeLaunchdPlistXml, i as decodeLaunchdPlistMetadata, o as quoteLaunchAgentEnvironmentValue, r as buildLaunchAgentPlist, s as readLaunchAgentProgramArgumentsFromFile, t as LAUNCH_AGENT_ENV_WRAPPER_SHELL } from "./launchd-plist-zSdg3_Ip.mjs";
import { n as normalizeWindowsPathSeparators, t as formatLine } from "./output-EUQq_O0z.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { DOMParser } from "linkedom";
//#region src/daemon/launchd-exec.ts
/** Shared launchctl execution and result classification for macOS service owners. */
async function execLaunchctl(args, timeoutMs) {
	const isWindows = process.platform === "win32";
	const file = isWindows ? getWindowsCmdExePath() : "launchctl";
	const fileArgs = isWindows ? [
		"/d",
		"/s",
		"/c",
		"launchctl",
		...args
	] : args;
	return await execFileUtf8(file, fileArgs, timeoutMs && timeoutMs > 0 ? {
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	} : {});
}
function launchctlInspectionReason(result, target) {
	if (result.termination === "error" && ["EACCES", "EPERM"].includes(result.errorCode ?? "")) return "service-manager-access-denied";
	if (result.termination === "exit" && [
		1,
		13,
		125
	].includes(result.code)) return target.startsWith("system/") ? "launchd-system-domain-unavailable" : "launchd-gui-domain-unavailable";
}
function isLaunchctlNotLoaded(result) {
	const detail = normalizeLowercaseStringOrEmpty(result.stderr || result.stdout);
	return result.termination === "exit" && (detail.includes("no such process") || detail.includes("could not find service") || detail.includes("not found"));
}
function formatLaunchctlResultDetail(result) {
	const sanitized = sanitizeForLog((result.stderr || result.stdout).replace(/[\r\n\t]+/g, " ")).replace(/\s+/g, " ").trim();
	return truncateUtf16Safe(sanitized, 1e3);
}
//#endregion
//#region src/daemon/launchd-system.ts
/** Detects system-domain launchd ownership before mutating a user LaunchAgent. */
const SYSTEM_LAUNCH_DAEMON_DIR = "/Library/LaunchDaemons";
function formatUnknownError(error) {
	const raw = error instanceof Error ? error.message : String(error);
	return truncateUtf16Safe(sanitizeForLog(raw), 500);
}
/**
* Renders the package-independent ownership probe used by detached restart helpers.
* The caller must refuse activation when `openclaw_system_launchd_conflict` is non-empty.
*/
function renderSystemLaunchDaemonOwnershipShellProbe(label) {
	const serviceTarget = `system/${label}`;
	return `openclaw_system_launchd_conflict=""
openclaw_system_launchd_detail=""
openclaw_system_launchd_target=${quoteCliArg(serviceTarget)}
openclaw_system_launchd_dir=${quoteCliArg(SYSTEM_LAUNCH_DAEMON_DIR)}
openclaw_system_launchd_label=${quoteCliArg(label)}
openclaw_query_system_launchd() {
  openclaw_system_launchd_probe=$(launchctl print "$openclaw_system_launchd_target" 2>&1)
  openclaw_system_launchd_probe_status=$?
  # POSIX shell status 126/127 means execution failed; >128 can represent a signal.
  # Partial absence output cannot establish that the ownership query completed.
  if [ "$openclaw_system_launchd_probe_status" -eq 0 ]; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_target"
    openclaw_system_launchd_detail="loaded system LaunchDaemon $openclaw_system_launchd_target"
  elif [ "$openclaw_system_launchd_probe_status" -eq 126 ] || [ "$openclaw_system_launchd_probe_status" -eq 127 ] || [ "$openclaw_system_launchd_probe_status" -gt 128 ] ||
       ! printf '%s' "$openclaw_system_launchd_probe" | /usr/bin/grep -Eiq 'could not find service|no such process|not found'; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_target"
    openclaw_system_launchd_detail="could not verify $openclaw_system_launchd_target (exit $openclaw_system_launchd_probe_status): $openclaw_system_launchd_probe"
  fi
}
openclaw_query_system_launchd
if [ -z "$openclaw_system_launchd_conflict" ]; then
  if [ ! -e "$openclaw_system_launchd_dir" ]; then
    :
  elif [ ! -r "$openclaw_system_launchd_dir" ] || [ ! -x "$openclaw_system_launchd_dir" ]; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
    openclaw_system_launchd_detail="could not inspect $openclaw_system_launchd_dir"
  else
    openclaw_system_launchd_entries=""
    if openclaw_system_launchd_entries=$(/usr/bin/mktemp "\${TMPDIR:-/tmp}/openclaw-launchd-scan.XXXXXX" 2>&1); then
      if /usr/bin/find "$openclaw_system_launchd_dir" -mindepth 1 -maxdepth 1 -name '*.plist' -print0 >"$openclaw_system_launchd_entries"; then
        while IFS= read -r -d '' openclaw_system_launchd_plist; do
          # Unreadable plists are treated as foreign: loaded same-label daemons are caught by the
          # bracketing launchctl probes; an unloaded unreadable same-label plist is an accepted operator-created edge (#120481).
          if [ ! -r "$openclaw_system_launchd_plist" ]; then
            continue
          fi
          # Preserve exact string labels, including trailing newlines, on both parser paths.
          # plutil documents exit 1 for parse failure. Signals/execution errors cannot
          # establish a missing Label, even if a later lint accepts the same plist.
          if openclaw_system_launchd_plist_label=$(/usr/bin/plutil -extract Label raw -expect string -n -o - -- "$openclaw_system_launchd_plist" 2>&1; openclaw_system_launchd_parse_status=$?; printf '.'; exit "$openclaw_system_launchd_parse_status"); then
            openclaw_system_launchd_plist_label=\${openclaw_system_launchd_plist_label%.}
            if [ "$openclaw_system_launchd_plist_label" != "$openclaw_system_launchd_label" ]; then
              continue
            fi
            openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
            openclaw_system_launchd_detail="installed same-label system LaunchDaemon plist $openclaw_system_launchd_plist"
            break
          elif [ "$?" -eq 1 ] && /usr/bin/plutil -lint -- "$openclaw_system_launchd_plist" >/dev/null 2>&1; then
            continue
          else
            # Endpoint protection can deny plutil while allowing a real read. The system
            # Perl reader survives package swaps and classifies errno, not diagnostic text.
            openclaw_system_launchd_snapshot=$(/usr/bin/mktemp "\${TMPDIR:-/tmp}/openclaw-launchd-plist.XXXXXX")
            if [ -n "$openclaw_system_launchd_snapshot" ]; then
              /usr/bin/perl -e '
use strict;
use Fcntl qw(O_RDONLY O_NONBLOCK);
use Errno qw(EACCES EPERM ENOENT ENOTDIR);
sub read_failed {
  my $code = 0 + $!;
  exit(($code == EACCES || $code == EPERM) ? 77 :
       ($code == ENOENT || $code == ENOTDIR) ? 66 : 74);
}
$SIG{ALRM} = sub { exit 74; };
alarm 5;
sysopen(my $file, $ARGV[0], O_RDONLY | O_NONBLOCK) or read_failed();
-f $file or exit 74;
# Inherited PERL_UNICODE must not turn binary plist input into a UTF-8 handle.
binmode $file;
binmode STDOUT;
my $total = 0;
while (1) {
  my $count = sysread($file, my $bytes, 65536);
  defined($count) or read_failed();
  last if !$count;
  $total += $count;
  $total <= 1048576 or exit 75;
  print STDOUT $bytes or exit 74;
}
close($file) or read_failed();
close(STDOUT) or exit 74;
' "$openclaw_system_launchd_plist" >"$openclaw_system_launchd_snapshot" 2>/dev/null
              openclaw_system_launchd_read_status=$?
              if [ "$openclaw_system_launchd_read_status" -eq 77 ] || [ "$openclaw_system_launchd_read_status" -eq 66 ]; then
                /bin/rm -f "$openclaw_system_launchd_snapshot"
                continue
              elif [ "$openclaw_system_launchd_read_status" -eq 0 ]; then
                # The sentinel preserves label newlines through command substitution.
                if openclaw_system_launchd_plist_label=$(/usr/bin/plutil -extract Label raw -expect string -n -o - -- - <"$openclaw_system_launchd_snapshot" 2>/dev/null; openclaw_system_launchd_parse_status=$?; printf '.'; exit "$openclaw_system_launchd_parse_status"); then
                  openclaw_system_launchd_plist_label=\${openclaw_system_launchd_plist_label%.}
                  /bin/rm -f "$openclaw_system_launchd_snapshot"
                  if [ "$openclaw_system_launchd_plist_label" != "$openclaw_system_launchd_label" ]; then
                    continue
                  fi
                  openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
                  openclaw_system_launchd_detail="installed same-label system LaunchDaemon plist $openclaw_system_launchd_plist"
                  break
                elif [ "$?" -eq 1 ] && /usr/bin/plutil -lint -- - <"$openclaw_system_launchd_snapshot" >/dev/null 2>&1; then
                  /bin/rm -f "$openclaw_system_launchd_snapshot"
                  continue
                fi
              fi
              /bin/rm -f "$openclaw_system_launchd_snapshot"
            fi
            openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
            openclaw_system_launchd_detail="could not inspect system LaunchDaemon plist $openclaw_system_launchd_plist: $openclaw_system_launchd_plist_label"
            break
          fi
        done <"$openclaw_system_launchd_entries"
      else
        openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
        openclaw_system_launchd_detail="could not enumerate $openclaw_system_launchd_dir"
      fi
      /bin/rm -f "$openclaw_system_launchd_entries"
    else
      openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
      openclaw_system_launchd_detail="could not create a secure system LaunchDaemon scan snapshot: $openclaw_system_launchd_entries"
    fi
  fi
fi
if [ -z "$openclaw_system_launchd_conflict" ]; then
  openclaw_query_system_launchd
fi
`;
}
async function findInstalledSystemLaunchDaemon(label) {
	let entries;
	try {
		entries = await fs.readdir(SYSTEM_LAUNCH_DAEMON_DIR);
	} catch (error) {
		if (isMissingPathError(error)) return { status: "absent" };
		return {
			status: "unverifiable",
			detail: formatUnknownError(error)
		};
	}
	for (const entry of entries.filter((candidate) => candidate.endsWith(".plist")).toSorted()) {
		const plistPath = path.posix.join(SYSTEM_LAUNCH_DAEMON_DIR, entry);
		try {
			const contents = await fs.readFile(plistPath).catch((error) => {
				if (isMissingPathError(error) || hasErrnoCode(error, "EACCES") || hasErrnoCode(error, "EPERM")) return null;
				throw error;
			});
			if (contents === null) continue;
			if ((await decodeLaunchdPlistMetadata(contents))?.Label === label) return {
				status: "installed",
				plistPath
			};
		} catch (error) {
			return {
				status: "unverifiable",
				detail: `${plistPath}: ${formatUnknownError(error)}`
			};
		}
	}
	return { status: "absent" };
}
function classifySystemLaunchDaemonQuery(serviceTarget, result) {
	if (result.code === 0) return {
		status: "loaded",
		serviceTarget
	};
	return isLaunchctlNotLoaded(result) ? {
		status: "absent",
		serviceTarget
	} : {
		status: "unverifiable",
		serviceTarget,
		operation: "launchctl",
		detail: formatLaunchctlResultDetail(result) || `exit code ${result.code}`,
		reason: launchctlInspectionReason(result, serviceTarget)
	};
}
async function inspectSystemLaunchDaemonOwnership(label, options = {}) {
	const serviceTarget = `system/${label}`;
	if (process.platform !== "darwin") return {
		status: "absent",
		serviceTarget
	};
	const initialQuery = classifySystemLaunchDaemonQuery(serviceTarget, await execLaunchctl(["print", serviceTarget], options.timeoutMs));
	if (initialQuery.status !== "absent") return initialQuery;
	if (options.scanInstalledPlists === false) return {
		status: "absent",
		serviceTarget
	};
	const installed = await findInstalledSystemLaunchDaemon(label);
	if (installed.status === "installed") return {
		status: "installed",
		serviceTarget,
		plistPath: installed.plistPath
	};
	if (installed.status === "unverifiable") return {
		status: "unverifiable",
		serviceTarget,
		operation: "filesystem",
		detail: installed.detail
	};
	return classifySystemLaunchDaemonQuery(serviceTarget, await execLaunchctl(["print", serviceTarget], options.timeoutMs));
}
function formatSystemLaunchDaemonOwnershipSummary(ownership) {
	switch (ownership.status) {
		case "loaded": return `System LaunchDaemon ${ownership.serviceTarget} already owns this gateway label.`;
		case "installed": return `System LaunchDaemon plist ${ownership.plistPath} already owns this gateway label.`;
		case "unverifiable": return `System LaunchDaemon ownership for ${ownership.serviceTarget} could not be verified: ${ownership.detail}`;
		default: throw new Error(`Unexpected system LaunchDaemon ownership: ${String(ownership)}`);
	}
}
function formatSystemLaunchDaemonOwnershipError(ownership) {
	const recovery = ownership.status === "loaded" ? `Keep it as the sole gateway manager, or unload it with \`sudo launchctl bootout ${ownership.serviceTarget}\` and remove its plist before retrying.` : ownership.status === "installed" ? `Keep it as the sole gateway manager, or remove or relocate ${quoteCliArg(ownership.plistPath)} before retrying.` : "Fix the reported launchctl or filesystem access error, then retry.";
	return [
		formatSystemLaunchDaemonOwnershipSummary(ownership),
		"Refusing to create or activate a user LaunchAgent for the same label because duplicate KeepAlive managers can restart-loop the gateway.",
		"OpenClaw does not manage system LaunchDaemons, and --force does not override system ownership.",
		recovery
	].join("\n");
}
var SystemLaunchDaemonOwnershipError = class extends ServiceOwnershipRefusalError {
	constructor(ownership) {
		super("launchd-system-owned", formatSystemLaunchDaemonOwnershipError(ownership));
		this.ownership = ownership;
		this.code = "SYSTEM_LAUNCH_DAEMON_OWNERSHIP";
		this.name = "SystemLaunchDaemonOwnershipError";
	}
};
function isSystemLaunchDaemonOwnershipError(error) {
	return error instanceof SystemLaunchDaemonOwnershipError;
}
async function assertNoSystemLaunchDaemonOwnership(label) {
	const ownership = await inspectSystemLaunchDaemonOwnership(label);
	if (ownership.status !== "absent") throw new SystemLaunchDaemonOwnershipError(ownership);
}
//#endregion
//#region src/daemon/service-policy-xml.ts
/** Preserve audited native policy nodes without decoding plist data/date values as JSON. */
function preserveServicePolicyXml(generated, previous, keys, format) {
	const parser = new DOMParser();
	const candidate = parser.parseFromString(generated, "text/xml");
	const installed = parser.parseFromString(previous, "text/xml");
	const field = (document, key) => format === "plist" ? [...document.querySelectorAll("plist > dict > key")].find((node) => node.textContent === key)?.nextElementSibling : document.querySelector(key.replaceAll(".", " > "));
	for (const key of keys) {
		const original = field(installed, key);
		const replacement = field(candidate, key);
		if (!original || !replacement) throw new Error(`Custom service policy ${key} disappeared before publication.`);
		replacement.replaceWith(original.cloneNode(true));
	}
	return `${generated.slice(0, generated.indexOf(`<${format}`))}${candidate.documentElement.outerHTML}\n`;
}
//#endregion
//#region src/daemon/launchd-service-files.ts
/** LaunchAgent plist, environment-file, and atomic publication ownership. */
const LAUNCH_AGENT_DIR_MODE = 493;
const LAUNCH_AGENT_PLIST_MODE = 420;
const LAUNCH_AGENT_PRIVATE_DIR_MODE = 448;
const LAUNCH_AGENT_ENV_FILE_MODE = 384;
const LAUNCH_AGENT_ENV_WRAPPER_MODE = 448;
const LAUNCH_AGENT_ENV_DIR_NAME = "service-env";
const LAUNCH_AGENT_ENV_FILE_HEADER = "# Generated by OpenClaw. Do not edit while the gateway service is installed.";
function resolveLaunchAgentPlistPathForLabel(env, label) {
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	return path.posix.join(home, "Library", "LaunchAgents", `${label}.plist`);
}
function resolveLaunchAgentEnvDir(env) {
	return path.join(resolveGatewayStateDir(env), LAUNCH_AGENT_ENV_DIR_NAME);
}
function resolveLaunchAgentEnvFilePath(env, label) {
	return path.join(resolveLaunchAgentEnvDir(env), `${label}.env`);
}
function resolveLaunchAgentEnvWrapperPath(env, label) {
	return path.join(resolveLaunchAgentEnvDir(env), `${label}-env-wrapper.sh`);
}
function collectLaunchAgentEnvironmentEntries(environment) {
	const entries = [];
	for (const [rawKey, rawValue] of Object.entries(environment ?? {})) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		const value = rawValue?.trim();
		if (!key || value === void 0 || !value && key !== "NODE_OPTIONS") continue;
		entries.push([key, value]);
	}
	return entries.toSorted(([left], [right]) => left.localeCompare(right));
}
function buildLaunchAgentEnvironmentFile(entries) {
	return [
		LAUNCH_AGENT_ENV_FILE_HEADER,
		...entries.map(([key, value]) => `export ${key}=${quoteLaunchAgentEnvironmentValue(value)}`),
		""
	].join("\n");
}
function buildLaunchAgentEnvironmentWrapper() {
	return `#!/bin/sh
set -eu
invalid_env() {
  echo "Invalid LaunchAgent environment file; run openclaw gateway install --force to repair the service." >&2
  exit 78
}
[ "$#" -ge 2 ] || invalid_env
env_file="$1"
shift
[ -f "$env_file" ] && [ -r "$env_file" ] || invalid_env
IFS= read -r env_header < "$env_file" || invalid_env
[ "$env_header" = '${LAUNCH_AGENT_ENV_FILE_HEADER}' ] || invalid_env
. "$env_file"
exec "$@"
`;
}
function isGeneratedLaunchAgentEnvironmentWrapper(contents) {
	return contents === buildLaunchAgentEnvironmentWrapper() || contents === `#!/bin/sh
set -eu
env_file="$1"
shift
if [ -f "$env_file" ]; then
  . "$env_file"
fi
exec "$@"
`;
}
async function warnAboutLaunchAgentWrapperOverwrite(wrapperPath, stdout, warn) {
	const existingWrapper = await fs.readFile(wrapperPath, "utf8").catch(() => null);
	if (existingWrapper === null || isGeneratedLaunchAgentEnvironmentWrapper(existingWrapper)) return;
	const warning = `Existing generated LaunchAgent env wrapper at ${wrapperPath} contains custom behavior and will be overwritten; move custom behavior to openclaw gateway install --wrapper <path> or OPENCLAW_WRAPPER.`;
	if (warn) warn(warning);
	else stdout?.write(`${formatLine("Warning", warning)}\n`);
}
async function prepareLaunchAgentProgramArguments(params) {
	const entries = collectLaunchAgentEnvironmentEntries(params.environment);
	if (entries.length === 0) return params.programArguments;
	const envDir = resolveLaunchAgentEnvDir(params.env);
	const envFilePath = resolveLaunchAgentEnvFilePath(params.env, params.label);
	const wrapperPath = resolveLaunchAgentEnvWrapperPath(params.env, params.label);
	const generatedWrapper = buildLaunchAgentEnvironmentWrapper();
	await ensureSecureDirectory(envDir, LAUNCH_AGENT_PRIVATE_DIR_MODE);
	await publishServiceFile({
		filePath: envFilePath,
		contents: buildLaunchAgentEnvironmentFile(entries),
		mode: LAUNCH_AGENT_ENV_FILE_MODE,
		definitionTransaction: params.definitionTransaction
	});
	await warnAboutLaunchAgentWrapperOverwrite(wrapperPath, params.stdout, params.warn);
	await publishServiceFile({
		filePath: wrapperPath,
		contents: generatedWrapper,
		mode: LAUNCH_AGENT_ENV_WRAPPER_MODE,
		definitionTransaction: params.definitionTransaction
	});
	const { programArguments } = params;
	if (programArguments[0] === wrapperPath && programArguments[1] === envFilePath || programArguments[0] === "/bin/sh" && programArguments[1] === wrapperPath && programArguments[2] === envFilePath) return programArguments;
	return [
		LAUNCH_AGENT_ENV_WRAPPER_SHELL,
		wrapperPath,
		envFilePath,
		...programArguments
	];
}
function resolveLaunchAgentPlistPath(env) {
	return resolveLaunchAgentPlistPathForLabel(env, resolveLaunchAgentLabel(env));
}
function resolveLaunchAgentEnvironmentReadOptions(env, label) {
	return {
		expectedEnvironmentWrapperPath: resolveLaunchAgentEnvWrapperPath(env, label),
		expectedEnvironmentFilePath: resolveLaunchAgentEnvFilePath(env, label),
		generatedEnvironmentLabel: label
	};
}
async function readExistingLaunchAgentPlist(plistPath) {
	try {
		const handle = await fs.open(plistPath, "r");
		try {
			return {
				contents: await handle.readFile(),
				mode: (await handle.stat()).mode & 4095
			};
		} finally {
			await handle.close();
		}
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
/** Captured file identities bound rollback to this install's actual publications. */
async function captureLaunchAgentFiles(paths) {
	const originals = /* @__PURE__ */ new Map();
	await withGatewayServiceInstallationRecovery(async () => {
		for (const file of paths) {
			const state = await readServiceFileState(file);
			const snapshot = await readExistingLaunchAgentPlist(file);
			const contents = snapshot?.contents ?? null;
			if (!isDeepStrictEqual(state, await readServiceFileState(file)) || state === null !== (contents === null) || state && contents && sha256Hex(contents) !== state.sha256) throw new Error("LaunchAgent artifact changed while capturing its original definition.");
			originals.set(file, {
				snapshot,
				state
			});
		}
	}, async () => false);
	const published = /* @__PURE__ */ new Map();
	const prepared = /* @__PURE__ */ new Map();
	const verify = async (file) => {
		const current = await readServiceFileState(file);
		const expected = published.get(file);
		if (expected ? !matchesServiceFilePublication(current, expected) : !isDeepStrictEqual(current, originals.get(file)?.state)) throw new Error(`LaunchAgent artifact changed after capture or publication: ${file}`);
		return current;
	};
	const beforeWrite = async () => {
		assertGatewayServiceUpdateCurrent();
		for (const [file, pending] of prepared) {
			const current = await readServiceFileState(file);
			if (matchesServiceFilePublication(current, pending)) published.set(file, current);
			else await verify(file);
			prepared.delete(file);
		}
		for (const file of originals.keys()) await verify(file);
		assertGatewayServiceUpdateCurrent();
	};
	const refuseTaskPublication = async () => {
		throw new Error("LaunchAgent file receipts cannot publish Scheduled Tasks.");
	};
	const hooks = {
		assertCurrent: assertGatewayServiceUpdateCurrent,
		beforeWrite,
		filePrepared: async (file, temporary) => {
			if (!originals.has(file) || temporary === null) throw new Error("Not a captured LaunchAgent publication target.");
			const pending = await readServiceFileState(temporary);
			assertGatewayServiceUpdateCurrent();
			if (!pending) throw new Error("Prepared LaunchAgent artifact disappeared before publication.");
			prepared.set(file, pending);
		},
		fileWritten: async (file, contents) => {
			const current = await readServiceFileState(file);
			const pending = prepared.get(file);
			assertGatewayServiceUpdateCurrent();
			if (!pending || !matchesServiceFilePublication(current, pending) || contents === null || current?.sha256 !== sha256Hex(contents)) throw new Error(`LaunchAgent artifact changed after publication: ${file}`);
			published.set(file, current);
			prepared.delete(file);
		},
		taskPrepared: refuseTaskPublication,
		taskWritten: refuseTaskPublication
	};
	return {
		originals,
		hooks,
		assertCurrent: beforeWrite,
		restore: async () => {
			if (!published.size && !prepared.size) return false;
			await beforeWrite();
			if (!published.size) return false;
			const order = (file) => file === paths[0] ? 1 : originals.get(file).snapshot ? 0 : 2;
			for (const file of [...published.keys()].toSorted((a, b) => order(a) - order(b))) {
				const original = originals.get(file);
				if (original.snapshot !== null && original.state) {
					await publishServiceFile({
						filePath: file,
						contents: original.snapshot.contents,
						mode: original.snapshot.mode,
						definitionTransaction: hooks
					});
					original.state = published.get(file);
				} else {
					await verify(file);
					assertGatewayServiceUpdateCurrent();
					await fs.unlink(file);
					original.state = null;
				}
				published.delete(file);
			}
			return true;
		}
	};
}
function captureLaunchAgentInstallFiles(env) {
	const label = resolveLaunchAgentLabel(env);
	return captureLaunchAgentFiles([
		resolveLaunchAgentPlistPath(env),
		resolveLaunchAgentEnvFilePath(env, label),
		resolveLaunchAgentEnvWrapperPath(env, label)
	]);
}
async function publishLaunchAgentPlist(params) {
	await publishServiceFile({
		filePath: params.plistPath,
		contents: params.contents,
		mode: LAUNCH_AGENT_PLIST_MODE,
		definitionTransaction: params.definitionTransaction,
		beforeRename: () => assertNoSystemLaunchDaemonOwnership(params.label)
	});
	await assertNoSystemLaunchDaemonOwnership(params.label);
}
async function ensureSecureDirectory(targetPath, dirMode = LAUNCH_AGENT_DIR_MODE) {
	assertGatewayServiceUpdateCurrent();
	await fs.mkdir(targetPath, {
		recursive: true,
		mode: dirMode
	});
	try {
		const mode = (await fs.stat(targetPath)).mode & 511;
		const tightenedMode = mode & ~(dirMode === LAUNCH_AGENT_PRIVATE_DIR_MODE ? 63 : 18);
		if (tightenedMode !== mode) {
			assertGatewayServiceUpdateCurrent();
			await fs.chmod(targetPath, tightenedMode);
		}
	} catch {}
}
async function writeLaunchAgentPlist(args, publication) {
	assertGatewayServiceUpdateCurrent();
	const definitionTransaction = args.definitionTransaction ?? publication?.hooks;
	if (!definitionTransaction) {
		const captured = await captureLaunchAgentInstallFiles(args.env);
		return withGatewayServiceInstallationRecovery(() => writeLaunchAgentPlist(args, captured), captured.restore);
	}
	const { env, programArguments, workingDirectory, environment, description, stdout, warn } = args;
	const label = resolveLaunchAgentLabel(env);
	await assertNoSystemLaunchDaemonOwnership(label);
	const { logDir, stdoutPath } = resolveGatewaySupervisorLogPaths(env, { platform: "darwin" });
	await ensureSecureDirectory(logDir);
	const plistPath = resolveLaunchAgentPlistPathForLabel(env, label);
	const home = normalizeWindowsPathSeparators(resolveDaemonHomeDir(env));
	const libraryDir = path.posix.join(home, "Library");
	await ensureSecureDirectory(home);
	await ensureSecureDirectory(libraryDir);
	await ensureSecureDirectory(path.dirname(plistPath));
	const tmpDir = environment?.TMPDIR?.trim();
	if (tmpDir) await ensureSecureDirectory(tmpDir, LAUNCH_AGENT_PRIVATE_DIR_MODE);
	const prepared = await prepareLaunchAgentProgramArguments({
		env,
		label,
		programArguments,
		environment,
		stdout,
		warn,
		definitionTransaction
	});
	const serviceDescription = resolveGatewayServiceDescription({
		env,
		description
	});
	let plist = buildLaunchAgentPlist({
		label,
		comment: serviceDescription,
		programArguments: prepared,
		workingDirectory,
		stdoutPath,
		stderrPath: stdoutPath
	});
	if (definitionTransaction.preservePolicy?.length) plist = preserveServicePolicyXml(plist, await normalizeLaunchdPlistXml(await fs.readFile(plistPath)), definitionTransaction.preservePolicy, "plist");
	await publishLaunchAgentPlist({
		label,
		plistPath,
		contents: plist,
		definitionTransaction
	});
	return {
		plistPath,
		stdoutPath
	};
}
async function rewriteLaunchAgentPlistForRestart({ env, label, plistPath, stdout, warn }) {
	const existing = await readLaunchAgentProgramArgumentsFromFile(plistPath, resolveLaunchAgentEnvironmentReadOptions(env, label));
	if (!existing?.programArguments.length) return false;
	const publication = await captureLaunchAgentInstallFiles(env);
	const definitionTransaction = publication.hooks;
	return withGatewayServiceInstallationRecovery(async () => {
		const { logDir, stdoutPath } = resolveGatewaySupervisorLogPaths(env, { platform: "darwin" });
		await ensureSecureDirectory(logDir);
		const serviceDescription = resolveGatewayServiceDescription({ env });
		const canonicalEnvironment = {
			...existing.environment,
			OPENCLAW_SERVICE_VERSION: void 0
		};
		const prepared = await prepareLaunchAgentProgramArguments({
			env,
			label,
			programArguments: existing.programArguments,
			environment: canonicalEnvironment,
			stdout,
			warn,
			definitionTransaction
		});
		const plist = buildLaunchAgentPlist({
			label,
			comment: serviceDescription,
			programArguments: prepared,
			workingDirectory: existing.workingDirectory,
			stdoutPath,
			stderrPath: stdoutPath
		});
		if (await fs.readFile(plistPath, "utf8").catch(() => "") === plist) {
			assertGatewayServiceUpdateCurrent();
			await fs.chmod(plistPath, LAUNCH_AGENT_PLIST_MODE).catch(() => void 0);
			return false;
		}
		await publishLaunchAgentPlist({
			label,
			plistPath,
			contents: plist,
			definitionTransaction
		});
		return true;
	}, publication.restore);
}
//#endregion
export { renderSystemLaunchDaemonOwnershipShellProbe as _, resolveLaunchAgentEnvFilePath as a, isLaunchctlNotLoaded as b, resolveLaunchAgentPlistPath as c, writeLaunchAgentPlist as d, preserveServicePolicyXml as f, isSystemLaunchDaemonOwnershipError as g, inspectSystemLaunchDaemonOwnership as h, readExistingLaunchAgentPlist as i, resolveLaunchAgentPlistPathForLabel as l, formatSystemLaunchDaemonOwnershipSummary as m, captureLaunchAgentInstallFiles as n, resolveLaunchAgentEnvWrapperPath as o, assertNoSystemLaunchDaemonOwnership as p, isGeneratedLaunchAgentEnvironmentWrapper as r, resolveLaunchAgentEnvironmentReadOptions as s, buildLaunchAgentEnvironmentWrapper as t, rewriteLaunchAgentPlistForRestart as u, execLaunchctl as v, launchctlInspectionReason as x, formatLaunchctlResultDetail as y };
