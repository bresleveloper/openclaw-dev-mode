import { i as normalizeTypeBoxValidationErrors } from "./json-schema-Cq3X13VY.mjs";
import { Compile } from "typebox/compile";
//#region packages/gateway-protocol/src/protocol-validator.ts
/* @__NO_SIDE_EFFECTS__ */
function lazyCompile(schema, precheck) {
	let compiled;
	let errors = null;
	const getCompiled = () => {
		compiled ??= Compile(schema);
		return compiled;
	};
	const validate = ((data) => {
		const precheckError = precheck?.(data);
		if (precheckError) {
			errors = [precheckError];
			return false;
		}
		const current = getCompiled();
		const valid = current.Check(data);
		errors = valid ? null : normalizeTypeBoxValidationErrors([...current.Errors(data)]);
		return valid;
	});
	Object.defineProperties(validate, {
		errors: {
			configurable: true,
			enumerable: true,
			get: () => errors,
			set: (nextErrors) => {
				errors = nextErrors ?? null;
			}
		},
		schema: {
			configurable: true,
			enumerable: true,
			get: () => schema
		}
	});
	return validate;
}
//#endregion
export { lazyCompile as t };
