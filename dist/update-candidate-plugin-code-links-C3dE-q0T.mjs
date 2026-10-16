import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { lstatSync, readlinkSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-candidate-plugin-code-links.ts
const identity = {
	dev: string(),
	ino: string()
};
const UpdateCandidatePluginCodeLinkSchema = object({
	path: string(),
	...identity,
	link: string(),
	target: object({
		path: string(),
		...identity
	}).nullable()
});
function targetIdentity(file) {
	try {
		const target = realpathSync(file);
		const stat = statSync(target, { bigint: true });
		return {
			path: target,
			dev: stat.dev.toString(),
			ino: stat.ino.toString()
		};
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return null;
		throw error;
	}
}
/** Capture only after the plugin projection owner has validated this code edge. */
function captureUpdateCandidatePluginCodeLink(file, stat, link) {
	const fact = {
		path: file,
		dev: stat.dev.toString(),
		ino: stat.ino.toString(),
		link,
		target: targetIdentity(file)
	};
	assertUpdateCandidatePluginCodeLink(fact);
	return fact;
}
/** Recheck both the link inode and its physical target; never traverse it as data. */
function assertUpdateCandidatePluginCodeLink(fact) {
	const stat = lstatSync(fact.path, { bigint: true });
	if (!stat.isSymbolicLink() || stat.dev.toString() !== fact.dev || stat.ino.toString() !== fact.ino || readlinkSync(fact.path) !== fact.link || !isDeepStrictEqual(targetIdentity(fact.path), fact.target)) throw new Error(`Copied plugin code link changed: ${fact.path}`);
}
const UpdateCandidatePluginCodeLinkReceiptSchema = object({
	sha256: string().regex(/^[a-f0-9]{64}$/u),
	bytes: number().int().nonnegative()
});
/** Reuse the consumed plan file; large dependency graphs must not fill worker stdout. */
async function sealUpdateCandidatePluginCodeLinks(file, links) {
	const data = JSON.stringify(links);
	await (await root(path.dirname(file))).write(path.basename(file), data, { mode: 384 });
	return {
		sha256: sha256Hex(data),
		bytes: Buffer.byteLength(data)
	};
}
/** The settled producer's stdout binds the private file, not caller-controlled JSON. */
async function readUpdateCandidatePluginCodeLinks(file, receipt) {
	const { buffer } = await (await root(path.dirname(file))).read(path.basename(file), {
		maxBytes: receipt.bytes,
		symlinks: "reject",
		hardlinks: "reject"
	});
	if (buffer.length !== receipt.bytes || sha256Hex(buffer) !== receipt.sha256) throw new Error("Copied plugin code link inventory changed after snapshot");
	return array(UpdateCandidatePluginCodeLinkSchema).parse(JSON.parse(buffer.toString("utf8")));
}
//#endregion
export { sealUpdateCandidatePluginCodeLinks as a, readUpdateCandidatePluginCodeLinks as i, assertUpdateCandidatePluginCodeLink as n, captureUpdateCandidatePluginCodeLink as r, UpdateCandidatePluginCodeLinkReceiptSchema as t };
