import { Type } from "typebox";
//#region src/agents/sessions/tools/tool-contracts.ts
/**
* Shared built-in session tool input/detail contracts.
*
* Keeps tool factories, renderers, and callers aligned on typed payload and metadata shapes.
*/
function formatFullOutputFooter(path) {
	return `Full output: ${path}`;
}
const readContinuationFields = {
	offset: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}))
};
const ReadToolContinuationSchema = Type.Union([Type.Object({
	kind: Type.Literal("line"),
	...readContinuationFields
}, { additionalProperties: false }), Type.Object({
	kind: Type.Literal("cursor"),
	...readContinuationFields,
	cursor: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
}, { additionalProperties: false })]);
//#endregion
export { formatFullOutputFooter as n, ReadToolContinuationSchema as t };
