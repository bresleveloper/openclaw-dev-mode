//#region src/infra/package-update-refusal.ts
const PACKAGE_REFUSAL_CODES = ["package-recovery-permissions-unsafe", "managed-handoff-lease-identity-changed"];
const packageUpdateRefusal = (code, message) => Object.assign(new Error(message), { code });
//#endregion
export { packageUpdateRefusal as n, PACKAGE_REFUSAL_CODES as t };
