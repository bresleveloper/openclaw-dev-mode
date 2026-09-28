import { parse } from "semver";
//#region src/infra/semver.ts
function compareValidSemver(left, right) {
	const parsedLeft = parse(left);
	const parsedRight = parse(right);
	return parsedLeft && parsedRight ? parsedLeft.compare(parsedRight) : null;
}
//#endregion
export { compareValidSemver as t };
