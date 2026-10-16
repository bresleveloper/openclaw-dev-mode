import { Et as _enum, Jn as string, Lt as boolean, Nt as array, lr as uuid, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import path from "node:path";
//#region src/infra/package-update-activation-schema.ts
const absolutePath = string().min(1).max(4096).refine((value) => path.resolve(value) === value);
const packageActivationIdentitySchema = string().regex(/^\d+:\d+$/u);
const fingerprint = strictObject({
	digest: string().regex(/^[a-f0-9]{64}$/u),
	identity: packageActivationIdentitySchema,
	version: string().min(1).max(256)
});
const settlementDetail = string().min(1).max(1048576);
const basename$1 = string().min(1).max(255).refine((value) => value !== "." && value !== ".." && !/[\\/\0]/u.test(value));
const transferName = _enum([
	"anchor",
	"helper",
	"candidate",
	"launchers",
	"previous-launchers"
]);
const PackageActivationDescriptorSchema = strictObject({
	layout: literal("external-helper"),
	version: literal(1),
	operationId: uuid(),
	recoveryNodePath: absolutePath,
	authority: strictObject({
		databasePath: absolutePath,
		databaseIdentity: packageActivationIdentitySchema,
		parentIdentity: packageActivationIdentitySchema,
		installKey: absolutePath,
		owner: string().min(1).max(4096)
	}),
	anchorIdentity: packageActivationIdentitySchema,
	journalIdentity: packageActivationIdentitySchema,
	journalParentIdentity: packageActivationIdentitySchema,
	parentIdentity: packageActivationIdentitySchema,
	binDir: absolutePath,
	binIdentity: packageActivationIdentitySchema,
	originalStageRoot: absolutePath,
	previous: fingerprint,
	candidate: fingerprint,
	launcherRootIdentity: packageActivationIdentitySchema,
	previousLauncherRootIdentity: packageActivationIdentitySchema.nullable(),
	helperIdentity: packageActivationIdentitySchema,
	preparation: array(strictObject({
		name: transferName,
		source: absolutePath,
		sourceParentIdentity: packageActivationIdentitySchema,
		identity: packageActivationIdentitySchema
	})).min(4).max(5),
	helperDigest: string().regex(/^[a-f0-9]{64}$/u),
	launchers: array(strictObject({
		name: basename$1,
		previous: string().max(4096).nullable(),
		candidate: string().max(4096),
		previousIdentity: packageActivationIdentitySchema.nullable(),
		candidateIdentity: packageActivationIdentitySchema
	})).max(64)
});
const PackageActivationPhaseSchema = _enum([
	"preparing",
	"prepared",
	"publishing",
	"publication-complete",
	"rollback-in-progress",
	"rolled-back",
	"aborted",
	"retiring",
	"anchor-retired",
	"superseded"
]);
const intentSchema = union([
	strictObject({
		kind: literal("publication-settled-external-change"),
		replacementIdentity: packageActivationIdentitySchema,
		settled: boolean(),
		detail: settlementDetail
	}),
	strictObject({
		kind: _enum([
			"superseded-by-manual-install",
			"recovery-lease-identity-changed",
			"recovery-lease-missing"
		]),
		replacementIdentity: packageActivationIdentitySchema,
		settled: boolean(),
		detail: settlementDetail.optional()
	}),
	strictObject({
		kind: literal("prepare"),
		completed: array(transferName).max(5),
		moving: transferName.nullable()
	}),
	strictObject({
		kind: _enum(["remove-anchor", "unlink-helper"]),
		identity: packageActivationIdentitySchema,
		selected: _enum(["previous", "candidate"])
	}),
	strictObject({ kind: _enum(["displace", "publish"]) }),
	strictObject({
		kind: literal("launcher"),
		name: basename$1,
		identity: packageActivationIdentitySchema
	}),
	strictObject({
		kind: literal("retire"),
		selected: _enum(["previous", "candidate"])
	}),
	strictObject({
		kind: literal("remove"),
		name: _enum([
			"previous",
			"candidate",
			"previous.candidate",
			"launchers",
			"previous-launchers"
		]),
		identity: packageActivationIdentitySchema,
		selected: _enum(["previous", "candidate"])
	})
]).nullable();
//#endregion
export { packageActivationIdentitySchema as a, intentSchema as i, PackageActivationPhaseSchema as n, basename$1 as r, PackageActivationDescriptorSchema as t };
