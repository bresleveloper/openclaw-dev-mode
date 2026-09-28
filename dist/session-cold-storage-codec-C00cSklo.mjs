import { Fn as object, Jn as string, Pn as number, Yt as discriminatedUnion, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
import { o as resolveSessionArtifactDirectory } from "./paths-CcMbq5NY.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/config/sessions/session-cold-storage-codec.ts
function resolveSessionColdArchivePath(storePath, archiveName) {
	if (!/^[a-f0-9]{64}\.jsonl\.zst$/.test(archiveName)) throw new Error("Invalid cold transcript archive name");
	return path.join(resolveSessionArtifactDirectory(storePath), "cold", archiveName);
}
async function readVerifiedSessionColdArchive(params) {
	const { archive } = params;
	const bytes = archive.storage === "sqlite" ? Buffer.from(archive.archive_blob ?? []) : await fs.readFile(resolveSessionColdArchivePath(params.storePath, archive.archive_name)).catch((error) => {
		throw new Error(`Cold transcript archive ${archive.archive_name} is missing or unreadable. Restore it from a backup; its transcript has not been replaced with empty history.`, { cause: error });
	});
	if (bytes.length !== archive.archive_bytes || createHash("sha256").update(bytes).digest("hex") !== archive.archive_sha256) throw new Error(`Cold transcript archive ${archive.archive_name} failed verification. Restore it from a verified backup.`);
	return bytes;
}
const integer = number().int();
const nullableString = string().nullable();
const sessionColdRecordSchema = discriminatedUnion("kind", [
	object({
		kind: literal("header"),
		version: literal(1),
		sessionId: string(),
		generation: string()
	}),
	object({
		kind: literal("event"),
		row: object({
			seq: integer,
			event_json: string(),
			created_at: integer
		})
	}),
	object({
		kind: literal("identity"),
		row: object({
			event_id: string(),
			seq: integer,
			event_type: nullableString,
			parent_id: nullableString,
			message_idempotency_key: nullableString,
			created_at: integer
		})
	}),
	object({
		kind: literal("active"),
		row: object({
			active_position: integer,
			event_seq: integer,
			message_position: integer.nullable(),
			context_eligible: integer.nullable()
		})
	}),
	object({
		kind: literal("index"),
		row: object({
			indexed_seq: integer,
			leaf_event_id: nullableString,
			needs_rebuild: integer,
			active_event_count: integer,
			active_message_count: integer,
			updated_at: integer
		})
	}),
	object({
		kind: literal("fts"),
		row: object({
			text: nullableString,
			message_id: nullableString,
			role: nullableString,
			timestamp: union([string(), number()]).nullable()
		})
	})
]);
//#endregion
export { resolveSessionColdArchivePath as n, sessionColdRecordSchema as r, readVerifiedSessionColdArchive as t };
