import { n as SkillResourceDeliverySchema } from "./skill-resources-C_go8RE1.mjs";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/infra/node-claude-skill-protocol.ts
const NODE_CLAUDE_SKILLS_CAPABILITY = "claude-cli-skills-v1";
const NODE_CLAUDE_SKILLS_MESSAGE_BYTES = 67108864;
const NODE_CLAUDE_WORKSHOP_CALL_BYTES = NODE_CLAUDE_SKILLS_MESSAGE_BYTES;
const NODE_CLAUDE_WORKSHOP_RESULT_BYTES = 131072;
const closed = { additionalProperties: false };
const callId = Type.String({
	minLength: 1,
	maxLength: 128
});
const NodeClaudeSkillInitSchema = Type.Object({
	type: Type.Literal("init"),
	resources: Type.Optional(SkillResourceDeliverySchema),
	workshop: Type.Optional(Type.Object({
		description: Type.String({ maxLength: 4096 }),
		inputSchema: Type.Record(Type.String(), Type.Unknown())
	}, closed))
}, closed);
const NodeClaudeSkillUpstreamSchema = Type.Union([Type.Object({
	type: Type.Literal("stdout"),
	text: Type.String({ maxLength: 1048576 })
}, closed), Type.Object({
	type: Type.Literal("workshop"),
	id: callId,
	arguments: Type.Unknown()
}, closed)]);
const NodeClaudeSkillResultSchema = Type.Object({
	type: Type.Literal("result"),
	id: callId,
	result: Type.Unknown()
}, closed);
function encodeNodeClaudeSkillMessage(value, maxBytes) {
	const bytes = Buffer.from(JSON.stringify(value));
	if (bytes.length > maxBytes) throw new Error("Claude node skill message exceeds its bounded transport limit.");
	return bytes;
}
function decodeNodeClaudeSkillInit(bytes) {
	if (bytes.byteLength > 67108864) throw new Error("Claude node skill initialization exceeds its transport limit.");
	const value = JSON.parse(Buffer.from(bytes).toString("utf8"));
	if (!Value.Check(NodeClaudeSkillInitSchema, value)) throw new Error("Invalid Claude node skill initialization.");
	if (value.workshop) encodeNodeClaudeSkillMessage(value.workshop, 16384);
	return value;
}
//#endregion
export { NodeClaudeSkillResultSchema as a, encodeNodeClaudeSkillMessage as c, NODE_CLAUDE_WORKSHOP_RESULT_BYTES as i, NODE_CLAUDE_SKILLS_MESSAGE_BYTES as n, NodeClaudeSkillUpstreamSchema as o, NODE_CLAUDE_WORKSHOP_CALL_BYTES as r, decodeNodeClaudeSkillInit as s, NODE_CLAUDE_SKILLS_CAPABILITY as t };
