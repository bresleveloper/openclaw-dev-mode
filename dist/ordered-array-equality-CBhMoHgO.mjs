//#region src/skills/runtime/ordered-array-equality.ts
const areOrderedArraysEqual = (left, right, equals) => left.length === right.length && left.every((value, index) => equals(value, right[index]));
//#endregion
export { areOrderedArraysEqual as t };
