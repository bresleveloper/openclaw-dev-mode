import { a as optionalPositiveIntegerSchema, i as optionalNonNegativeIntegerSchema, r as optionalFiniteNumberSchema, s as stringEnum } from "./typebox-DK0GFdj5.js";
import "./channel-actions-CdLhqkfP.js";
import { Type } from "typebox";
/** TypeBox schema for the model-facing Canvas tool arguments. */
const CanvasToolSchema = Type.Object({
	action: stringEnum([
		"present",
		"hide",
		"navigate",
		"eval",
		"snapshot",
		"a2ui_push",
		"a2ui_reset"
	]),
	gatewayUrl: Type.Optional(Type.String()),
	gatewayToken: Type.Optional(Type.String()),
	timeoutMs: optionalPositiveIntegerSchema(),
	node: Type.Optional(Type.String()),
	target: Type.Optional(Type.String()),
	x: optionalFiniteNumberSchema(),
	y: optionalFiniteNumberSchema(),
	width: optionalFiniteNumberSchema(),
	height: optionalFiniteNumberSchema(),
	url: Type.Optional(Type.String()),
	javaScript: Type.Optional(Type.String()),
	outputFormat: Type.Optional(stringEnum([
		"png",
		"jpg",
		"jpeg"
	])),
	maxWidth: optionalPositiveIntegerSchema(),
	quality: optionalFiniteNumberSchema({
		minimum: 0,
		maximum: 1
	}),
	delayMs: optionalNonNegativeIntegerSchema(),
	jsonl: Type.Optional(Type.String()),
	jsonlPath: Type.Optional(Type.String())
});
//#endregion
export { CanvasToolSchema as t };
