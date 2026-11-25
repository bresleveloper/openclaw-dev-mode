import { createJsonSchemaValidatorProvider } from "openclaw/plugin-sdk/json-schema-validator";
// extensions/lobster/src/lobster-schema-compiler.ts
const providers = /* @__PURE__ */ new WeakMap();
const createProvider = () => createJsonSchemaValidatorProvider({
	dialect: "draft7",
	formats: /* @__PURE__ */ new Map(),
	validateSchema: true,
	duplicateIds: "reject"
});
/** Keep each dependency-owned Ajv namespace for that engine's module lifetime. */
const compileLobsterSchema = (schema, options) => {
	let provider = options.addUsedSchema ? providers.get(options.scope) : void 0;
	if (!provider) {
		provider = createProvider();
		if (options.addUsedSchema) providers.set(options.scope, provider);
	}
	const prepared = provider.getValidator(schema);
	const validate = Object.assign((value) => {
		if (prepared.check(value)) {
			validate.errors = null;
			return true;
		}
		const errors = prepared.errors(value);
		validate.errors = (options.allErrors ? errors : errors.slice(0, 1)).map((error) => ({
			instancePath: error.instancePath ?? "",
			message: error.message ?? "schema validation failed"
		}));
		return false;
	}, { errors: null });
	return validate;
};
export { compileLobsterSchema };
