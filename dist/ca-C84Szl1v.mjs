import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { v as parseCanonicalIpAddress } from "./ip-CDH5BTTD.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-wk53Z0G9.mjs";
import fs from "node:fs";
import path from "node:path";
import { X509Certificate, createHash, createPrivateKey, randomBytes } from "node:crypto";
//#region src/proxy-capture/ca.ts
const DEBUG_PROXY_CA_GENERATION_TIMEOUT_MS = 3e4;
const LOCAL_PROXY_CERT_GENERATION_TIMEOUT_MS = 3e4;
const LOCAL_PROXY_DIR_MODE = 448;
const LOCAL_PROXY_PRIVATE_KEY_MODE = 384;
function buildLocalProxyCaOpenSslConfig(commonName) {
	return [
		"[req]",
		"distinguished_name = subject",
		"prompt = no",
		"",
		"[subject]",
		`CN = ${commonName}`,
		"",
		"[v3_ca]",
		"basicConstraints = critical, CA:TRUE",
		"keyUsage = critical, keyCertSign, cRLSign",
		""
	].join("\n");
}
const DEBUG_PROXY_CA_LOCK_OPTIONS = {
	retries: {
		retries: 80,
		factor: 1.3,
		minTimeout: 25,
		maxTimeout: 500,
		randomize: true
	},
	stale: 6e4,
	staleRecovery: "remove-if-unchanged"
};
const debugProxyCaGenerationQueue = new KeyedAsyncQueue();
function isValidDebugProxyCaPair(certPath, keyPath) {
	try {
		const certStat = fs.lstatSync(certPath);
		const keyStat = fs.lstatSync(keyPath);
		if (!certStat.isFile() || !keyStat.isFile() || certStat.size === 0 || keyStat.size === 0) return false;
		const cert = new X509Certificate(fs.readFileSync(certPath));
		const key = createPrivateKey(fs.readFileSync(keyPath));
		return cert.ca && cert.checkPrivateKey(key);
	} catch {
		return false;
	}
}
function removeStagingDirBestEffort(stagingDir) {
	try {
		fs.rmSync(stagingDir, {
			recursive: true,
			force: true
		});
	} catch {}
}
async function ensureLocalProxyCa(certDir, options) {
	fs.mkdirSync(certDir, {
		recursive: true,
		mode: LOCAL_PROXY_DIR_MODE
	});
	fs.chmodSync(certDir, LOCAL_PROXY_DIR_MODE);
	const certPath = path.join(certDir, "root-ca.pem");
	const keyPath = path.join(certDir, "root-ca-key.pem");
	const canonicalKeyPath = path.join(fs.realpathSync(certDir), "root-ca-key.pem");
	return await debugProxyCaGenerationQueue.enqueue(canonicalKeyPath, async () => withFileLock(canonicalKeyPath, DEBUG_PROXY_CA_LOCK_OPTIONS, async () => {
		if (isValidDebugProxyCaPair(certPath, keyPath)) return {
			certPath,
			keyPath
		};
		const openssl = resolveSystemBin("openssl");
		if (!openssl) throw new Error(`openssl is required to generate ${options.purpose} certificates`);
		const stagingDir = fs.mkdtempSync(path.join(certDir, ".root-ca-"));
		const stagedConfigPath = path.join(stagingDir, "openssl.cnf");
		const stagedCertPath = path.join(stagingDir, "root-ca.pem");
		const stagedKeyPath = path.join(stagingDir, "root-ca-key.pem");
		try {
			fs.writeFileSync(stagedConfigPath, buildLocalProxyCaOpenSslConfig(options.commonName), { mode: LOCAL_PROXY_PRIVATE_KEY_MODE });
			await runExec(openssl, [
				"req",
				"-config",
				stagedConfigPath,
				"-extensions",
				"v3_ca",
				"-x509",
				"-newkey",
				"rsa:2048",
				"-sha256",
				"-days",
				String(options.validityDays),
				"-nodes",
				"-keyout",
				stagedKeyPath,
				"-out",
				stagedCertPath
			], {
				logOutput: false,
				timeoutMs: DEBUG_PROXY_CA_GENERATION_TIMEOUT_MS
			});
			if (!isValidDebugProxyCaPair(stagedCertPath, stagedKeyPath)) throw new Error(`openssl generated invalid ${options.purpose} certificate material`);
			fs.chmodSync(stagedKeyPath, LOCAL_PROXY_PRIVATE_KEY_MODE);
			fs.chmodSync(stagedCertPath, 420);
			fs.renameSync(stagedKeyPath, keyPath);
			fs.renameSync(stagedCertPath, certPath);
			return {
				certPath,
				keyPath
			};
		} finally {
			removeStagingDirBestEffort(stagingDir);
		}
	}));
}
async function ensureDebugProxyCa(certDir) {
	return await ensureLocalProxyCa(certDir, {
		commonName: "OpenClaw Debug Proxy",
		purpose: "debug proxy",
		validityDays: 7
	});
}
/** Generates the root CA for one Gateway-lifetime secret egress proxy. */
async function ensureSecretEgressProxyCa(certDir) {
	return await ensureLocalProxyCa(certDir, {
		commonName: "OpenClaw Secret Egress Proxy",
		purpose: "secret egress proxy",
		validityDays: 3650
	});
}
function isValidLeafPair(params) {
	try {
		const cert = new X509Certificate(fs.readFileSync(params.certPath));
		const key = createPrivateKey(fs.readFileSync(params.keyPath));
		const hostMatches = parseCanonicalIpAddress(params.hostname) ? cert.checkIP(params.hostname) === params.hostname : cert.checkHost(params.hostname) === params.hostname;
		return !cert.ca && cert.checkPrivateKey(key) && hostMatches;
	} catch {
		return false;
	}
}
async function generateLocalProxyLeafQueued(params) {
	const openssl = resolveSystemBin("openssl");
	if (!openssl) throw new Error("openssl is required to generate local proxy certificates");
	const leafKeyPath = path.join(params.certDir, "leaf-key.pem");
	if (!fs.existsSync(leafKeyPath)) {
		await runExec(openssl, [
			"genrsa",
			"-out",
			leafKeyPath,
			"2048"
		], {
			logOutput: false,
			timeoutMs: LOCAL_PROXY_CERT_GENERATION_TIMEOUT_MS
		});
		fs.chmodSync(leafKeyPath, LOCAL_PROXY_PRIVATE_KEY_MODE);
	}
	const leafId = createHash("sha256").update(params.hostname).digest("hex");
	const stagingDir = fs.mkdtempSync(path.join(params.certDir, `.leaf-${leafId.slice(0, 12)}-`));
	const csrPath = path.join(stagingDir, "leaf.csr");
	const certPath = path.join(stagingDir, "leaf.pem");
	const extPath = path.join(stagingDir, "leaf.ext");
	try {
		const sanKind = parseCanonicalIpAddress(params.hostname) ? "IP" : "DNS";
		fs.writeFileSync(extPath, `subjectAltName=${sanKind}:${params.hostname}\nextendedKeyUsage=serverAuth\n`, { mode: LOCAL_PROXY_PRIVATE_KEY_MODE });
		await runExec(openssl, [
			"req",
			"-new",
			"-key",
			leafKeyPath,
			"-subj",
			`/CN=${params.hostname}`,
			"-out",
			csrPath
		], {
			logOutput: false,
			timeoutMs: LOCAL_PROXY_CERT_GENERATION_TIMEOUT_MS
		});
		await runExec(openssl, [
			"x509",
			"-req",
			"-in",
			csrPath,
			"-CA",
			params.ca.certPath,
			"-CAkey",
			params.ca.keyPath,
			"-set_serial",
			`0x${randomBytes(16).toString("hex")}`,
			"-out",
			certPath,
			"-days",
			"1",
			"-sha256",
			"-extfile",
			extPath
		], {
			logOutput: false,
			timeoutMs: LOCAL_PROXY_CERT_GENERATION_TIMEOUT_MS
		});
		if (!isValidLeafPair({
			certPath,
			keyPath: leafKeyPath,
			hostname: params.hostname
		})) throw new Error("openssl generated invalid local proxy leaf certificate material");
		return {
			cert: fs.readFileSync(certPath),
			key: fs.readFileSync(leafKeyPath)
		};
	} finally {
		removeStagingDirBestEffort(stagingDir);
	}
}
/** Mints one on-demand TLS leaf signed by a local proxy CA. */
async function generateLocalProxyLeaf(params) {
	const queueKey = path.join(fs.realpathSync(params.certDir), "leaf-key.pem");
	return await debugProxyCaGenerationQueue.enqueue(queueKey, () => generateLocalProxyLeafQueued(params));
}
//#endregion
export { ensureSecretEgressProxyCa as n, generateLocalProxyLeaf as r, ensureDebugProxyCa as t };
