type JsonSchemaObject = Record<string, unknown>;
type JsonSchemaValue = JsonSchemaObject | boolean;
/** Validation details shared by the TypeBox schema and value compilers. */
type TypeBoxValidationError = {
  keyword?: string;
  instancePath?: string;
  schemaPath?: string;
  params?: Record<string, unknown>;
  message?: string;
};
type JsonSchemaRefinement = {
  check: (value: unknown) => boolean;
  error: (value: unknown) => string;
};
type JsonSchemaValidator = {
  readonly schema: JsonSchemaValue;
  check: (value: unknown) => boolean;
  errors: (value: unknown) => TypeBoxValidationError[];
};
type JsonSchemaValidatorProvider = {
  getValidator(schema: JsonSchemaValue): JsonSchemaValidator;
};
/** Owns dialect preparation, reference registration, and cached codegen-free checks. */
export declare function createJsonSchemaValidatorProvider(options: {
  dialect: "draft7" | "2020-12";
  formats: ReadonlyMap<string, JsonSchemaRefinement>;
  /** Validate schema documents against their registered metaschema at admission. */
  validateSchema?: boolean;
  /** Preserve each caller's policy for repeated root schema identifiers. */
  duplicateIds?: "reuse" | "reject";
}): JsonSchemaValidatorProvider;
export type { JsonSchemaValidatorProvider };