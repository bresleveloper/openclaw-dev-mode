import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
//#region src/skills/workshop/revision-hash.ts
function hashSkillProposalRevision(record) {
	return sha256Hex(JSON.stringify({
		proposedVersion: record.proposedVersion,
		contentSha256: record.draftHash,
		supportFiles: (record.supportFiles ?? []).map((file) => ({
			path: file.path,
			sha256: file.hash,
			sizeBytes: file.sizeBytes
		})).toSorted((left, right) => left.path.localeCompare(right.path))
	}));
}
//#endregion
//#region src/skills/workshop/proposal-hash.ts
function hashSkillProposalContent(content) {
	return sha256Hex(content);
}
//#endregion
export { hashSkillProposalRevision as n, hashSkillProposalContent as t };
