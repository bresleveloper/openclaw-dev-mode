//#region node-version.mjs
const NODE_RELEASE_VERSION_RE = /^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const NODE_RELEASE_FLOORS = [{
	major: 24,
	minor: 16,
	patch: 0
}, {
	major: 26,
	minor: 1,
	patch: 0
}];
const HIGHEST_RELEASE_FLOOR = NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length - 1];
const SUPPORTED_NODE_VERSION_RANGE = NODE_RELEASE_FLOORS.map(({ major, minor, patch }, index) => `>=${major}.${minor}.${patch}${index < NODE_RELEASE_FLOORS.length - 1 ? ` <${major + 1}` : ""}`).join(" || ");
const SUPPORTED_NODE_VERSIONS = `${SUPPORTED_NODE_VERSION_RANGE.replaceAll(" || ", ", ").replace(/, ([^,]+)$/, ", or $1")} (Node 26 recommended)`;
function formatUnsupportedNodeVersionMessage(version) {
	return [
		`Node ${version ?? "unknown"} is unsupported; OpenClaw requires ${SUPPORTED_NODE_VERSIONS}.`,
		"npm can finish installing OpenClaw without running its preinstall check; a successful install does not mean Node is supported.",
		"Re-run the installer: curl -fsSL https://openclaw.ai/install.sh | bash",
		"On Windows: iwr -useb https://openclaw.ai/install.ps1 | iex",
		"Or with nvm: nvm install 26 && nvm use 26 && nvm alias default 26",
		"Then rerun openclaw update. See https://docs.openclaw.ai/install/node"
	].join("\n");
}
function formatUnsupportedNodeDiagnosticWarning(version) {
	return `Running on an unsupported Node (${version}); diagnostics may show truncated text`;
}
const ROOT_BOOLEAN_OPTIONS = ["--dev", "--no-color"];
const ROOT_VALUE_OPTIONS = [
	"--profile",
	"--log-level",
	"--container"
];
function consumeOption(args, index, booleanOptions, valueOptions) {
	const arg = args[index];
	if (booleanOptions.includes(arg)) return 1;
	const equals = arg.indexOf("=");
	if (valueOptions.includes(equals < 0 ? arg : arg.slice(0, equals))) return equals >= 0 ? 1 : args[index + 1] === void 0 ? 0 : 2;
	return 0;
}
function diagnosticOptions(args, booleanOptions, valueOptions = []) {
	const flags = /* @__PURE__ */ new Set();
	for (let index = 0; index < args.length;) {
		const consumed = consumeOption(args, index, [...ROOT_BOOLEAN_OPTIONS, ...booleanOptions], [...ROOT_VALUE_OPTIONS, ...valueOptions]);
		if (!consumed) return null;
		flags.add(args[index]);
		index += consumed;
	}
	return flags;
}
/** Shared by the packaged launcher and source guard before either loads command state. */
function classifyUnsupportedNodeCommand(argv) {
	const args = argv.slice(2);
	let index = 0;
	while (index < args.length) {
		const consumed = consumeOption(args, index, ROOT_BOOLEAN_OPTIONS, ROOT_VALUE_OPTIONS);
		if (!consumed) break;
		index += consumed;
	}
	const command = args[index++];
	const tail = args.slice(index);
	if ([
		"--version",
		"-V",
		"-v",
		"--help",
		"-h"
	].includes(command)) return diagnosticOptions(tail, []) ? "diagnostic" : null;
	if (command === "gateway") {
		while (index < args.length) {
			const consumed = consumeOption(args, index, ROOT_BOOLEAN_OPTIONS, ROOT_VALUE_OPTIONS);
			if (!consumed) break;
			index += consumed;
		}
		return args[index] === "status" ? "diagnostic" : null;
	}
	if (command === "doctor") return diagnosticOptions(tail, [
		"--lint",
		"--json",
		"--deep",
		"--all",
		"--non-interactive",
		"--no-workspace-suggestions"
	], [
		"--only",
		"--skip",
		"--severity-min"
	]) ? "diagnostic" : null;
	if (command === "triage") {
		const flags = diagnosticOptions(tail, [
			"--json",
			"--non-interactive",
			"--no-export"
		], ["--update-result"]);
		return flags && (flags.has("--json") || flags.has("--non-interactive")) ? "diagnostic" : null;
	}
	if (command === "update") {
		while (index < args.length) {
			const consumed = consumeOption(args, index, ROOT_BOOLEAN_OPTIONS, ROOT_VALUE_OPTIONS);
			if (!consumed) break;
			index += consumed;
		}
		if (args[index] === "status") return diagnosticOptions(args.slice(index + 1), ["--json"], ["--timeout"]) ? "diagnostic" : null;
		return diagnosticOptions(tail, [
			"--json",
			"--yes",
			"--dry-run",
			"--no-restart",
			"--accept-capabilities"
		], [
			"--channel",
			"--tag",
			"--timeout"
		]) ? "update" : null;
	}
	return null;
}
/** Diagnostic bundles target Node 22 syntax and require the native SQLite reader. */
function canRunOpenClawNodeDiagnostics(value, hasNodeSqlite) {
	return hasNodeSqlite && isNodeVersionAtLeast(parseNodeReleaseVersion(value), {
		major: 22,
		minor: 0,
		patch: 0
	});
}
/** Parses an anchored release SemVer, allowing a leading v and valid build metadata. */
function parseNodeReleaseVersion(value) {
	if (typeof value !== "string") return null;
	const match = NODE_RELEASE_VERSION_RE.exec(value.trim());
	if (!match) return null;
	const version = {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
	return Object.values(version).every(Number.isSafeInteger) ? version : null;
}
function isNodeVersionAtLeast(version, minimum) {
	if (!version) return false;
	if (version.major !== minimum.major) return version.major > minimum.major;
	if (version.minor !== minimum.minor) return version.minor > minimum.minor;
	return version.patch >= minimum.patch;
}
/** Checks OpenClaw's supported release lines. Older Node lines with lossy SQLite TEXT reads are unsupported. */
function isSupportedOpenClawNodeVersion(value) {
	const version = parseNodeReleaseVersion(value);
	if (!version) return false;
	const minimum = NODE_RELEASE_FLOORS.find((floor) => floor.major === version.major);
	return minimum ? isNodeVersionAtLeast(version, minimum) : version.major > HIGHEST_RELEASE_FLOOR.major;
}
function renderProcessNodeVersionCheck() {
	return `((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`;
}
const PROCESS_NODE_VERSION_CHECK = renderProcessNodeVersionCheck();
//#endregion
export { classifyUnsupportedNodeCommand as a, isNodeVersionAtLeast as c, canRunOpenClawNodeDiagnostics as i, isSupportedOpenClawNodeVersion as l, SUPPORTED_NODE_VERSIONS as n, formatUnsupportedNodeDiagnosticWarning as o, SUPPORTED_NODE_VERSION_RANGE as r, formatUnsupportedNodeVersionMessage as s, PROCESS_NODE_VERSION_CHECK as t, parseNodeReleaseVersion as u };
