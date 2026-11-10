import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as DEV_BRANCH } from "./update-channels-l0GQCX9n.mjs";
import { a as executeGitCommand } from "./git-exec-CvORirty.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { r as isFullGitObjectId } from "./update-dev-target-yMMMhCo4.mjs";
import { n as updateInstallRootsMatch } from "./update-install-root-Nv-hNWki.mjs";
import hostedGitInfo from "hosted-git-info";
//#region src/infra/update-git-metadata.ts
const updateLog = createSubsystemLogger("update");
const DEV_COMMIT_LIMIT = 5;
const DEV_COMMIT_SUBJECT_MAX_LENGTH = 120;
const DEV_COMMIT_LOG_MAX_OUTPUT_BYTES = 8192;
/** Select source authority before requiring its local tracking ref to exist. */
async function readGitUpdateFetchTarget(readGit, branch, useDevDefault = false, legacy) {
	const [remote, mergeRefs] = await Promise.all([readGit("config", "--get", `branch.${branch}.remote`), readGit("config", "--get-all", `branch.${branch}.merge`)]);
	const mergeRef = mergeRefs?.split("\n")[0];
	if (remote && mergeRef) return {
		remote,
		mergeRef,
		upstreamSource: "tracking"
	};
	const currentBranch = useDevDefault || legacy?.receipt?.upstreamRef ? await readGit("rev-parse", "--abbrev-ref", "HEAD") : null;
	const receipt = legacy?.receipt;
	if (currentBranch === "HEAD" && receipt?.upstreamRef) {
		const receiptSha = receipt.sha.trim().toLowerCase();
		if (legacy?.sha && updateInstallRootsMatch(legacy.root, receipt.root) && /^[0-9a-f]{7,64}$/u.test(receiptSha) && (legacy.sha.toLowerCase() === receiptSha || receiptSha.length < legacy.sha.length && await readGit("rev-parse", "--disambiguate=" + receiptSha) === legacy.sha.toLowerCase())) {
			const hint = await readGitRefFetchTarget(readGit, receipt.upstreamRef, legacy.fetchRemote);
			if (hint) return {
				...hint,
				upstreamSource: "receipt"
			};
		}
		updateLog.warn("Ignoring an unusable or stale Git update source hint; using current repository policy.");
	}
	if (!useDevDefault || remote || mergeRefs) return null;
	const localMain = await readGit("show-ref", "--verify", "refs/heads/" + DEV_BRANCH);
	if (!currentBranch || currentBranch !== "HEAD" && localMain) return null;
	let defaultRemote;
	if (await readGit("remote", "get-url", "--", "origin")) defaultRemote = "origin";
	else if (!localMain) {
		const remotes = (await readGit("remote"))?.split("\n").filter(Boolean) ?? [];
		if (remotes.length === 1) defaultRemote = remotes[0];
	}
	return defaultRemote ? {
		remote: defaultRemote,
		mergeRef: "refs/heads/" + DEV_BRANCH,
		upstreamSource: "tracking"
	} : null;
}
/** Apply the selected source’s fetch mapping without changing repository configuration. */
async function resolveGitUpdateTrackingRef(readGit, branch, target) {
	if (target.revision) return target.revision;
	return readGit("-c", `branch.${branch}.remote=${target.remote}`, "-c", `branch.${branch}.merge=${target.mergeRef}`, "rev-parse", "--symbolic-full-name", `${branch}@{upstream}`);
}
function gitRefSpellings(ref) {
	return [
		ref,
		"refs/" + ref,
		"refs/tags/" + ref,
		"refs/heads/" + ref,
		"refs/remotes/" + ref,
		"refs/remotes/" + ref + "/HEAD"
	];
}
function matchRefspec(pattern, ref) {
	const star = pattern.indexOf("*");
	if (star < 0) return pattern === ref ? "" : void 0;
	const prefix = pattern.slice(0, star);
	const suffix = pattern.slice(star + 1);
	return ref.startsWith(prefix) && ref.endsWith(suffix) && ref.length >= prefix.length + suffix.length ? ref.slice(prefix.length, ref.length - suffix.length) : void 0;
}
/** Resolve a saved or explicitly pinned destination through Git's configured source mappings. */
async function readGitRefFetchTarget(readGit, display, fetchRemote) {
	const resolved = await readGit("rev-parse", "--symbolic-full-name", "--verify", "--end-of-options", display);
	const spellings = display.startsWith("refs/") ? [display] : gitRefSpellings(display).slice(1);
	const revisions = resolved ? [resolved] : (await Promise.all(spellings.map((ref) => readGit("check-ref-format", "--normalize", ref)))).filter((ref) => Boolean(ref));
	const refspecs = (await readGit("config", "--get-regexp", "^remote\\..*\\.fetch$"))?.split("\n") ?? [];
	const targets = refspecs.flatMap((line) => {
		const [, remote, source, destination] = /^remote\.(.+)\.fetch \+?([^:]*):(.+)$/.exec(line) ?? [];
		const mappedDestination = destination && !destination.includes("*") && !destination.startsWith("refs/") ? /^(?:heads|tags|remotes)\//u.test(destination) ? "refs/" + destination : "refs/heads/" + destination : destination;
		return revisions.flatMap((revision) => {
			const matched = mappedDestination ? matchRefspec(mappedDestination, revision) : void 0;
			return remote && source !== void 0 && matched !== void 0 ? [{
				remote,
				mergeRef: source.replace("*", () => matched),
				revision
			}] : [];
		});
	});
	const isExcluded = (target, source = target.mergeRef) => {
		const prefix = "remote." + target.remote + ".fetch ^";
		return refspecs.some((line) => line.startsWith(prefix) && matchRefspec(line.slice(prefix.length), source) !== void 0);
	};
	const eligible = targets.filter((target) => !isExcluded(target));
	let unique = [...new Map(eligible.map((target) => [JSON.stringify(target), target])).values()];
	if (targets.length === 0 && resolved?.startsWith("refs/heads/")) return {
		remote: ".",
		mergeRef: resolved,
		revision: resolved
	};
	if (unique.length > 1 && (resolved || display.startsWith("refs/") || new Set(unique.map((target) => target.remote)).size !== 1 || new Set(unique.map((target) => target.revision)).size !== unique.length)) return null;
	if (unique.length === 1 && isFullGitObjectId(unique[0].mergeRef)) {
		const format = await readGit("rev-parse", "--show-object-format");
		const hexLength = format === "sha256" ? 64 : format === "sha1" ? 40 : null;
		if (unique[0].mergeRef.length === hexLength) return unique[0] ?? null;
	}
	if (fetchRemote && unique.length > 0) {
		const remote = unique[0].remote;
		const advertised = await readGit("ls-remote", "--", remote, ...new Set(unique.flatMap((target) => gitRefSpellings(!target.mergeRef || target.mergeRef === "@" ? "HEAD" : target.mergeRef))));
		if (advertised !== null) {
			const refs = new Set(advertised.split("\n").map((line) => line.split("	")[1]));
			unique = unique.filter((target) => {
				const source = gitRefSpellings(!target.mergeRef || target.mergeRef === "@" ? "HEAD" : target.mergeRef).find((ref) => refs.has(ref));
				return source !== void 0 && !isExcluded(target, source);
			});
		}
	}
	return unique.length === 1 ? unique[0] ?? null : null;
}
async function resolveGitRepositoryMetadata(readGit, target) {
	const remote = target?.remote;
	const remoteUrl = remote && remote !== "." ? await readGit("remote", "get-url", "--", remote) : null;
	const repository = remoteUrl && /^(?:(?:https?|ssh|git):\/\/|git@github\.com:)/u.test(remoteUrl) ? hostedGitInfo.fromUrl(remoteUrl) : void 0;
	const repositoryUrl = repository?.type === "github" ? repository.browse({ noCommittish: true }) : void 0;
	return repositoryUrl ? { repositoryUrl } : {};
}
async function resolveDevGitCommits(params) {
	const result = await executeGitCommand(params.root, [
		"log",
		"--format=%h%x09%s",
		`--max-count=${DEV_COMMIT_LIMIT}`,
		`${params.currentSha}..${params.upstreamSha}`
	], {
		timeoutMs: 2500,
		operation: "update.inspect",
		signal: params.signal,
		killProcessTree: true,
		maxOutputBytes: {
			stdout: DEV_COMMIT_LOG_MAX_OUTPUT_BYTES,
			stderr: 1024
		}
	}).catch(() => null);
	if (!result || result.code !== 0 || result.termination !== "exit") return [];
	return result.stdout.split("\n").flatMap((line) => {
		const separator = line.indexOf("	");
		const sha = separator < 0 ? "" : line.slice(0, separator).trim();
		if (!sha) return [];
		return [{
			sha,
			subject: line.slice(separator + 1).trim().slice(0, DEV_COMMIT_SUBJECT_MAX_LENGTH)
		}];
	}).slice(0, DEV_COMMIT_LIMIT);
}
async function readGitTargetSchemaVersions(params) {
	let result;
	try {
		result = await params.runCommand([
			"git",
			"-C",
			params.root,
			"show",
			`${params.revision}:package.json`
		], {
			cwd: params.root,
			timeoutMs: params.timeoutMs
		});
	} catch (error) {
		return {
			status: "unreadable",
			reason: String(error)
		};
	}
	if (result.code !== 0) return {
		status: "unreadable",
		reason: `git show ${params.revision}:package.json exited ${result.code}`
	};
	try {
		const manifest = JSON.parse(result.stdout);
		const schemaVersions = parsePackageOpenClawSchemaVersions(manifest);
		const version = normalizeNullableString(asNullableRecord(manifest)?.version);
		const databaseEngines = asNullableRecord(asNullableRecord(manifest)?.openclaw)?.databaseEngines;
		return {
			status: "ok",
			nodeEngine: normalizeNullableString(asNullableRecord(asNullableRecord(manifest)?.engines)?.node),
			...version ? { version } : {},
			...schemaVersions ? { schemaVersions } : {},
			...databaseEngines === void 0 ? {} : { databaseEngines }
		};
	} catch (error) {
		return {
			status: "unreadable",
			reason: `target package.json unparseable: ${String(error)}`
		};
	}
}
//#endregion
export { resolveGitRepositoryMetadata as a, resolveDevGitCommits as i, readGitTargetSchemaVersions as n, resolveGitUpdateTrackingRef as o, readGitUpdateFetchTarget as r, readGitRefFetchTarget as t };
