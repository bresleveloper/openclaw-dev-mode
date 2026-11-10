import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { l as SessionRowSchema } from "./sessions-row-Sp79G8RP.mjs";
import { i as hashConfigRaw, s as parseConfigJson5 } from "./io.read-helpers-KYk5dB53.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { p as readRecentConfigAuditRecords, v as fingerprintConfigSnapshotAuthoredConfig } from "./io.audit-CCHda99t.mjs";
import { g as resolveConfigStatMetadata, l as assertConfigFileWritePathSnapshot, u as captureConfigFileWritePathProof } from "./write-lock-BlX1pI0w.mjs";
import { a as READ_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-ByD9hEIN.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Bbz3m70g.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { o as captureUpdateCommandExecutorAuthority } from "./update-command-executor-DUq8yLzH.mjs";
import { n as readSystemdServiceRuntime } from "./systemd-BoxHLGdw.mjs";
import { m as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { n as createGatewayRestartDeadline, t as GatewayRestartDeadlineError } from "./restart-health-deadline-W160VriR.mjs";
import { i as INTERRUPTED_UPDATE_SETTLE_PROBES } from "./restart-health.constants-C-z_CCoa.mjs";
import { t as createConfiguredGatewayLocalProbe } from "./local-http-probe-DfgRYt3l.mjs";
import { r as callGateway, y as resolveReadOnlyLocalGatewayAuth } from "./call-b1jzw5fz.mjs";
import { a as resolveGatewayRestartProbeContext, o as waitForGatewayHttpReadiness } from "./restart-health-probe-Pjm6LtxI.mjs";
import { a as getGatewayChannelWarnings, c as inspectGatewayRestart, n as waitForGatewayHealthyRestart, t as isSameGatewayRestartGeneration } from "./restart-health-D3oE2IOJ.mjs";
import { c as resolveImmutableRecoveryCommand, d as resolvePackageActivationHelper, l as resolvePackageActivationAnchor, o as packageActivationRuntimeIdentity, u as resolvePackageActivationControl } from "./package-update-activation-paths-CZ6aheGK.mjs";
import { t as prepareSqliteRollbackRecovery } from "./sqlite-rollback-recovery-CxCck8hc.mjs";
import { t as resolveUpdateFinalizationTimeoutMs } from "./update-finalization-budget-DHF5JlHv.mjs";
import { a as immutableConfigFingerprintSchema, o as immutableProtectedFileIdentitySchema, s as ImmutableRecoveryRuntimeReferenceSchema } from "./update-immutable-install-schema-n_1U7goK.mjs";
import { t as readImmutableInstallRecord } from "./update-immutable-install-record-Cv2DpqET.mjs";
import { n as directoryIdentity, r as readImmutableLayout, t as assertImmutableDescriptorCurrent } from "./update-immutable-layout-ADE3XUab.mjs";
import { a as withImmutableUpdateOwner, i as projectImmutableInstall, n as inspectImmutableInstall } from "./update-immutable-install-B8ymhxms.mjs";
import { t as withGatewayMaintenanceDrain } from "./update-command-service-drain-B6lzwSGf.mjs";
import { t as validateUpdateCandidateCanary } from "./update-candidate-canary-TznUhj2G.mjs";
import { a as updateImmutableInstallRecord, n as captureImmutableControl, t as assertImmutableInstallRecordCurrent } from "./package-update-activation-immutable-Cl0-qUZq.mjs";
import { i as readImmutableSchemaContracts, o as sealImmutableGeneration, s as verifyImmutableGeneration, t as assertImmutableGenerationControlVersion } from "./update-immutable-generation-S0DUN-bf.mjs";
import { i as inspectImmutableActivationService, n as assertImmutableServiceStoppedCurrent, r as controlImmutableService, t as assertImmutableServiceProcessCurrent } from "./update-immutable-service-y4kOBQLJ.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/infra/package-update-activation-immutable-pointer.ts
/** Reconcile a durable rename intent before deciding whether any effect needs replay. */
function reconcileImmutablePointer(record, assertCurrent) {
	assertCurrent();
	const operation = record.activation?.operation;
	const intent = operation?.pointerIntent;
	if (!operation || !intent) {
		assertImmutableDescriptorCurrent(record.descriptor);
		return record;
	}
	const layout = readImmutableLayout(record.descriptor.root);
	if (layout.current.pointerIdentity === intent.fromIdentity) {
		assertImmutableDescriptorCurrent(record.descriptor);
		return record;
	}
	const target = intent.targetSha === operation.candidate.sha ? operation.candidate : operation.previous;
	if (layout.current.pointerIdentity !== intent.temporaryIdentity || layout.current.sha !== target.sha || layout.current.identity !== target.identity) throw new Error("Immutable pointer differs from its durable publication intent; recovery retained.");
	const descriptor = {
		...record.descriptor,
		current: {
			...layout.current,
			buildDigest: target.buildDigest
		}
	};
	assertImmutableDescriptorCurrent(descriptor);
	assertCurrent();
	requireDirectorySync(syncDirectorySync(record.descriptor.root), "Immutable pointer publication");
	const { pointerIntent: _intent, ...observed } = operation;
	return updateImmutableInstallRecord(record, {
		...record,
		descriptor,
		activation: {
			...record.activation,
			operation: observed
		}
	}, assertCurrent);
}
/** The caller proves stopped-service custody; this owner records intent before atomic publication. */
function publishImmutablePointer(record, target, assertCurrent) {
	let current = reconcileImmutablePointer(record, assertCurrent);
	const operation = current.activation?.operation;
	if (!operation) throw new Error("Immutable pointer publication requires its activation operation.");
	const generation = operation[target];
	assertImmutableInstallRecordCurrent(current, assertCurrent);
	if (current.descriptor.current.sha === generation.sha) return current;
	const root = current.descriptor.root;
	const temporary = path.join(root, `.openclaw-current-${operation.operationId}`);
	const assertTarget = () => {
		if (directoryIdentity(generation.path) !== generation.identity || fs.realpathSync(generation.path) !== generation.path) throw new Error("Immutable target generation changed; current was not modified.");
	};
	assertTarget();
	assertImmutableDescriptorCurrent(current.descriptor);
	let intent = operation.pointerIntent;
	if (!intent) {
		const existing = fs.lstatSync(temporary, { throwIfNoEntry: false });
		if (!existing) fs.symlinkSync(`releases/${generation.sha}`, temporary);
		else if (!existing.isSymbolicLink() || existing.uid !== 0 || fs.readlinkSync(temporary) !== `releases/${generation.sha}`) throw new Error("Immutable temporary pointer differs from this operation; recovery retained.");
		requireDirectorySync(syncDirectorySync(root), "Immutable pointer preparation");
		const stat = fs.lstatSync(temporary);
		intent = {
			fromIdentity: current.descriptor.current.pointerIdentity,
			targetSha: generation.sha,
			temporaryIdentity: `${stat.dev}:${stat.ino}`
		};
		current = updateImmutableInstallRecord(current, {
			...current,
			activation: {
				...current.activation,
				operation: {
					...operation,
					pointerIntent: intent
				}
			}
		}, assertCurrent);
	}
	const stat = fs.lstatSync(temporary);
	if (!stat.isSymbolicLink() || stat.uid !== 0 || `${stat.dev}:${stat.ino}` !== intent.temporaryIdentity || intent.targetSha !== generation.sha || fs.readlinkSync(temporary) !== `releases/${generation.sha}`) throw new Error("Immutable temporary pointer identity changed; recovery retained.");
	assertImmutableInstallRecordCurrent(current, assertCurrent);
	assertImmutableDescriptorCurrent(current.descriptor);
	assertTarget();
	fs.renameSync(temporary, path.join(root, "current"));
	return reconcileImmutablePointer(current, assertCurrent);
}
//#endregion
//#region src/infra/package-update-activation-immutable-recovery.ts
/** Cold CLI recovery stays outside the control record's read-worker dependency graph. */
function readImmutableInstallRecordForRecovery(root) {
	const { control, journal, assertIdentity, assertFileSafe, validate, read } = captureImmutableControl(root);
	return prepareSqliteRollbackRecovery({
		path: journal,
		scratchRoot: control,
		assertIdentity,
		assertFileSafe,
		read(db) {
			validate(db);
			return read(db);
		}
	});
}
function controlRoot(root) {
	return resolvePackageActivationControl(resolvePackageActivationAnchor(root));
}
function helperIdentity(file) {
	const stat = fs.lstatSync(file, { bigint: true });
	if (!stat.isFile() || stat.uid !== 0n || stat.nlink !== 1n || (stat.mode & 146n) !== 0n || fs.realpathSync(file) !== file) throw new Error("Immutable recovery helper must be a sealed root-owned regular file.");
	return `${stat.dev}:${stat.ino}`;
}
function helperSource(runtime, copy, root) {
	return `import fs from "node:fs";
const runtime = ${JSON.stringify(runtime)};
const entry = ${JSON.stringify(path.join(copy, "openclaw.mjs"))};
const root = ${JSON.stringify(root)};
try {
  if (fs.realpathSync(process.execPath) !== runtime || typeof process.execve !== "function") {
    throw new Error("Use the recorded external Node executable for immutable recovery.");
  }
  const args = process.argv.slice(2);
  const seen = new Set();
  for (let index = 0; index < args.length; index++) {
    const option = args[index];
    if (option === "--json" && !seen.has(option)) { seen.add(option); continue; }
    if (["--timeout", "--drain-timeout"].includes(option) && !seen.has(option) && /^[0-9]+(?:\\.[0-9]+)?$/.test(args[index + 1] ?? "") && Number(args[index + 1]) > 0) {
      seen.add(option); index++; continue;
    }
    throw new Error("Usage: recovery.mjs [--json] [--timeout seconds] [--drain-timeout seconds]");
  }
  process.chdir(${JSON.stringify(copy)});
  process.execve(runtime, [runtime, entry, "update", "recover", "--root", root, ...args], process.env);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
`;
}
/** Absolute in-tree links must move with the copy instead of borrowing the source. */
async function relocateAbsoluteLinks(source, copy, assertCurrent) {
	const visit = async (directory) => {
		const entries = await fs$1.readdir(directory, { withFileTypes: true });
		assertCurrent();
		for (const entry of entries) {
			const file = path.join(directory, entry.name);
			if (entry.isDirectory()) await visit(file);
			else if (entry.isSymbolicLink()) {
				const target = await fs$1.readlink(file);
				assertCurrent();
				if (path.isAbsolute(target)) {
					if (!isPathInside(source, target)) throw new Error("Immutable recovery source has an external dependency link.");
					const destination = path.join(copy, path.relative(source, target));
					fs.unlinkSync(file);
					fs.symlinkSync(path.relative(directory, destination), file);
				}
			}
		}
	};
	await visit(copy);
}
async function prepareImmutableRecoveryRuntime(params) {
	const { record, assertCurrent } = params;
	const descriptor = record.descriptor;
	if (!descriptor.activationEnabled || record.activation?.operation) throw new Error("Prepare immutable recovery only for enabled adoption without a pending operation.");
	const source = await resolveOpenClawPackageRoot({ moduleUrl: import.meta.url });
	assertCurrent();
	const generation = [descriptor.current, record.prepared].find((entry) => entry?.path === source);
	if (!source || !generation) throw new Error("Run immutable activation from its sealed current or prepared generation.");
	const sourceFacts = await verifyImmutableGeneration(source, generation.sha);
	await assertImmutableGenerationControlVersion(source, descriptor.version);
	assertCurrent();
	if (sourceFacts.identity !== generation.identity || sourceFacts.buildDigest !== generation.buildDigest) throw new Error("The invoking sealed generation no longer matches its preparation receipt.");
	const control = controlRoot(descriptor.root);
	const controlIdentity = directoryIdentity(control);
	const assertOwner = () => {
		assertImmutableInstallRecordCurrent(record, assertCurrent);
		if (fs.realpathSync(control) !== control || directoryIdentity(control) !== controlIdentity || packageActivationRuntimeIdentity(descriptor.runtime.path) !== descriptor.runtime.identity) throw new Error("Immutable recovery preparation ownership changed.");
	};
	assertOwner();
	const destination = path.join(control, `recovery-${generation.sha}`);
	if (!fs.lstatSync(destination, { throwIfNoEntry: false })) {
		const scratch = await fs$1.mkdtemp(path.join(control, ".recovery-prepare-"));
		const scratchIdentity = directoryIdentity(scratch);
		const staged = path.join(scratch, "runtime");
		try {
			assertOwner();
			await fs$1.cp(source, staged, {
				recursive: true,
				verbatimSymlinks: true,
				force: false,
				errorOnExist: true
			});
			assertOwner();
			const stagedIdentity = directoryIdentity(staged);
			await relocateAbsoluteLinks(source, staged, assertCurrent);
			assertOwner();
			await sealImmutableGeneration(staged);
			assertOwner();
			const prepared = await verifyImmutableGeneration(staged, generation.sha);
			assertOwner();
			if (prepared.identity !== stagedIdentity || prepared.buildDigest !== generation.buildDigest) throw new Error("Independent immutable recovery copy differs from the invoking generation.");
			if (fs.lstatSync(destination, { throwIfNoEntry: false })) throw new Error("An immutable recovery runtime already exists; it was preserved.");
			fs.renameSync(staged, destination);
			requireDirectorySync(syncDirectorySync(control), "Immutable recovery runtime publication");
		} finally {
			if (fs.lstatSync(scratch, { throwIfNoEntry: false }) && directoryIdentity(scratch) === scratchIdentity) fs.rmSync(scratch, { recursive: true });
		}
	}
	const facts = await verifyImmutableGeneration(destination, generation.sha);
	await assertImmutableGenerationControlVersion(destination, descriptor.version);
	assertOwner();
	if (facts.buildDigest !== generation.buildDigest) throw new Error("Existing immutable recovery runtime differs; it was preserved.");
	const helperPath = resolvePackageActivationHelper(resolvePackageActivationAnchor(descriptor.root));
	const content = helperSource(descriptor.runtime.path, destination, descriptor.root);
	const existing = fs.lstatSync(helperPath, { throwIfNoEntry: false });
	if (existing) helperIdentity(helperPath);
	if (!existing || fs.readFileSync(helperPath, "utf8") !== content) {
		const temporary = path.join(control, `.recovery-launcher-${randomUUID()}`);
		const fd = fs.openSync(temporary, "wx", 292);
		const staged = fs.fstatSync(fd);
		try {
			fs.writeFileSync(fd, content);
			fs.fchmodSync(fd, 292);
			fs.fsyncSync(fd);
			assertOwner();
			const current = fs.lstatSync(helperPath, { throwIfNoEntry: false });
			if (current?.dev !== existing?.dev || current?.ino !== existing?.ino) throw new Error("Immutable recovery launcher changed before publication.");
			fs.renameSync(temporary, helperPath);
			requireDirectorySync(syncDirectorySync(control), "Immutable recovery launcher publication");
		} finally {
			fs.closeSync(fd);
			const remaining = fs.lstatSync(temporary, { throwIfNoEntry: false });
			if (remaining?.dev === staged.dev && remaining?.ino === staged.ino) fs.unlinkSync(temporary);
		}
	}
	assertOwner();
	return ImmutableRecoveryRuntimeReferenceSchema.parse({
		root: descriptor.root,
		path: destination,
		sha: generation.sha,
		...facts,
		helperPath,
		helperIdentity: helperIdentity(helperPath),
		helperDigest: sha256Hex(content)
	});
}
async function verifyImmutableRecoveryRuntime(params) {
	const { descriptor, assertCurrent } = params;
	const reference = ImmutableRecoveryRuntimeReferenceSchema.parse(params.reference);
	const control = controlRoot(descriptor.root);
	if (reference.root !== descriptor.root || reference.path !== path.join(control, `recovery-${reference.sha}`) || reference.helperPath !== resolvePackageActivationHelper(resolvePackageActivationAnchor(descriptor.root))) throw new Error("Immutable recovery artifact belongs to a different installation.");
	const controlIdentity = directoryIdentity(control);
	const assertHelper = () => {
		assertCurrent();
		if (fs.realpathSync(control) !== control || directoryIdentity(control) !== controlIdentity || directoryIdentity(descriptor.root) !== descriptor.rootIdentity || packageActivationRuntimeIdentity(descriptor.runtime.path) !== descriptor.runtime.identity || helperIdentity(reference.helperPath) !== reference.helperIdentity || sha256Hex(fs.readFileSync(reference.helperPath)) !== reference.helperDigest || fs.readFileSync(reference.helperPath, "utf8") !== helperSource(descriptor.runtime.path, reference.path, descriptor.root)) throw new Error("Immutable recovery artifact identity or executable changed.");
	};
	assertHelper();
	const facts = await verifyImmutableGeneration(reference.path, reference.sha);
	await assertImmutableGenerationControlVersion(reference.path, descriptor.version);
	assertHelper();
	if (facts.identity !== reference.identity || facts.buildDigest !== reference.buildDigest) throw new Error("Immutable recovery runtime no longer matches its recorded artifact.");
}
//#endregion
//#region src/infra/update-immutable-protection.ts
function fileIdentity(file) {
	const stat = fs.lstatSync(file);
	if (!stat.isFile() || stat.nlink !== 1) throw new Error(`Immutable update requires an unshared regular protected file: ${file}`);
	return immutableProtectedFileIdentitySchema.parse(resolveConfigStatMetadata(stat));
}
function fingerprint(raw, env) {
	const parsed = parseConfigJson5(raw);
	if (!parsed.ok || !isRecord(parsed.parsed)) throw new Error("Immutable update requires a readable object-shaped config.");
	const result = immutableConfigFingerprintSchema.safeParse(fingerprintConfigSnapshotAuthoredConfig(parsed.parsed, {
		env,
		readOnly: true
	}));
	if (!result.success) throw new Error("Config journal fingerprints are unavailable; immutable activation was not admitted.");
	return result.data;
}
function object(value) {
	return value !== void 0 && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function policyFingerprint(config) {
	const root = object(config) ?? {};
	const channelPolicy = (value) => {
		const fields = object(value);
		if (!fields) return value;
		return Object.fromEntries(Object.entries(fields).filter(([key]) => key !== "legacyWebhook").map(([key, child]) => [key, channelPolicy(child)]));
	};
	const agents = object(root.agents);
	const agentPolicy = (value) => {
		const entry = object(value);
		return {
			tools: entry?.tools,
			sandbox: entry?.sandbox,
			permissions: entry?.permissions
		};
	};
	return sha256Hex(stableStringify({
		...Object.fromEntries([
			"gateway",
			"tools",
			"commands",
			"approvals",
			"permissions",
			"security",
			"bindings",
			"plugins"
		].map((key) => [key, root[key]])),
		channels: root.channels === void 0 ? void 0 : channelPolicy(root.channels),
		agents: {
			defaults: agentPolicy(agents?.defaults),
			entries: Object.fromEntries(Object.entries(object(agents?.entries) ?? {}).map(([key, entry]) => [key, agentPolicy(entry)]))
		}
	}));
}
function isAdditive(before, after, keys = []) {
	if (keys.length === 2 && keys[0] === "meta" && keys[1] === "lastTouchedVersion") return typeof after === "string";
	const previous = object(before);
	const next = object(after);
	return previous && next ? Object.entries(previous).every(([key, value]) => Object.hasOwn(next, key) && isAdditive(value, next[key], [...keys, key])) : isDeepStrictEqual(before, after);
}
function auditRecords(env) {
	return readRecentConfigAuditRecords({
		env,
		homedir,
		limit: 512
	});
}
function auditKey(record) {
	return sha256Hex(JSON.stringify(record));
}
function readFile$1(file, env) {
	assertConfigFileWritePathSnapshot(file.pathProof, fs);
	const before = fileIdentity(file.pathProof.targetPath);
	const raw = fs.readFileSync(file.pathProof.targetPath, "utf8");
	const after = fileIdentity(file.pathProof.targetPath);
	assertConfigFileWritePathSnapshot(file.pathProof, fs);
	if (!isDeepStrictEqual(before, after)) throw new Error("Protected config identity changed during verification.");
	return {
		identity: after,
		hash: hashConfigRaw(raw),
		fingerprint: fingerprint(raw, env)
	};
}
function assertState(snapshot) {
	const state = snapshot.state;
	assertConfigFileWritePathSnapshot(state.pathProof, fs);
	const current = readDatabasePathIdentitySync(state.path);
	if (current.key !== state.key || current.birthtime !== state.birthtime || !isDeepStrictEqual(fileIdentity(state.pathProof.targetPath), state.identity)) throw new Error("Protected state database identity changed; automatic activation or rollback was refused.");
}
async function captureImmutableProtection(params) {
	const env = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir,
		OPENCLAW_CONFIG_PATH: params.configPath
	};
	params.assertCurrent();
	const statePath = resolveOpenClawStateSqlitePath(env);
	const state = readDatabasePathIdentitySync(statePath);
	const stateIdentity = fileIdentity(state.canonicalPath);
	const { captureUpdateConfigSnapshot } = await import("./update-command-config-snapshot-Ch3ub0ay.mjs");
	params.assertCurrent();
	const capture = await captureUpdateConfigSnapshot(params.configPath, env);
	params.assertCurrent();
	const config = [capture, ...capture.includedFiles ?? []].map((file, index) => {
		if (file.raw === null || file.doctorOwned === false) throw new Error("Protected config and its include graph must be readable before immutable activation.");
		const proof = file.pathSnapshot ?? captureConfigFileWritePathProof(file.path, fs.realpathSync(file.path), fs).snapshot;
		const value = fingerprint(file.raw, env);
		return {
			path: file.path,
			pathProof: proof,
			identity: fileIdentity(proof.targetPath),
			hash: file.hash,
			fingerprint: value,
			policyFingerprint: index === 0 ? policyFingerprint(value) : sha256Hex(stableStringify(value))
		};
	});
	const newest = auditRecords(env)[0];
	const snapshot = {
		capturedAtMs: Date.now(),
		auditBoundary: newest ? auditKey(newest) : null,
		state: {
			path: statePath,
			identity: stateIdentity,
			pathProof: captureConfigFileWritePathProof(statePath, state.canonicalPath, fs).snapshot,
			key: state.key,
			...state.birthtime === void 0 ? {} : { birthtime: state.birthtime }
		},
		config
	};
	assertImmutableProtectionUnchanged(snapshot, {
		env,
		assertCurrent: params.assertCurrent
	});
	return snapshot;
}
/** Drain may yield for minutes; recheck the original capture immediately before cutover. */
function assertImmutableProtectionUnchanged(snapshot, context) {
	context.assertCurrent();
	assertState(snapshot);
	for (const file of snapshot.config) {
		const current = readFile$1(file, context.env);
		if (current.hash !== file.hash || !isDeepStrictEqual(current.identity, file.identity)) throw new Error("Protected configuration changed before immutable cutover; the Gateway remains on its previous generation.");
	}
	assertState(snapshot);
	context.assertCurrent();
}
/** Audits establish a contiguous publication chain only after the service owner proves provenance. */
function verifyImmutableProtection(snapshot, context) {
	context.assertCurrent();
	context.candidate.assertCurrent();
	assertState(snapshot);
	const recent = auditRecords(context.env);
	const boundary = snapshot.auditBoundary === null ? recent.length : recent.findIndex((record) => auditKey(record) === snapshot.auditBoundary);
	const records = (boundary < 0 ? recent : recent.slice(0, boundary)).toReversed();
	for (const file of snapshot.config) {
		const current = readFile$1(file, context.env);
		if (current.hash === file.hash && isDeepStrictEqual(current.identity, file.identity)) continue;
		if (boundary < 0 || !isAdditive(file.fingerprint, current.fingerprint) || (file === snapshot.config[0] ? policyFingerprint(current.fingerprint) : sha256Hex(stableStringify(current.fingerprint))) !== file.policyFingerprint) throw new Error("Protected configuration changed without an additive, policy-preserving startup migration.");
		let expectedHash = file.hash;
		let expectedIdentity = file.identity;
		let writes = 0;
		for (const record of records) {
			if (record.configPath !== file.path && record.configPath !== file.pathProof.targetPath) continue;
			if (record.event === "config.external") throw new Error("A foreign config write occurred during immutable activation.");
			if (record.event !== "config.write" || record.result === "failed" || record.result === "rejected") continue;
			const ts = Date.parse(record.ts);
			const identity = (prefix) => ({
				dev: record[`${prefix}Dev`],
				ino: record[`${prefix}Ino`],
				mode: record[`${prefix}Mode`],
				nlink: record[`${prefix}Nlink`],
				uid: record[`${prefix}Uid`],
				gid: record[`${prefix}Gid`]
			});
			const previous = identity("previous");
			const next = immutableProtectedFileIdentitySchema.safeParse(identity("next"));
			if (record.pid !== context.candidate.pid || record.cwd !== context.candidate.generationPath || record.origin !== void 0 && record.origin !== "doctor" || !Number.isFinite(ts) || ts < context.candidate.startedAtMs || ts < snapshot.capturedAtMs || ts > Date.now() || record.previousHash !== expectedHash || !isDeepStrictEqual(previous, expectedIdentity) || !next.success || next.data.uid !== file.identity.uid || next.data.gid !== file.identity.gid || next.data.mode !== file.identity.mode || next.data.dev !== file.identity.dev || !record.nextHash) throw new Error("Config migration audit does not prove the selected candidate's contiguous, same-owner write chain.");
			expectedHash = record.nextHash;
			expectedIdentity = next.data;
			writes++;
		}
		if (!writes || expectedHash !== current.hash || !isDeepStrictEqual(expectedIdentity, current.identity)) throw new Error("Config migration is missing its complete config-audit publication receipt.");
	}
	assertState(snapshot);
	context.candidate.assertCurrent();
	context.assertCurrent();
}
//#endregion
//#region src/infra/update-immutable-verification.ts
const sessionProbeResultSchema = Type.Object({
	ts: Type.Number(),
	path: Type.String(),
	count: Type.Integer({
		minimum: 0,
		maximum: 1
	}),
	defaults: Type.Object({
		modelProvider: Type.Union([Type.String(), Type.Null()]),
		model: Type.Union([Type.String(), Type.Null()]),
		contextTokens: Type.Union([Type.Number(), Type.Null()])
	}),
	sessions: Type.Array(SessionRowSchema, { maxItems: 1 })
});
/** Read-only settlement: the caller owns publication, rollback, and the durable receipt. */
async function waitForImmutableGateway(params) {
	const deadline = createGatewayRestartDeadline({ timeoutMs: params.timeoutMs });
	let observed;
	let waited;
	const assertCurrent = () => {
		params.assertCurrent();
		deadline.signal.throwIfAborted();
	};
	const result = (outcome) => {
		params.assertCurrent();
		params.onReceipt?.(`readiness-${outcome}`);
		return {
			outcome,
			...observed ? { service: observed } : {}
		};
	};
	const inconclusive = () => {
		switch (waited?.waitOutcome) {
			case "still-starting": return result("still-starting");
			case "version-mismatch":
			case "build-id-mismatch":
			case "plugin-errors":
			case "channel-errors":
			case "stopped-free": return result("failed");
			default: return result("unverified");
		}
	};
	const inspectService = () => inspectImmutableActivationService({
		descriptor: params.descriptor,
		generationPath: params.generation.path,
		allowStopped: true,
		allowStarting: true,
		assertCurrent
	});
	try {
		params.assertCurrent();
		params.onReceipt?.("readiness-observing");
		return await deadline.run(async () => {
			const before = await deadline.read("readiness:service", inspectService);
			observed = before;
			const [version, buildId] = await deadline.read("readiness:artifact-identity", () => Promise.all([readPackageVersion(params.generation.path), readBuiltGatewayBuildId(params.generation.path)]));
			assertCurrent();
			if (!version || !buildId) return result("unverified");
			const env = before.state.env;
			const context = await deadline.read("readiness:probe-context", () => resolveGatewayRestartProbeContext(env, void 0, deadline.signal));
			assertCurrent();
			const port = await deadline.read("readiness:port", () => resolveUpdatedGatewayRestartPort({
				config: context.config,
				serviceEnv: env,
				serviceCommand: before.state.command
			}));
			assertCurrent();
			const probe = {
				service: {
					readCommand: async () => before.state.command,
					readRuntime: async (_env, options) => {
						assertCurrent();
						const runtime = await readSystemdServiceRuntime(env, {
							timeoutMs: options?.timeoutMs,
							systemdReadTarget: {
								scope: before.identity.scope,
								unitName: before.identity.unitName,
								unitPath: before.identity.unitPath
							}
						});
						assertCurrent();
						return runtime;
					}
				},
				port,
				env,
				deadline,
				probeContext: context,
				expectedVersion: version,
				expectedBuildId: buildId,
				requirePluginHealth: true,
				requireChannelHealth: false
			};
			waited = await waitForGatewayHealthyRestart({
				...probe,
				phase: "readiness:health",
				deadlineOutcome: "snapshot",
				requireRunningService: true,
				settle: { probes: INTERRUPTED_UPDATE_SETTLE_PROBES }
			});
			if (!waited.healthy) return inconclusive();
			const http = await deadline.read("readiness:http", () => waitForGatewayHttpReadiness({
				requireChannelHealth: false,
				config: context.config,
				port,
				attempts: 1,
				deadlineAt: deadline.deadlineMs,
				probeTimeoutMs: deadline.remainingMs(),
				delayMs: 0,
				signal: deadline.signal
			}));
			const target = await deadline.read("readiness:sessions-target", () => createConfiguredGatewayLocalProbe(context.config).resolveWebSocketTarget(port, deadline.signal));
			const auth = await deadline.read("readiness:sessions-auth", () => resolveReadOnlyLocalGatewayAuth({
				auth: context.auth,
				authNone: context.config.gateway?.auth?.mode === "none",
				env
			}));
			assertCurrent();
			if (!target || !waited.gatewayBootId) return result("unverified");
			let sameBoot = false;
			const assertSessionBoot = () => {
				assertCurrent();
				if (!sameBoot) throw new Error("Gateway boot changed before session verification");
			};
			const sessions = await deadline.read("readiness:sessions", () => callGateway({
				config: context.config,
				localPortOverride: port,
				...auth,
				tlsFingerprint: target.tlsFingerprint,
				method: "sessions.list",
				params: {
					limit: 1,
					rowMode: "compact"
				},
				scopes: [READ_SCOPE],
				timeoutMs: deadline.remainingMs(),
				signal: deadline.signal,
				onHelloOk: (hello) => {
					sameBoot = hello.server.bootId === waited?.gatewayBootId;
				},
				assertDispatchCurrent: assertSessionBoot
			}));
			assertSessionBoot();
			if (!Value.Check(sessionProbeResultSchema, sessions) || sessions.count !== sessions.sessions.length) return result("unverified");
			const after = await inspectGatewayRestart({
				...probe,
				phase: "readiness:reconcile"
			});
			assertCurrent();
			const current = await deadline.read("readiness:service-reconcile", inspectService);
			assertCurrent();
			if (current.phase !== "running" || current.pid === null || before.pid !== null && (current.pid !== before.pid || current.processStartTicks !== before.processStartTicks) || current.definitionDigest !== before.definitionDigest || current.identity.busId !== before.identity.busId || current.identity.managerOwner !== before.identity.managerOwner || current.generationPath !== params.generation.path || after.runtime.pid !== current.pid || !after.gatewayBootId || !after.healthy || !isSameGatewayRestartGeneration(waited, after) || after.gatewayVersion !== version || after.gatewayBuildId !== buildId || !(http.coreReady ?? (http.healthz === 200 && http.readyz === 200))) return result("unverified");
			assertImmutableServiceProcessCurrent(current);
			assertCurrent();
			observed = current;
			for (const { id } of getGatewayChannelWarnings(after, http)) params.onReceipt?.(`Channel health warning (${id}); run openclaw channels status --probe.`);
			return {
				...result("verified"),
				verification: {
					pid: current.pid,
					bootId: after.gatewayBootId,
					version,
					buildId,
					generationSha: params.generation.sha
				}
			};
		});
	} catch (error) {
		await deadline.cleanup;
		params.assertCurrent();
		if (hasCommandProcessCleanupError(error) || deadline.cleanupStatus === "unknown") throw error;
		return error instanceof GatewayRestartDeadlineError ? inconclusive() : result("unverified");
	} finally {
		deadline.dispose();
	}
}
//#endregion
//#region src/infra/update-immutable-activation.ts
async function assertUpdaterRuntime(record) {
	if (process.platform !== "linux" || process.geteuid?.() !== 0 || await fs$1.realpath(process.execPath) !== record.descriptor.runtime.path) throw new Error("Use the adopted external Node executable as the root Linux updater.");
}
async function requireRecord(root) {
	const record = await readImmutableInstallRecord(root);
	if (!record?.descriptor.activationEnabled) throw new Error("Immutable activation is disabled. Explicitly adopt with --enable-activation first.");
	await assertUpdaterRuntime(record);
	return record;
}
async function verifyGeneration(generation, assertCurrent, controlVersion) {
	const verified = await verifyImmutableGeneration(generation.path, generation.sha);
	assertCurrent();
	if (verified.identity !== generation.identity || verified.buildDigest !== generation.buildDigest) throw new Error("Sealed immutable generation no longer matches its recorded preparation.");
	await assertImmutableGenerationControlVersion(generation.path, controlVersion);
	assertCurrent();
}
/** Same-schema activation never migrates or rewinds live databases. Doctor rehearses private copies. */
async function rehearse(record, root, service, options, assertCurrent) {
	const env = service.state.env;
	const { sourceConfig: config } = await createConfigIO({
		env,
		configPath: record.descriptor.service.configPath,
		observe: false,
		pluginValidation: "skip"
	}).readBestEffortConfigSnapshot();
	assertCurrent();
	const result = await validateUpdateCandidateCanary({
		root,
		sourceBundledPlugins: {
			packageRoot: record.descriptor.current.path,
			directory: resolveBundledPluginsDir(env)
		},
		config,
		stateDir: record.descriptor.service.stateDir,
		env,
		nodeRunner: record.descriptor.runtime.path,
		timeoutMs: options.timeoutMs,
		migrationPolicy: "startup-only",
		assertCurrent,
		onStep: () => options.onReceipt?.("immutable:canary-step")
	});
	assertCurrent();
	if (result.status !== "ok" || result.phase !== "readiness" || result.steps.find((step) => step.name === "candidate-gateway-startup")?.exitCode !== 0) throw new Error("Immutable candidate canary did not verify Doctor, plugins, startup and readiness; current is unchanged.");
}
function activationOwner(initial, assertCurrent, options) {
	let record = initial;
	const operation = () => {
		const value = record.activation?.operation;
		if (!value) throw new Error("Immutable activation operation is missing.");
		return value;
	};
	const assertStopped = () => {
		assertCurrent();
		const stopped = operation().stoppedService;
		if (!stopped) throw new Error("Immutable stopped-service custody is unavailable; recovery retained.");
		assertImmutableServiceStoppedCurrent(stopped);
	};
	const save = (changes) => {
		record = updateImmutableInstallRecord(record, {
			...record,
			activation: {
				...record.activation,
				operation: {
					...operation(),
					...changes
				}
			}
		}, assertCurrent);
		options.onReceipt?.(`immutable:${operation().phase}`);
	};
	const inspect = (allowStarting = false) => inspectImmutableActivationService({
		descriptor: record.descriptor,
		generationPath: record.descriptor.current.path,
		allowStopped: true,
		allowStarting,
		assertCurrent
	});
	const assertService = (service) => {
		assertCurrent();
		assertImmutableDescriptorCurrent(record.descriptor);
		if (service.definitionDigest !== operation().serviceDigest) throw new Error("Immutable service policy changed; recovery retained.");
		if (service.phase === "running") assertImmutableServiceProcessCurrent(service);
	};
	const protectionContext = (service) => ({
		env: service.state.env,
		assertCurrent
	});
	const verifyProtection = (service) => {
		assertService(service);
		if (service.phase !== "running" || service.pid === null) {
			assertImmutableProtectionUnchanged(operation().protection, protectionContext(service));
			return;
		}
		verifyImmutableProtection(operation().protection, {
			...protectionContext(service),
			candidate: {
				pid: service.pid,
				generationPath: record.descriptor.current.path,
				startedAtMs: operation().servingStartedAtMs ?? operation().candidateStartedAtMs ?? operation().startedAtMs,
				assertCurrent: () => assertService(service)
			}
		});
	};
	const pending = (reason) => {
		save({ failure: reason });
		return {
			status: "pending",
			operationId: operation().operationId,
			phase: operation().phase,
			reason,
			recoveryCommand: resolveImmutableRecoveryCommand(operation().recovery, record.descriptor),
			installation: projectImmutableInstall(record)
		};
	};
	const receipt = (status, service, retire, verification) => {
		if (!verification || verification.pid !== service.pid || verification.generationSha !== record.descriptor.current.sha) throw new Error("Immutable completion requires its same-generation readiness receipt.");
		verifyProtection(service);
		const op = operation();
		const retained = record.descriptor.current.sha === op.candidate.sha ? op.previous : op.candidate;
		record = updateImmutableInstallRecord(record, {
			...record,
			prepared: record.descriptor.current.sha === op.candidate.sha ? null : record.prepared,
			activation: {
				previous: {
					sha: retained.sha,
					path: retained.path,
					identity: retained.identity,
					buildDigest: retained.buildDigest
				},
				...!retire ? { operation: {
					...op,
					phase: "rolled-back"
				} } : {},
				lastResult: {
					operationId: op.operationId,
					outcome: status,
					selectedSha: record.descriptor.current.sha,
					verifiedAtMs: Date.now(),
					gateway: {
						pid: verification.pid,
						bootId: verification.bootId,
						version: verification.version,
						buildId: verification.buildId
					}
				}
			}
		}, () => assertService(service));
		options.onReceipt?.(`immutable:${retire ? "retired" : "rolled-back"}`);
		return {
			status,
			installation: projectImmutableInstall(record),
			operationId: op.operationId,
			...!retire ? {
				phase: "rolled-back",
				recoveryCommand: resolveImmutableRecoveryCommand(op.recovery, record.descriptor)
			} : {}
		};
	};
	const observe = async () => {
		const service = await inspect(true);
		assertService(service);
		const timeoutMs = options.timeoutMs ?? await resolveUpdateFinalizationTimeoutMs(void 0, {
			env: service.state.env,
			nodeRunner: record.descriptor.runtime.path
		});
		assertService(service);
		return waitForImmutableGateway({
			descriptor: record.descriptor,
			generation: record.descriptor.current,
			timeoutMs,
			assertCurrent,
			onReceipt: options.onReceipt
		});
	};
	const complete = async (status, observed, retire) => {
		const service = observed.service;
		if (observed.outcome !== "verified" || !service || !observed.verification) return pending("verification-pending");
		verifyProtection(service);
		const protection = await captureImmutableProtection({
			...record.descriptor.service,
			...protectionContext(service)
		});
		verifyProtection(service);
		assertImmutableProtectionUnchanged(protection, protectionContext(service));
		save({ protection });
		options.onReceipt?.("immutable:post-start-canary");
		try {
			await rehearse(record, record.descriptor.current.path, service, options, assertCurrent);
		} catch (error) {
			assertCurrent();
			if (hasCommandProcessCleanupError(error)) throw error;
			return pending("post-start-canary-unverified");
		}
		assertService(service);
		const after = await observe();
		if (after.outcome !== "verified" || !after.service || after.verification?.bootId !== observed.verification.bootId || after.service.pid !== service.pid) return pending("post-start-generation-unverified");
		return receipt(status, after.service, retire, after.verification);
	};
	const stop = async (service, phase) => {
		assertService(service);
		if (service.pid === null) return;
		await withGatewayMaintenanceDrain({
			state: service.state,
			timeoutMs: options.drainTimeoutMs ?? resolveGatewayRestartDeferralTimeoutMs(),
			drainPolicy: "interrupt-after-drain",
			assertCurrent,
			warn: () => options.onReceipt?.("immutable:drain-warning")
		}, async ({ prepareEffect }) => {
			verifyProtection(service);
			if (!service.pid || !service.processStartTicks || !service.controlGroup) throw new Error("Immutable stop requires current process custody.");
			save({
				phase,
				stoppedService: {
					pid: service.pid,
					processStartTicks: service.processStartTicks,
					controlGroup: service.controlGroup
				}
			});
			const assertProtected = () => assertImmutableProtectionUnchanged(operation().protection, protectionContext(service));
			await controlImmutableService("stop", {
				descriptor: record.descriptor,
				expected: service,
				assertCurrent,
				prepareEffect: () => prepareEffect(assertProtected),
				beforeEffect: assertProtected,
				stdout: process.stderr,
				timeoutMs: options.timeoutMs
			});
		});
		assertCurrent();
	};
	const start = async (rollback) => {
		const stopped = await inspect();
		assertService(stopped);
		if (stopped.pid !== null) throw new Error("Immutable start refused: a generation is already serving.");
		assertStopped();
		save({
			phase: rollback ? "rollback-starting" : "starting",
			servingStartedAtMs: Date.now(),
			...!rollback ? { candidateStartedAtMs: Date.now() } : {}
		});
		await controlImmutableService("start", {
			descriptor: record.descriptor,
			expected: stopped,
			assertCurrent,
			stdout: process.stderr,
			timeoutMs: options.timeoutMs,
			beforeEffect: assertStopped
		});
		assertCurrent();
	};
	const startAndVerifyPredecessor = async (recovering) => {
		await start(true);
		const observed = await observe();
		return observed.outcome === "verified" && observed.service ? complete("rolled-back", observed, recovering) : pending(`${recovering ? "recovery" : "rollback"}-verification-pending`);
	};
	const rollback = async () => {
		const service = await inspect();
		verifyProtection(service);
		const protection = await captureImmutableProtection({
			...record.descriptor.service,
			...protectionContext(service)
		});
		verifyProtection(service);
		await rehearse(record, operation().previous.path, service, options, assertCurrent);
		verifyProtection(service);
		assertImmutableProtectionUnchanged(protection, protectionContext(service));
		save({
			protection,
			phase: "rollback-stopping"
		});
		await stop(service, "rollback-stopping");
		save({ phase: "rollback-publishing" });
		record = publishImmutablePointer(record, "previous", assertStopped);
		return startAndVerifyPredecessor(false);
	};
	const startAndVerifyCandidate = async () => {
		try {
			await start(false);
			save({ phase: "verifying" });
			const observed = await observe();
			if (observed.outcome === "verified" && observed.service) return complete("succeeded", observed, true);
			if (observed.outcome === "failed") {
				save({ failure: "candidate-verification-failed" });
				return await rollback();
			}
			return pending(observed.outcome === "still-starting" ? "candidate-still-starting" : "candidate-verification-pending");
		} catch (error) {
			assertCurrent();
			if (operation().phase === "starting") {
				const service = await inspect(true);
				assertService(service);
				if (service.phase === "stopped") {
					save({ failure: "candidate-start-failed" });
					return rollback();
				}
			}
			save({ failure: "activation-interrupted" });
			throw error;
		}
	};
	return {
		async activate() {
			try {
				save({ phase: "draining" });
				const service = await inspect();
				await stop(service, "stopping");
				save({ phase: "stopped" });
				assertImmutableProtectionUnchanged(operation().protection, protectionContext(service));
				save({ phase: "publishing" });
				record = publishImmutablePointer(record, "candidate", assertStopped);
				return startAndVerifyCandidate();
			} catch (error) {
				assertCurrent();
				save({ failure: "activation-interrupted" });
				throw error;
			}
		},
		async recover() {
			record = reconcileImmutablePointer(record, assertCurrent);
			const op = operation();
			await verifyGeneration(record.descriptor.current, assertCurrent, record.descriptor.version);
			const observed = await observe();
			if (observed.outcome === "verified" && observed.service) return complete(record.descriptor.current.sha === op.candidate.sha ? "succeeded" : "rolled-back", observed, true);
			if (observed.outcome === "still-starting" || observed.outcome === "unverified") return pending("recovery-verification-pending");
			const service = await inspect();
			verifyProtection(service);
			if (service.pid === null && !["prepared", "draining"].includes(op.phase)) {
				if (op.phase.startsWith("rollback-") || op.pointerIntent?.targetSha === op.previous.sha) {
					await verifyGeneration(op.previous, assertCurrent, record.descriptor.version);
					assertStopped();
					save({ phase: "rollback-publishing" });
					record = publishImmutablePointer(record, "previous", assertStopped);
				}
				if (record.descriptor.current.sha === op.candidate.sha) return startAndVerifyCandidate();
				return startAndVerifyPredecessor(true);
			}
			return record.descriptor.current.sha === op.candidate.sha ? rollback() : pending("predecessor-verification-failed");
		}
	};
}
async function activateImmutableUpdate(options) {
	const installation = await inspectImmutableInstall(options.root);
	if (!installation?.activationEnabled) throw new Error("Immutable activation is disabled.");
	return withImmutableUpdateOwner(installation.root, async (assertCurrent, fence) => {
		let record = await requireRecord(installation.root);
		assertCurrent();
		if (record.activation?.operation) throw new Error("Immutable activation recovery is pending; run openclaw update recover.");
		assertImmutableDescriptorCurrent(record.descriptor);
		const expected = options.expectedPrepared;
		const selected = record.descriptor.current;
		if (selected.sha === expected.sha && selected.path === expected.path && selected.buildDigest === expected.buildDigest) return {
			status: "already-current",
			installation: projectImmutableInstall(record)
		};
		const candidate = record.prepared;
		if (!candidate || candidate.sha !== expected.sha || candidate.path !== expected.path || candidate.buildDigest !== expected.buildDigest || candidate.preparedAtMs !== expected.preparedAtMs) throw new Error("Prepared immutable generation changed before activation; the serving generation was not stopped. Retry the requested update.");
		const inspectService = () => inspectImmutableActivationService({
			descriptor: record.descriptor,
			generationPath: record.descriptor.current.path,
			assertCurrent
		});
		const service = await inspectService();
		await verifyGeneration(record.descriptor.current, assertCurrent, record.descriptor.version);
		await verifyGeneration(candidate, assertCurrent, record.descriptor.version);
		const contracts = await readImmutableSchemaContracts(record);
		assertCurrent();
		if (contracts.reasons.length > 0) throw new Error(`Immutable activation requires matching admitted schema contracts; ${contracts.reasons.join(" ")} Previous Gateway remains running.`);
		options.onReceipt?.("immutable:canary");
		await rehearse(record, candidate.path, service, options, assertCurrent);
		if (await fs$1.stat(path.join(candidate.path, "dist", "gateway-prewarm.js")).catch(() => null)) {
			assertCurrent();
			try {
				if ((await runCommandWithTimeout([
					"/usr/sbin/runuser",
					"-u",
					record.descriptor.service.account,
					"--",
					"/usr/bin/env",
					"-i",
					..."HOME TMPDIR TMP TEMP NODE_COMPILE_CACHE NODE_DISABLE_COMPILE_CACHE".split(" ").flatMap((key) => service.state.env[key] === void 0 ? [] : [`${key}=${service.state.env[key]}`]),
					record.descriptor.runtime.path,
					path.join(candidate.path, "gateway-prewarm.mjs")
				], {
					cwd: candidate.path,
					baseEnv: {},
					env: {},
					timeoutMs: 12e4,
					killProcessTree: true
				})).code !== 0) options.onReceipt?.("immutable:compile-cache-warning: Gateway will compile on startup");
			} catch (error) {
				if (hasCommandProcessCleanupError(error)) throw error;
				options.onReceipt?.("immutable:compile-cache-warning: Gateway will compile on startup");
			}
		}
		const current = await inspectService();
		if (current.pid !== service.pid || current.processStartTicks !== service.processStartTicks || current.definitionDigest !== service.definitionDigest) throw new Error("Serving generation changed during candidate rehearsal.");
		options.onReceipt?.("immutable:recovery-preparing");
		const recovery = await prepareImmutableRecoveryRuntime({
			record,
			assertCurrent
		});
		assertCurrent();
		assertImmutableServiceProcessCurrent(current);
		const protection = await captureImmutableProtection({
			...record.descriptor.service,
			env: service.state.env,
			assertCurrent
		});
		assertCurrent();
		assertImmutableServiceProcessCurrent(current);
		const operation = {
			version: 1,
			operationId: randomUUID(),
			authority: captureUpdateCommandExecutorAuthority(fence),
			phase: "prepared",
			previous: record.descriptor.current,
			candidate,
			serviceDigest: service.definitionDigest,
			protection,
			recovery,
			startedAtMs: Date.now()
		};
		record = updateImmutableInstallRecord(record, {
			...record,
			activation: {
				...record.activation,
				operation
			}
		}, assertCurrent);
		options.onReceipt?.("immutable:prepared");
		return withGatewayServiceOperationLock(service.state.env, async (assertNative) => {
			const assertActivation = () => {
				assertCurrent();
				assertNative();
			};
			return activationOwner(record, assertActivation, options).activate();
		});
	});
}
async function recoverImmutableUpdate(options) {
	const admission = await readImmutableInstallRecordForRecovery(path.resolve(options.root));
	const record = admission.record;
	await assertUpdaterRuntime(record);
	return withImmutableUpdateOwner(record.descriptor.root, async (assertCurrent) => {
		admission.admit(assertCurrent);
		options.onReceipt?.("immutable:control-recovered");
		const current = await readImmutableInstallRecord(record.descriptor.root);
		assertCurrent();
		if (!isDeepStrictEqual(current, record)) throw new Error("Immutable recovery changed during admission; retry from its current record.");
		if (!current) throw new Error("Immutable installation disappeared during recovery.");
		if (!current.activation?.operation) return {
			status: "already-current",
			installation: projectImmutableInstall(current)
		};
		await verifyImmutableRecoveryRuntime({
			reference: current.activation.operation.recovery,
			descriptor: current.descriptor,
			assertCurrent
		});
		assertCurrent();
		return withGatewayServiceOperationLock({ OPENCLAW_SYSTEMD_UNIT: current.descriptor.service.unit }, async (assertNative) => {
			const assertRecovery = () => {
				assertCurrent();
				assertNative();
			};
			return activationOwner(current, assertRecovery, options).recover();
		});
	}, record.activation?.operation?.authority, { recover: true });
}
//#endregion
export { activateImmutableUpdate, recoverImmutableUpdate };
