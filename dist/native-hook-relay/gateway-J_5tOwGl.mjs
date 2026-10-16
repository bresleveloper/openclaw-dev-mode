import { d as resolveUserPath, t as CONFIG_DIR } from "./utils-BfTq4rUg.mjs";
import { R as readFileDescriptorBounded } from "./redact-TLu2QTmL.mjs";
import "./fs-safe-JcIGlJ4o.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BVGbcfpU.mjs";
import "./exec-B7W00oZE.mjs";
import path from "node:path";
import { X509Certificate } from "node:crypto";
import fs from "node:fs/promises";
import "@openclaw/fs-safe/durability";
//#region src/infra/tls/gateway.ts
const MAX_TLS_LEAF_FILE_BYTES = 65536;
async function readTlsLeafFile(filePath) {
	const file = await fs.open(filePath, "r");
	try {
		return (await readFileDescriptorBounded(file.fd, MAX_TLS_LEAF_FILE_BYTES)).toString("utf8");
	} finally {
		await file.close();
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
//#endregion
export { inspectGatewayTlsCertificate };
