import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { a as canonicalPathFromExistingAncestor, d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { f as shortenHomeInString, t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { o as publishFileNoClobber, t as ensureDurableDirectory } from "./directory-durability-BKe2aOQN.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-wk53Z0G9.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { X509Certificate } from "node:crypto";
import tls from "node:tls";
//#region src/infra/tls/gateway.ts
const GATEWAY_TLS_CERT_GENERATION_TIMEOUT_MS = 3e4;
const MAX_TLS_LEAF_FILE_BYTES = 65536;
async function readTlsLeafFile(filePath) {
	const file = await fs.open(filePath, "r");
	try {
		return (await readFileDescriptorBounded(file.fd, MAX_TLS_LEAF_FILE_BYTES)).toString("utf8");
	} finally {
		await file.close();
	}
}
function gatewayTlsDegradation(reason) {
	return {
		event: "gateway.tls.degraded",
		ownerKind: "gateway",
		ownerId: "tls",
		reason,
		state: "best-effort"
	};
}
async function publishGeneratedTlsOutput(stagedPath, finalPath) {
	const degradationReasons = [];
	const stagedHandle = await fs.open(stagedPath, "r+");
	let stagedIdentity;
	try {
		await stagedHandle.sync();
		stagedIdentity = await stagedHandle.stat();
	} finally {
		await stagedHandle.close();
	}
	const publication = await publishFileNoClobber(stagedPath, finalPath, {
		strategy: "link-or-copy",
		durability: "degrade"
	});
	if (publication.method === "exclusive-copy") degradationReasons.push("atomic hard-link publication unavailable");
	if (publication.durability === "degraded") degradationReasons.push("directory durability unavailable");
	const [currentStagedIdentity, currentPublishedIdentity] = await Promise.all([fs.lstat(stagedPath), fs.lstat(finalPath)]);
	const hardlinkChanged = publication.method === "hardlink" && !sameFileIdentity(stagedIdentity, publication.identity);
	if (!currentStagedIdentity.isFile() || !currentPublishedIdentity.isFile() || !sameFileIdentity(stagedIdentity, currentStagedIdentity) || !sameFileIdentity(publication.identity, currentPublishedIdentity) || hardlinkChanged) throw new Error(`Generated TLS output changed during publication: ${finalPath}`);
	return {
		degradationReasons,
		identity: publication.identity
	};
}
async function generateSelfSignedCert(params) {
	const certDir = await canonicalPathFromExistingAncestor(path.dirname(params.certPath));
	const keyDir = await canonicalPathFromExistingAncestor(path.dirname(params.keyPath));
	const certDirectory = await ensureDurableDirectory({ directoryPath: certDir });
	const keyDirectory = keyDir === certDir ? certDirectory : await ensureDurableDirectory({ directoryPath: keyDir });
	const opensslBin = resolveSystemBin("openssl");
	if (!opensslBin) throw new Error("openssl not found in trusted system directories. Install it in an OS-managed location.");
	const certStageDir = await fs.mkdtemp(path.join(certDir, ".openclaw-gateway-tls-cert-"));
	const stagedCertPath = path.join(certStageDir, "cert.pem");
	let keyStageDir;
	try {
		keyStageDir = await fs.mkdtemp(path.join(keyDir, ".openclaw-gateway-tls-key-"));
		const stagedKeyPath = path.join(keyStageDir, "key.pem");
		await Promise.all([fs.chmod(certStageDir, 448), fs.chmod(keyStageDir, 448)]);
		await runExec(opensslBin, [
			"req",
			"-x509",
			"-newkey",
			"rsa:2048",
			"-sha256",
			"-days",
			"3650",
			"-nodes",
			"-keyout",
			stagedKeyPath,
			"-out",
			stagedCertPath,
			"-subj",
			"/CN=openclaw-gateway"
		], {
			logOutput: false,
			timeoutMs: GATEWAY_TLS_CERT_GENERATION_TIMEOUT_MS
		});
		await Promise.all([fs.chmod(stagedKeyPath, 384), fs.chmod(stagedCertPath, 384)]);
		const [cert, key] = await Promise.all([fs.readFile(stagedCertPath, "utf8"), fs.readFile(stagedKeyPath, "utf8")]);
		tls.createSecureContext({
			cert,
			key,
			minVersion: "TLSv1.3"
		});
		const degradationReasons = /* @__PURE__ */ new Set();
		if (certDirectory.parentSync.status === "unsupported" || keyDirectory.parentSync.status === "unsupported") degradationReasons.add("directory durability unavailable");
		(await publishGeneratedTlsOutput(stagedCertPath, path.join(certDirectory.path, path.basename(params.certPath)))).degradationReasons.forEach((reason) => degradationReasons.add(reason));
		(await publishGeneratedTlsOutput(stagedKeyPath, path.join(keyDirectory.path, path.basename(params.keyPath)))).degradationReasons.forEach((reason) => degradationReasons.add(reason));
		for (const reason of degradationReasons) {
			const degradation = gatewayTlsDegradation(reason);
			params.log?.warn?.(`[GATEWAY_TLS_DEGRADED] best-effort gateway:tls: ${degradation.reason}.`, degradation);
		}
		params.log?.info?.(`gateway tls: generated self-signed cert at ${shortenHomeInString(params.certPath)}`);
	} finally {
		await Promise.allSettled([certStageDir, keyStageDir].filter((dir) => Boolean(dir)).map((dir) => fs.rm(dir, {
			force: true,
			recursive: true
		})));
	}
}
function resolveGatewayTlsCertPath(certPath) {
	return resolveUserPath(typeof certPath === "string" && certPath.trim() ? certPath : path.join(CONFIG_DIR, "gateway", "tls", "gateway-cert.pem"));
}
/** Read only public certificate bytes. Inspection never provisions or requires server secrets. */
async function inspectGatewayTlsCertificate(cfg) {
	if (cfg?.enabled !== true) return err("gateway tls is disabled");
	try {
		const cert = await readTlsLeafFile(resolveGatewayTlsCertPath(cfg.certPath));
		const fingerprintSha256 = normalizeTlsFingerprint(new X509Certificate(cert).fingerprint256);
		return fingerprintSha256 ? ok({
			cert,
			fingerprintSha256
		}) : err("gateway tls: unable to compute certificate fingerprint");
	} catch (error) {
		return err(`gateway tls: failed to load cert (${String(error)})`);
	}
}
/** Server lifecycle only: load TLS material; startup may also provision a missing pair. */
async function loadGatewayTlsServerRuntime(cfg, log) {
	if (!cfg || cfg.enabled !== true) return {
		enabled: false,
		required: false
	};
	const autoGenerate = cfg.autoGenerate !== false;
	const baseDir = path.join(CONFIG_DIR, "gateway", "tls");
	const certPath = resolveGatewayTlsCertPath(cfg.certPath);
	const keyPath = resolveUserPath(typeof cfg.keyPath === "string" && cfg.keyPath.trim() ? cfg.keyPath : path.join(baseDir, "gateway-key.pem"));
	const caPath = cfg.caPath ? resolveUserPath(cfg.caPath) : void 0;
	const hasCert = await pathExists(certPath);
	const hasKey = await pathExists(keyPath);
	if (!hasCert && !hasKey && autoGenerate) try {
		await generateSelfSignedCert({
			certPath,
			keyPath,
			log
		});
	} catch (error) {
		return {
			enabled: false,
			required: true,
			certPath,
			keyPath,
			error: `gateway tls: failed to generate cert (${String(error)})`
		};
	}
	if (!await pathExists(certPath) || !await pathExists(keyPath)) return {
		enabled: false,
		required: true,
		certPath,
		keyPath,
		error: "gateway tls: cert/key missing"
	};
	try {
		const cert = await readTlsLeafFile(certPath);
		const key = await readTlsLeafFile(keyPath);
		const ca = caPath ? await fs.readFile(caPath, "utf8") : void 0;
		const x509 = new X509Certificate(cert);
		const fingerprintSha256 = normalizeTlsFingerprint(x509.fingerprint256 ?? "");
		if (!fingerprintSha256) return {
			enabled: false,
			required: true,
			certPath,
			keyPath,
			caPath,
			error: "gateway tls: unable to compute certificate fingerprint"
		};
		const tlsOptions = {
			cert,
			key,
			ca,
			minVersion: "TLSv1.3"
		};
		tls.createSecureContext(tlsOptions);
		return {
			enabled: true,
			required: true,
			certPath,
			keyPath,
			caPath,
			fingerprintSha256,
			tlsOptions
		};
	} catch (error) {
		return {
			enabled: false,
			required: true,
			certPath,
			keyPath,
			caPath,
			error: `gateway tls: failed to load cert (${String(error)})`
		};
	}
}
//#endregion
export { loadGatewayTlsServerRuntime as n, inspectGatewayTlsCertificate as t };
