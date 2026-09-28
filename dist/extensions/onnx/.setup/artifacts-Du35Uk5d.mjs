import { t as OnnxWorkerError } from "./protocol-lN8zQ8J3.mjs";
import path from "node:path";
import { Type } from "typebox";
import { Value } from "typebox/value";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { readFileWindowFully, root, sha256File } from "openclaw/plugin-sdk/file-access-runtime";
//#region extensions/onnx/src/artifacts.ts
const ExportSchema = Type.Object({
	modelId: Type.String(),
	sourceRevision: Type.String({ pattern: "^[a-f0-9]{40}$" }),
	files: Type.Array(Type.Object({
		name: Type.Union([
			Type.Literal("model.onnx"),
			Type.Literal("tokenizer.json"),
			Type.Literal("tokenizer_config.json"),
			Type.Literal("config.json"),
			Type.Literal("special_tokens_map.json")
		]),
		size: Type.Integer({
			minimum: 1,
			maximum: 15e8
		}),
		sha256: Type.String({ pattern: "^[a-f0-9]{64}$" })
	}, { additionalProperties: false }), {
		minItems: 2,
		maxItems: 5
	})
}, { additionalProperties: false });
async function withModelFile(file, maxBytes, consume) {
	let handle;
	try {
		handle = await fs.open(file, "r");
		const stat = await handle.stat();
		if (!stat.isFile() || stat.size < 1 || stat.size > maxBytes) throw new OnnxWorkerError("model-integrity");
		return await consume(handle, stat.size);
	} catch (error) {
		if (error instanceof OnnxWorkerError) throw error;
		throw new OnnxWorkerError(error instanceof Error && "code" in error && error.code === "too-large" ? "model-integrity" : "model-missing");
	} finally {
		await handle?.close();
	}
}
async function readBounded(file, maxBytes) {
	return await withModelFile(file, maxBytes, async (handle, size) => {
		const data = Buffer.alloc(size);
		if (await readFileWindowFully(handle, data, 0) !== data.length) throw new OnnxWorkerError("model-integrity");
		return data;
	});
}
async function resolveModelFiles(root, model) {
	if (model.source.kind === "hub") return model.source.files;
	let value;
	try {
		value = JSON.parse((await readBounded(path.join(root, model.id, "model.json"), 32768)).toString("utf8"));
	} catch (error) {
		if (error instanceof OnnxWorkerError) throw error;
		throw new OnnxWorkerError("model-integrity");
	}
	if (!Value.Check(ExportSchema, value) || value.modelId !== model.id || value.sourceRevision !== model.source.revision) throw new OnnxWorkerError("model-integrity");
	const names = value.files.map((file) => file.name);
	if (new Set(names).size !== names.length || !names.includes("model.onnx") || !names.includes("tokenizer.json")) throw new OnnxWorkerError("model-integrity");
	return value.files.map((file) => ({
		name: file.name,
		bytes: file.size,
		sha256: file.sha256
	}));
}
function modelArtifactByteLimit(file) {
	const limit = file.name === "model.onnx" ? 15e8 : 16777216;
	if (file.bytes > limit) throw new OnnxWorkerError("model-integrity");
	return file.bytes;
}
async function readModelArtifact(root, model, file) {
	const data = await readBounded(path.join(root, model.id, file.name), modelArtifactByteLimit(file));
	if (data.length !== file.bytes || createHash("sha256").update(data).digest("hex") !== file.sha256) throw new OnnxWorkerError("model-integrity");
	return data;
}
async function verifyModelArtifact(root, model, file) {
	const maxBytes = modelArtifactByteLimit(file);
	await withModelFile(path.join(root, model.id, file.name), maxBytes, async (handle, size) => {
		if (size !== file.bytes) throw new OnnxWorkerError("model-integrity");
		const hash = await sha256File(handle, { maxBytes });
		if (hash.bytes !== file.bytes || hash.digest !== file.sha256) throw new OnnxWorkerError("model-integrity");
	});
}
async function verifyModel(root, model) {
	for (const file of await resolveModelFiles(root, model)) await verifyModelArtifact(root, model, file);
}
async function downloadModel(root$1, model, signal) {
	if (model.source.kind !== "hub") throw new Error(`${model.id} requires a local export. Use the plugin's export-gliclass-instruct.py helper.`);
	const destination = path.join(root$1, model.id);
	await fs.mkdir(destination, { recursive: true });
	const directory = await root(destination);
	for (const file of model.source.files) {
		signal.throwIfAborted();
		const target = path.join(destination, file.name);
		if (await fs.lstat(target).catch((error) => {
			if (error instanceof Error && "code" in error && error.code === "ENOENT") return;
			throw error;
		})) {
			await verifyModelArtifact(root$1, model, file);
			continue;
		}
		const temp = `.${file.name}.${randomUUID()}.partial`;
		const url = `https://huggingface.co/${model.source.repository}/resolve/${model.source.revision}/${file.path}`;
		async function* downloadChunks() {
			const { fetchWithSsrFGuard } = await import("openclaw/plugin-sdk/ssrf-runtime");
			const guarded = await fetchWithSsrFGuard({
				url,
				requireHttps: true,
				maxRedirects: 5,
				signal
			});
			try {
				if (!guarded.response.ok || !guarded.response.body) throw new Error(`Model download failed: HTTP ${guarded.response.status}.`);
				const hash = createHash("sha256");
				let size = 0;
				signal.throwIfAborted();
				for await (const chunk of guarded.response.body) {
					size += chunk.byteLength;
					if (size > file.bytes) throw new Error("Model download exceeds its pinned size.");
					hash.update(chunk);
					yield chunk;
				}
				if (size !== file.bytes || hash.digest("hex") !== file.sha256) throw new Error("Model download failed its pinned integrity check.");
			} finally {
				try {
					await guarded.response.body?.cancel();
				} finally {
					await guarded.release();
				}
			}
		}
		await directory.create(`./${temp}`, downloadChunks(), {
			mode: 384 & ~process.umask(),
			durable: false,
			mkdir: false,
			maxBytes: file.bytes,
			signal
		});
		try {
			signal.throwIfAborted();
			try {
				await fs.link(path.join(directory.rootReal, temp), target);
			} catch (error) {
				if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
				await verifyModelArtifact(root$1, model, file);
			}
		} finally {
			await directory.remove(`./${temp}`, { force: true });
		}
	}
}
//#endregion
export { verifyModel as i, readModelArtifact as n, resolveModelFiles as r, downloadModel as t };
