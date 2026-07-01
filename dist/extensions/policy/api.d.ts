import { l as HealthCheck } from "../../health-CcVXb7fM.js";

//#region extensions/policy/src/doctor/register.d.ts
type PolicyDoctorRegistrationHost = {
  readonly registerHealthCheck: (check: HealthCheck) => void;
};
declare function registerPolicyDoctorChecks(host?: PolicyDoctorRegistrationHost): void;
//#endregion
export { registerPolicyDoctorChecks };