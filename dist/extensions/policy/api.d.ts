import { c as HealthCheck } from "../../health-cYhdxqLA.js";
//#region extensions/policy/src/doctor/register.d.ts
type PolicyDoctorRegistrationHost = {
  readonly registerHealthCheck: (check: HealthCheck) => void;
};
export declare function registerPolicyDoctorChecks(host?: PolicyDoctorRegistrationHost): void;
//#endregion