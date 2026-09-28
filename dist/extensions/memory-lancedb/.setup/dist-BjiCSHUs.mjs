import { a as __toCommonJS, i as __require, n as __esmMin, r as __exportAll, t as __commonJSMin } from "./rolldown-runtime-BMI-E3GI.mjs";
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/arrow_type.js
var require_arrow_type = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.typedArrayToArrowType = typedArrayToArrowType;
	const apache_arrow_1$4 = __require("apache-arrow");
	/**
	* Map a JS TypedArray instance to the corresponding Arrow element type and
	* length. Returns undefined when the view is not a supported TypedArray.
	*/
	function typedArrayToArrowType(value) {
		if (value instanceof Float32Array) return {
			elementType: new apache_arrow_1$4.Float32(),
			length: value.length
		};
		if (value instanceof Float64Array) return {
			elementType: new apache_arrow_1$4.Float64(),
			length: value.length
		};
		if (value instanceof Uint8Array) return {
			elementType: new apache_arrow_1$4.Uint8(),
			length: value.length
		};
		if (value instanceof Uint16Array) return {
			elementType: new apache_arrow_1$4.Uint16(),
			length: value.length
		};
		if (value instanceof Uint32Array) return {
			elementType: new apache_arrow_1$4.Uint32(),
			length: value.length
		};
		if (value instanceof Int8Array) return {
			elementType: new apache_arrow_1$4.Int8(),
			length: value.length
		};
		if (value instanceof Int16Array) return {
			elementType: new apache_arrow_1$4.Int16(),
			length: value.length
		};
		if (value instanceof Int32Array) return {
			elementType: new apache_arrow_1$4.Int32(),
			length: value.length
		};
	}
}));
//#endregion
//#region node_modules/.pnpm/reflect-metadata@0.2.2/node_modules/reflect-metadata/Reflect.js
var require_Reflect = /* @__PURE__ */ __commonJSMin((() => {
	/*! *****************************************************************************
	Copyright (C) Microsoft. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0
	
	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.
	
	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
	var Reflect;
	(function(Reflect) {
		(function(factory) {
			var root = typeof globalThis === "object" ? globalThis : typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : sloppyModeThis();
			var exporter = makeExporter(Reflect);
			if (typeof root.Reflect !== "undefined") exporter = makeExporter(root.Reflect, exporter);
			factory(exporter, root);
			if (typeof root.Reflect === "undefined") root.Reflect = Reflect;
			function makeExporter(target, previous) {
				return function(key, value) {
					Object.defineProperty(target, key, {
						configurable: true,
						writable: true,
						value
					});
					if (previous) previous(key, value);
				};
			}
			function functionThis() {
				try {
					return Function("return this;")();
				} catch (_) {}
			}
			function indirectEvalThis() {
				try {
					return (0, eval)("(function() { return this; })()");
				} catch (_) {}
			}
			function sloppyModeThis() {
				return functionThis() || indirectEvalThis();
			}
		})(function(exporter, root) {
			var hasOwn = Object.prototype.hasOwnProperty;
			var supportsSymbol = typeof Symbol === "function";
			var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
			var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
			var supportsCreate = typeof Object.create === "function";
			var supportsProto = { __proto__: [] } instanceof Array;
			var downLevel = !supportsCreate && !supportsProto;
			var HashMap = {
				create: supportsCreate ? function() {
					return MakeDictionary(Object.create(null));
				} : supportsProto ? function() {
					return MakeDictionary({ __proto__: null });
				} : function() {
					return MakeDictionary({});
				},
				has: downLevel ? function(map, key) {
					return hasOwn.call(map, key);
				} : function(map, key) {
					return key in map;
				},
				get: downLevel ? function(map, key) {
					return hasOwn.call(map, key) ? map[key] : void 0;
				} : function(map, key) {
					return map[key];
				}
			};
			var functionPrototype = Object.getPrototypeOf(Function);
			var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
			var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
			var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
			var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : void 0;
			var metadataRegistry = GetOrCreateMetadataRegistry();
			var metadataProvider = CreateMetadataProvider(metadataRegistry);
			/**
			* Applies a set of decorators to a property of a target object.
			* @param decorators An array of decorators.
			* @param target The target object.
			* @param propertyKey (Optional) The property key to decorate.
			* @param attributes (Optional) The property descriptor for the target key.
			* @remarks Decorators are applied in reverse order.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Example = Reflect.decorate(decoratorsArray, Example);
			*
			*     // property (on constructor)
			*     Reflect.decorate(decoratorsArray, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.decorate(decoratorsArray, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Object.defineProperty(Example, "staticMethod",
			*         Reflect.decorate(decoratorsArray, Example, "staticMethod",
			*             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
			*
			*     // method (on prototype)
			*     Object.defineProperty(Example.prototype, "method",
			*         Reflect.decorate(decoratorsArray, Example.prototype, "method",
			*             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
			*
			*/
			function decorate(decorators, target, propertyKey, attributes) {
				if (!IsUndefined(propertyKey)) {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsObject(target)) throw new TypeError();
					if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes)) throw new TypeError();
					if (IsNull(attributes)) attributes = void 0;
					propertyKey = ToPropertyKey(propertyKey);
					return DecorateProperty(decorators, target, propertyKey, attributes);
				} else {
					if (!IsArray(decorators)) throw new TypeError();
					if (!IsConstructor(target)) throw new TypeError();
					return DecorateConstructor(decorators, target);
				}
			}
			exporter("decorate", decorate);
			/**
			* A default metadata decorator factory that can be used on a class, class member, or parameter.
			* @param metadataKey The key for the metadata entry.
			* @param metadataValue The value for the metadata entry.
			* @returns A decorator function.
			* @remarks
			* If `metadataKey` is already defined for the target and target key, the
			* metadataValue for that key will be overwritten.
			* @example
			*
			*     // constructor
			*     @Reflect.metadata(key, value)
			*     class Example {
			*     }
			*
			*     // property (on constructor, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticProperty;
			*     }
			*
			*     // property (on prototype, TypeScript only)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         property;
			*     }
			*
			*     // method (on constructor)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         static staticMethod() { }
			*     }
			*
			*     // method (on prototype)
			*     class Example {
			*         @Reflect.metadata(key, value)
			*         method() { }
			*     }
			*
			*/
			function metadata(metadataKey, metadataValue) {
				function decorator(target, propertyKey) {
					if (!IsObject(target)) throw new TypeError();
					if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey)) throw new TypeError();
					OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
				}
				return decorator;
			}
			exporter("metadata", metadata);
			/**
			* Define a unique metadata entry on the target.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param metadataValue A value that contains attached metadata.
			* @param target The target object on which to define metadata.
			* @param propertyKey (Optional) The property key for the target.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     Reflect.defineMetadata("custom:annotation", options, Example);
			*
			*     // property (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
			*
			*     // property (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
			*
			*     // method (on constructor)
			*     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
			*
			*     // method (on prototype)
			*     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
			*
			*     // decorator factory as metadata-producing annotation.
			*     function MyAnnotation(options): Decorator {
			*         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
			*     }
			*
			*/
			function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
			}
			exporter("defineMetadata", defineMetadata);
			/**
			* Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasMetadata", hasMetadata);
			/**
			* Gets a value indicating whether the target object has the provided metadata key defined.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function hasOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("hasOwnMetadata", hasOwnMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object or its prototype chain.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetMetadata(metadataKey, target, propertyKey);
			}
			exporter("getMetadata", getMetadata);
			/**
			* Gets the metadata value for the provided metadata key on the target object.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns The metadata value for the metadata key if found; otherwise, `undefined`.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function getOwnMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
			}
			exporter("getOwnMetadata", getOwnMetadata);
			/**
			* Gets the metadata keys defined on the target object or its prototype chain.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getMetadataKeys(Example.prototype, "method");
			*
			*/
			function getMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryMetadataKeys(target, propertyKey);
			}
			exporter("getMetadataKeys", getMetadataKeys);
			/**
			* Gets the unique metadata keys defined on the target object.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns An array of unique metadata keys.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.getOwnMetadataKeys(Example);
			*
			*     // property (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
			*
			*/
			function getOwnMetadataKeys(target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				return OrdinaryOwnMetadataKeys(target, propertyKey);
			}
			exporter("getOwnMetadataKeys", getOwnMetadataKeys);
			/**
			* Deletes the metadata entry from the target object with the provided key.
			* @param metadataKey A key used to store and retrieve metadata.
			* @param target The target object on which the metadata is defined.
			* @param propertyKey (Optional) The property key for the target.
			* @returns `true` if the metadata entry was found and deleted; otherwise, false.
			* @example
			*
			*     class Example {
			*         // property declarations are not part of ES6, though they are valid in TypeScript:
			*         // static staticProperty;
			*         // property;
			*
			*         constructor(p) { }
			*         static staticMethod(p) { }
			*         method(p) { }
			*     }
			*
			*     // constructor
			*     result = Reflect.deleteMetadata("custom:annotation", Example);
			*
			*     // property (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
			*
			*     // property (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
			*
			*     // method (on constructor)
			*     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
			*
			*     // method (on prototype)
			*     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
			*
			*/
			function deleteMetadata(metadataKey, target, propertyKey) {
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				if (!IsObject(target)) throw new TypeError();
				if (!IsUndefined(propertyKey)) propertyKey = ToPropertyKey(propertyKey);
				var provider = GetMetadataProvider(target, propertyKey, false);
				if (IsUndefined(provider)) return false;
				return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
			}
			exporter("deleteMetadata", deleteMetadata);
			function DecorateConstructor(decorators, target) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsConstructor(decorated)) throw new TypeError();
						target = decorated;
					}
				}
				return target;
			}
			function DecorateProperty(decorators, target, propertyKey, descriptor) {
				for (var i = decorators.length - 1; i >= 0; --i) {
					var decorator = decorators[i];
					var decorated = decorator(target, propertyKey, descriptor);
					if (!IsUndefined(decorated) && !IsNull(decorated)) {
						if (!IsObject(decorated)) throw new TypeError();
						descriptor = decorated;
					}
				}
				return descriptor;
			}
			function OrdinaryHasMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return true;
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryHasMetadata(MetadataKey, parent, P);
				return false;
			}
			function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return false;
				return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
			}
			function OrdinaryGetMetadata(MetadataKey, O, P) {
				if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) return OrdinaryGetOwnMetadata(MetadataKey, O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (!IsNull(parent)) return OrdinaryGetMetadata(MetadataKey, parent, P);
			}
			function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (IsUndefined(provider)) return;
				return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
			}
			function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
				GetMetadataProvider(O, P, true).OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
			}
			function OrdinaryMetadataKeys(O, P) {
				var ownKeys = OrdinaryOwnMetadataKeys(O, P);
				var parent = OrdinaryGetPrototypeOf(O);
				if (parent === null) return ownKeys;
				var parentKeys = OrdinaryMetadataKeys(parent, P);
				if (parentKeys.length <= 0) return ownKeys;
				if (ownKeys.length <= 0) return parentKeys;
				var set = new _Set();
				var keys = [];
				for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
					var key = ownKeys_1[_i];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
					var key = parentKeys_1[_a];
					var hasKey = set.has(key);
					if (!hasKey) {
						set.add(key);
						keys.push(key);
					}
				}
				return keys;
			}
			function OrdinaryOwnMetadataKeys(O, P) {
				var provider = GetMetadataProvider(O, P, false);
				if (!provider) return [];
				return provider.OrdinaryOwnMetadataKeys(O, P);
			}
			function Type(x) {
				if (x === null) return 1;
				switch (typeof x) {
					case "undefined": return 0;
					case "boolean": return 2;
					case "string": return 3;
					case "symbol": return 4;
					case "number": return 5;
					case "object": return x === null ? 1 : 6;
					default: return 6;
				}
			}
			function IsUndefined(x) {
				return x === void 0;
			}
			function IsNull(x) {
				return x === null;
			}
			function IsSymbol(x) {
				return typeof x === "symbol";
			}
			function IsObject(x) {
				return typeof x === "object" ? x !== null : typeof x === "function";
			}
			function ToPrimitive(input, PreferredType) {
				switch (Type(input)) {
					case 0: return input;
					case 1: return input;
					case 2: return input;
					case 3: return input;
					case 4: return input;
					case 5: return input;
				}
				var hint = PreferredType === 3 ? "string" : PreferredType === 5 ? "number" : "default";
				var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
				if (exoticToPrim !== void 0) {
					var result = exoticToPrim.call(input, hint);
					if (IsObject(result)) throw new TypeError();
					return result;
				}
				return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
			}
			function OrdinaryToPrimitive(O, hint) {
				if (hint === "string") {
					var toString_1 = O.toString;
					if (IsCallable(toString_1)) {
						var result = toString_1.call(O);
						if (!IsObject(result)) return result;
					}
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
				} else {
					var valueOf = O.valueOf;
					if (IsCallable(valueOf)) {
						var result = valueOf.call(O);
						if (!IsObject(result)) return result;
					}
					var toString_2 = O.toString;
					if (IsCallable(toString_2)) {
						var result = toString_2.call(O);
						if (!IsObject(result)) return result;
					}
				}
				throw new TypeError();
			}
			function ToBoolean(argument) {
				return !!argument;
			}
			function ToString(argument) {
				return "" + argument;
			}
			function ToPropertyKey(argument) {
				var key = ToPrimitive(argument, 3);
				if (IsSymbol(key)) return key;
				return ToString(key);
			}
			function IsArray(argument) {
				return Array.isArray ? Array.isArray(argument) : argument instanceof Object ? argument instanceof Array : Object.prototype.toString.call(argument) === "[object Array]";
			}
			function IsCallable(argument) {
				return typeof argument === "function";
			}
			function IsConstructor(argument) {
				return typeof argument === "function";
			}
			function IsPropertyKey(argument) {
				switch (Type(argument)) {
					case 3: return true;
					case 4: return true;
					default: return false;
				}
			}
			function SameValueZero(x, y) {
				return x === y || x !== x && y !== y;
			}
			function GetMethod(V, P) {
				var func = V[P];
				if (func === void 0 || func === null) return void 0;
				if (!IsCallable(func)) throw new TypeError();
				return func;
			}
			function GetIterator(obj) {
				var method = GetMethod(obj, iteratorSymbol);
				if (!IsCallable(method)) throw new TypeError();
				var iterator = method.call(obj);
				if (!IsObject(iterator)) throw new TypeError();
				return iterator;
			}
			function IteratorValue(iterResult) {
				return iterResult.value;
			}
			function IteratorStep(iterator) {
				var result = iterator.next();
				return result.done ? false : result;
			}
			function IteratorClose(iterator) {
				var f = iterator["return"];
				if (f) f.call(iterator);
			}
			function OrdinaryGetPrototypeOf(O) {
				var proto = Object.getPrototypeOf(O);
				if (typeof O !== "function" || O === functionPrototype) return proto;
				if (proto !== functionPrototype) return proto;
				var prototype = O.prototype;
				var prototypeProto = prototype && Object.getPrototypeOf(prototype);
				if (prototypeProto == null || prototypeProto === Object.prototype) return proto;
				var constructor = prototypeProto.constructor;
				if (typeof constructor !== "function") return proto;
				if (constructor === O) return proto;
				return constructor;
			}
			/**
			* Creates a registry used to allow multiple `reflect-metadata` providers.
			*/
			function CreateMetadataRegistry() {
				var fallback;
				if (!IsUndefined(registrySymbol) && typeof root.Reflect !== "undefined" && !(registrySymbol in root.Reflect) && typeof root.Reflect.defineMetadata === "function") fallback = CreateFallbackProvider(root.Reflect);
				var first;
				var second;
				var rest;
				var targetProviderMap = new _WeakMap();
				var registry = {
					registerProvider,
					getProvider,
					setProvider
				};
				return registry;
				function registerProvider(provider) {
					if (!Object.isExtensible(registry)) throw new Error("Cannot add provider to a frozen registry.");
					switch (true) {
						case fallback === provider: break;
						case IsUndefined(first):
							first = provider;
							break;
						case first === provider: break;
						case IsUndefined(second):
							second = provider;
							break;
						case second === provider: break;
						default:
							if (rest === void 0) rest = new _Set();
							rest.add(provider);
					}
				}
				function getProviderNoCache(O, P) {
					if (!IsUndefined(first)) {
						if (first.isProviderFor(O, P)) return first;
						if (!IsUndefined(second)) {
							if (second.isProviderFor(O, P)) return first;
							if (!IsUndefined(rest)) {
								var iterator = GetIterator(rest);
								while (true) {
									var next = IteratorStep(iterator);
									if (!next) return;
									var provider = IteratorValue(next);
									if (provider.isProviderFor(O, P)) {
										IteratorClose(iterator);
										return provider;
									}
								}
							}
						}
					}
					if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) return fallback;
				}
				function getProvider(O, P) {
					var providerMap = targetProviderMap.get(O);
					var provider;
					if (!IsUndefined(providerMap)) provider = providerMap.get(P);
					if (!IsUndefined(provider)) return provider;
					provider = getProviderNoCache(O, P);
					if (!IsUndefined(provider)) {
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return provider;
				}
				function hasProvider(provider) {
					if (IsUndefined(provider)) throw new TypeError();
					return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
				}
				function setProvider(O, P, provider) {
					if (!hasProvider(provider)) throw new Error("Metadata provider not registered.");
					var existingProvider = getProvider(O, P);
					if (existingProvider !== provider) {
						if (!IsUndefined(existingProvider)) return false;
						var providerMap = targetProviderMap.get(O);
						if (IsUndefined(providerMap)) {
							providerMap = new _Map();
							targetProviderMap.set(O, providerMap);
						}
						providerMap.set(P, provider);
					}
					return true;
				}
			}
			/**
			* Gets or creates the shared registry of metadata providers.
			*/
			function GetOrCreateMetadataRegistry() {
				var metadataRegistry;
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) metadataRegistry = root.Reflect[registrySymbol];
				if (IsUndefined(metadataRegistry)) metadataRegistry = CreateMetadataRegistry();
				if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) Object.defineProperty(root.Reflect, registrySymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: metadataRegistry
				});
				return metadataRegistry;
			}
			function CreateMetadataProvider(registry) {
				var metadata = new _WeakMap();
				var provider = {
					isProviderFor: function(O, P) {
						var targetMetadata = metadata.get(O);
						if (IsUndefined(targetMetadata)) return false;
						return targetMetadata.has(P);
					},
					OrdinaryDefineOwnMetadata,
					OrdinaryHasOwnMetadata,
					OrdinaryGetOwnMetadata,
					OrdinaryOwnMetadataKeys,
					OrdinaryDeleteMetadata
				};
				metadataRegistry.registerProvider(provider);
				return provider;
				function GetOrCreateMetadataMap(O, P, Create) {
					var targetMetadata = metadata.get(O);
					var createdTargetMetadata = false;
					if (IsUndefined(targetMetadata)) {
						if (!Create) return void 0;
						targetMetadata = new _Map();
						metadata.set(O, targetMetadata);
						createdTargetMetadata = true;
					}
					var metadataMap = targetMetadata.get(P);
					if (IsUndefined(metadataMap)) {
						if (!Create) return void 0;
						metadataMap = new _Map();
						targetMetadata.set(P, metadataMap);
						if (!registry.setProvider(O, P, provider)) {
							targetMetadata.delete(P);
							if (createdTargetMetadata) metadata.delete(O);
							throw new Error("Wrong provider for target.");
						}
					}
					return metadataMap;
				}
				function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					return ToBoolean(metadataMap.has(MetadataKey));
				}
				function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return void 0;
					return metadataMap.get(MetadataKey);
				}
				function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
					GetOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
				}
				function OrdinaryOwnMetadataKeys(O, P) {
					var keys = [];
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return keys;
					var iterator = GetIterator(metadataMap.keys());
					var k = 0;
					while (true) {
						var next = IteratorStep(iterator);
						if (!next) {
							keys.length = k;
							return keys;
						}
						var nextValue = IteratorValue(next);
						try {
							keys[k] = nextValue;
						} catch (e) {
							try {
								IteratorClose(iterator);
							} finally {
								throw e;
							}
						}
						k++;
					}
				}
				function OrdinaryDeleteMetadata(MetadataKey, O, P) {
					var metadataMap = GetOrCreateMetadataMap(O, P, false);
					if (IsUndefined(metadataMap)) return false;
					if (!metadataMap.delete(MetadataKey)) return false;
					if (metadataMap.size === 0) {
						var targetMetadata = metadata.get(O);
						if (!IsUndefined(targetMetadata)) {
							targetMetadata.delete(P);
							if (targetMetadata.size === 0) metadata.delete(targetMetadata);
						}
					}
					return true;
				}
			}
			function CreateFallbackProvider(reflect) {
				var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
				var metadataOwner = new _WeakMap();
				return {
					isProviderFor: function(O, P) {
						var metadataPropertySet = metadataOwner.get(O);
						if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) return true;
						if (getOwnMetadataKeys(O, P).length) {
							if (IsUndefined(metadataPropertySet)) {
								metadataPropertySet = new _Set();
								metadataOwner.set(O, metadataPropertySet);
							}
							metadataPropertySet.add(P);
							return true;
						}
						return false;
					},
					OrdinaryDefineOwnMetadata: defineMetadata,
					OrdinaryHasOwnMetadata: hasOwnMetadata,
					OrdinaryGetOwnMetadata: getOwnMetadata,
					OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
					OrdinaryDeleteMetadata: deleteMetadata
				};
			}
			/**
			* Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
			* then this module's metadata provider is assigned to the object.
			*/
			function GetMetadataProvider(O, P, Create) {
				var registeredProvider = metadataRegistry.getProvider(O, P);
				if (!IsUndefined(registeredProvider)) return registeredProvider;
				if (Create) {
					if (metadataRegistry.setProvider(O, P, metadataProvider)) return metadataProvider;
					throw new Error("Illegal state.");
				}
			}
			function CreateMapPolyfill() {
				var cacheSentinel = {};
				var arraySentinel = [];
				var MapIterator = function() {
					function MapIterator(keys, values, selector) {
						this._index = 0;
						this._keys = keys;
						this._values = values;
						this._selector = selector;
					}
					MapIterator.prototype["@@iterator"] = function() {
						return this;
					};
					MapIterator.prototype[iteratorSymbol] = function() {
						return this;
					};
					MapIterator.prototype.next = function() {
						var index = this._index;
						if (index >= 0 && index < this._keys.length) {
							var result = this._selector(this._keys[index], this._values[index]);
							if (index + 1 >= this._keys.length) {
								this._index = -1;
								this._keys = arraySentinel;
								this._values = arraySentinel;
							} else this._index++;
							return {
								value: result,
								done: false
							};
						}
						return {
							value: void 0,
							done: true
						};
					};
					MapIterator.prototype.throw = function(error) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						throw error;
					};
					MapIterator.prototype.return = function(value) {
						if (this._index >= 0) {
							this._index = -1;
							this._keys = arraySentinel;
							this._values = arraySentinel;
						}
						return {
							value,
							done: true
						};
					};
					return MapIterator;
				}();
				return function() {
					function Map() {
						this._keys = [];
						this._values = [];
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					}
					Object.defineProperty(Map.prototype, "size", {
						get: function() {
							return this._keys.length;
						},
						enumerable: true,
						configurable: true
					});
					Map.prototype.has = function(key) {
						return this._find(key, false) >= 0;
					};
					Map.prototype.get = function(key) {
						var index = this._find(key, false);
						return index >= 0 ? this._values[index] : void 0;
					};
					Map.prototype.set = function(key, value) {
						var index = this._find(key, true);
						this._values[index] = value;
						return this;
					};
					Map.prototype.delete = function(key) {
						var index = this._find(key, false);
						if (index >= 0) {
							var size = this._keys.length;
							for (var i = index + 1; i < size; i++) {
								this._keys[i - 1] = this._keys[i];
								this._values[i - 1] = this._values[i];
							}
							this._keys.length--;
							this._values.length--;
							if (SameValueZero(key, this._cacheKey)) {
								this._cacheKey = cacheSentinel;
								this._cacheIndex = -2;
							}
							return true;
						}
						return false;
					};
					Map.prototype.clear = function() {
						this._keys.length = 0;
						this._values.length = 0;
						this._cacheKey = cacheSentinel;
						this._cacheIndex = -2;
					};
					Map.prototype.keys = function() {
						return new MapIterator(this._keys, this._values, getKey);
					};
					Map.prototype.values = function() {
						return new MapIterator(this._keys, this._values, getValue);
					};
					Map.prototype.entries = function() {
						return new MapIterator(this._keys, this._values, getEntry);
					};
					Map.prototype["@@iterator"] = function() {
						return this.entries();
					};
					Map.prototype[iteratorSymbol] = function() {
						return this.entries();
					};
					Map.prototype._find = function(key, insert) {
						if (!SameValueZero(this._cacheKey, key)) {
							this._cacheIndex = -1;
							for (var i = 0; i < this._keys.length; i++) if (SameValueZero(this._keys[i], key)) {
								this._cacheIndex = i;
								break;
							}
						}
						if (this._cacheIndex < 0 && insert) {
							this._cacheIndex = this._keys.length;
							this._keys.push(key);
							this._values.push(void 0);
						}
						return this._cacheIndex;
					};
					return Map;
				}();
				function getKey(key, _) {
					return key;
				}
				function getValue(_, value) {
					return value;
				}
				function getEntry(key, value) {
					return [key, value];
				}
			}
			function CreateSetPolyfill() {
				return function() {
					function Set() {
						this._map = new _Map();
					}
					Object.defineProperty(Set.prototype, "size", {
						get: function() {
							return this._map.size;
						},
						enumerable: true,
						configurable: true
					});
					Set.prototype.has = function(value) {
						return this._map.has(value);
					};
					Set.prototype.add = function(value) {
						return this._map.set(value, value), this;
					};
					Set.prototype.delete = function(value) {
						return this._map.delete(value);
					};
					Set.prototype.clear = function() {
						this._map.clear();
					};
					Set.prototype.keys = function() {
						return this._map.keys();
					};
					Set.prototype.values = function() {
						return this._map.keys();
					};
					Set.prototype.entries = function() {
						return this._map.entries();
					};
					Set.prototype["@@iterator"] = function() {
						return this.keys();
					};
					Set.prototype[iteratorSymbol] = function() {
						return this.keys();
					};
					return Set;
				}();
			}
			function CreateWeakMapPolyfill() {
				var UUID_SIZE = 16;
				var keys = HashMap.create();
				var rootKey = CreateUniqueKey();
				return function() {
					function WeakMap() {
						this._key = CreateUniqueKey();
					}
					WeakMap.prototype.has = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.has(table, this._key) : false;
					};
					WeakMap.prototype.get = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? HashMap.get(table, this._key) : void 0;
					};
					WeakMap.prototype.set = function(target, value) {
						var table = GetOrCreateWeakMapTable(target, true);
						table[this._key] = value;
						return this;
					};
					WeakMap.prototype.delete = function(target) {
						var table = GetOrCreateWeakMapTable(target, false);
						return table !== void 0 ? delete table[this._key] : false;
					};
					WeakMap.prototype.clear = function() {
						this._key = CreateUniqueKey();
					};
					return WeakMap;
				}();
				function CreateUniqueKey() {
					var key;
					do
						key = "@@WeakMap@@" + CreateUUID();
					while (HashMap.has(keys, key));
					keys[key] = true;
					return key;
				}
				function GetOrCreateWeakMapTable(target, create) {
					if (!hasOwn.call(target, rootKey)) {
						if (!create) return void 0;
						Object.defineProperty(target, rootKey, { value: HashMap.create() });
					}
					return target[rootKey];
				}
				function FillRandomBytes(buffer, size) {
					for (var i = 0; i < size; ++i) buffer[i] = Math.random() * 255 | 0;
					return buffer;
				}
				function GenRandomBytes(size) {
					if (typeof Uint8Array === "function") {
						var array = new Uint8Array(size);
						if (typeof crypto !== "undefined") crypto.getRandomValues(array);
						else if (typeof msCrypto !== "undefined") msCrypto.getRandomValues(array);
						else FillRandomBytes(array, size);
						return array;
					}
					return FillRandomBytes(new Array(size), size);
				}
				function CreateUUID() {
					var data = GenRandomBytes(UUID_SIZE);
					data[6] = data[6] & 79 | 64;
					data[8] = data[8] & 191 | 128;
					var result = "";
					for (var offset = 0; offset < UUID_SIZE; ++offset) {
						var byte = data[offset];
						if (offset === 4 || offset === 6 || offset === 8) result += "-";
						if (byte < 16) result += "0";
						result += byte.toString(16).toLowerCase();
					}
					return result;
				}
			}
			function MakeDictionary(obj) {
				obj.__ = void 0;
				delete obj.__;
				return obj;
			}
		});
	})(Reflect || (Reflect = {}));
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/embedding/registry.js
var require_registry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmbeddingFunctionRegistry = void 0;
	exports.register = register;
	exports.registerBuiltIn = registerBuiltIn;
	exports.getRegistry = getRegistry;
	exports.parseEmbeddingMetadata = parseEmbeddingMetadata;
	require_Reflect();
	const builtInFunctionsKey = Symbol.for("@lancedb/lancedb::embedding-built-in-functions::v1");
	/**
	* This is a singleton class used to register embedding functions
	* and fetch them by name. It also handles serializing and deserializing.
	* You can implement your own embedding function by subclassing EmbeddingFunction
	* or TextEmbeddingFunction and registering it with the registry
	*/
	var EmbeddingFunctionRegistry = class {
		#functions = /* @__PURE__ */ new Map();
		#variables = /* @__PURE__ */ new Map();
		/**
		* Get the number of registered functions
		*/
		length() {
			return this.#functions.size;
		}
		/**
		* Register an embedding function
		* @throws Error if the function is already registered
		*/
		register(alias) {
			const self = this;
			return function(ctor) {
				if (!alias) alias = ctor.name;
				if (self.#functions.has(alias)) throw new Error(`Embedding function with alias "${alias}" already exists`);
				self.#functions.set(alias, ctor);
				Reflect.defineMetadata("lancedb::embedding::name", alias, ctor);
				return ctor;
			};
		}
		/** @ignore */
		setBuiltIn(name, ctor) {
			this.#functions.set(name, ctor);
			Reflect.defineMetadata("lancedb::embedding::name", name, ctor);
			return ctor;
		}
		/**
		* Fetch an embedding function by name
		* @param name The name of the function
		*/
		get(name) {
			const factory = this.#functions.get(name);
			if (!factory) return;
			let create;
			if (factory.prototype.init) create = async function(options) {
				const instance = new factory(options);
				await instance.init();
				return instance;
			};
			else create = (options) => new factory(options);
			return { create };
		}
		/**
		* reset the registry to the initial state
		*/
		reset() {
			this.#functions.clear();
			getBuiltInFunctions(this).clear();
		}
		/**
		* @ignore
		*/
		async parseFunctions(metadata) {
			if (!metadata.has("embedding_functions")) return /* @__PURE__ */ new Map();
			const entries = parseEmbeddingMetadata(metadata.get("embedding_functions"));
			const items = await Promise.all(entries.map(async (f) => {
				const fn = this.get(f.name);
				if (!fn) throw new Error(`Function "${f.name}" not found in registry`);
				const func = await fn.create(f.model);
				return {
					sourceColumn: f.sourceColumn,
					vectorColumn: f.vectorColumn,
					function: func
				};
			}));
			return new Map(items.map((config) => [config.vectorColumn, config]));
		}
		functionToMetadata(conf) {
			const metadata = {};
			const name = Reflect.getMetadata("lancedb::embedding::name", conf.function.constructor);
			metadata["sourceColumn"] = conf.sourceColumn;
			metadata["vectorColumn"] = conf.vectorColumn ?? "vector";
			metadata["name"] = name ?? conf.function.constructor.name;
			metadata["model"] = conf.function.toJSON();
			return metadata;
		}
		getTableMetadata(functions) {
			const metadata = /* @__PURE__ */ new Map();
			const jsonData = functions.map((conf) => this.functionToMetadata(conf));
			metadata.set("embedding_functions", JSON.stringify(jsonData));
			return metadata;
		}
		/**
		* Set a variable. These can be accessed in the embedding function
		* configuration using the syntax `$var:variable_name`. If they are not
		* set, an error will be thrown letting you know which key is unset. If you
		* want to supply a default value, you can add an additional part in the
		* configuration like so: `$var:variable_name:default_value`. Default values
		* can be used for runtime configurations that are not sensitive, such as
		* whether to use a GPU for inference.
		*
		* The name must not contain colons. The default value can contain colons.
		*
		* @param name
		* @param value
		*/
		setVar(name, value) {
			if (name.includes(":")) throw new Error("Variable names cannot contain colons");
			this.#variables.set(name, value);
		}
		/**
		* Get a variable.
		* @param name
		* @returns
		* @see {@link setVar}
		*/
		getVar(name) {
			return this.#variables.get(name);
		}
	};
	exports.EmbeddingFunctionRegistry = EmbeddingFunctionRegistry;
	function getBuiltInFunctions(registry) {
		const registryWithBuiltIns = registry;
		let builtInFunctions = registryWithBuiltIns[builtInFunctionsKey];
		if (builtInFunctions === void 0) {
			builtInFunctions = /* @__PURE__ */ new Set();
			registryWithBuiltIns[builtInFunctionsKey] = builtInFunctions;
		}
		return builtInFunctions;
	}
	const registryKey = Symbol.for("@lancedb/lancedb::embedding-function-registry::v1");
	const registryGlobal = globalThis;
	function getGlobalRegistry() {
		const existingRegistry = registryGlobal[registryKey];
		if (existingRegistry !== void 0) return existingRegistry;
		const registry = new EmbeddingFunctionRegistry();
		registryGlobal[registryKey] = registry;
		return registry;
	}
	const _REGISTRY = getGlobalRegistry();
	function register(name) {
		return _REGISTRY.register(name);
	}
	/** @ignore */
	function registerBuiltIn(name, ctor) {
		const builtInFunctions = getBuiltInFunctions(_REGISTRY);
		if (builtInFunctions.has(name)) return _REGISTRY.setBuiltIn(name, ctor);
		_REGISTRY.register(name)(ctor);
		builtInFunctions.add(name);
		return ctor;
	}
	/**
	* Utility function to get the global instance of the registry
	* @returns `EmbeddingFunctionRegistry` The global instance of the registry
	* @example
	* ```ts
	* const registry = getRegistry();
	* const openai = registry.get("openai").create();
	*/
	function getRegistry() {
		return _REGISTRY;
	}
	/** The single parser for `embedding_functions` schema metadata: every reader
	* goes through here, so the wire contract cannot fork between them. */
	function parseEmbeddingMetadata(json) {
		const entries = JSON.parse(json);
		const seen = /* @__PURE__ */ new Set();
		return entries.map((f) => {
			const sourceColumn = f.sourceColumn ?? f.source_column;
			const vectorColumn = f.vectorColumn ?? f.vector_column;
			if (sourceColumn === void 0 || vectorColumn === void 0) throw new Error(`Embedding function "${f.name}" metadata names no source or vector column`);
			if (seen.has(vectorColumn)) throw new Error(`Multiple embedding configs claim vector column "${vectorColumn}"`);
			seen.add(vectorColumn);
			return {
				name: f.name,
				sourceColumn,
				vectorColumn,
				model: f.model
			};
		});
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/sanitize.js
var require_sanitize = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sanitizeMetadata = sanitizeMetadata;
	exports.sanitizeInt = sanitizeInt;
	exports.sanitizeFloat = sanitizeFloat;
	exports.sanitizeDecimal = sanitizeDecimal;
	exports.sanitizeDate = sanitizeDate;
	exports.sanitizeTime = sanitizeTime;
	exports.sanitizeTimestamp = sanitizeTimestamp;
	exports.sanitizeTypedTimestamp = sanitizeTypedTimestamp;
	exports.sanitizeInterval = sanitizeInterval;
	exports.sanitizeList = sanitizeList;
	exports.sanitizeStruct = sanitizeStruct;
	exports.sanitizeUnion = sanitizeUnion;
	exports.sanitizeTypedUnion = sanitizeTypedUnion;
	exports.sanitizeFixedSizeBinary = sanitizeFixedSizeBinary;
	exports.sanitizeFixedSizeList = sanitizeFixedSizeList;
	exports.sanitizeMap = sanitizeMap;
	exports.sanitizeDuration = sanitizeDuration;
	exports.sanitizeDictionary = sanitizeDictionary;
	exports.sanitizeType = sanitizeType;
	exports.sanitizeField = sanitizeField;
	exports.sanitizeSchema = sanitizeSchema;
	exports.sanitizeTable = sanitizeTable;
	exports.dataTypeFromName = dataTypeFromName;
	const apache_arrow_1$3 = __require("apache-arrow");
	const arrow_1 = require_arrow();
	function createSanitizationContext() {
		return {
			types: /* @__PURE__ */ new WeakMap(),
			vectors: /* @__PURE__ */ new WeakMap(),
			data: /* @__PURE__ */ new WeakMap()
		};
	}
	function sanitizeMetadata(metadataLike) {
		if (metadataLike === void 0 || metadataLike === null) return;
		let entries;
		try {
			entries = Map.prototype.entries.call(metadataLike);
		} catch {
			throw Error("Expected metadata, if present, to be a Map<string, string>");
		}
		const metadata = /* @__PURE__ */ new Map();
		for (const [key, value] of entries) {
			if (typeof key !== "string" || typeof value !== "string") throw Error("Expected metadata, if present, to be a Map<string, string> but it had non-string keys or values");
			metadata.set(key, value);
		}
		return metadata;
	}
	function sanitizeInt(typeLike) {
		if (!("bitWidth" in typeLike) || typeof typeLike.bitWidth !== "number" || !("isSigned" in typeLike) || typeof typeLike.isSigned !== "boolean") throw Error("Expected an Int Type to have a `bitWidth` and `isSigned` property");
		return new arrow_1.Int(typeLike.isSigned, typeLike.bitWidth);
	}
	function sanitizeFloat(typeLike) {
		if (!("precision" in typeLike) || typeof typeLike.precision !== "number") throw Error("Expected a Float Type to have a `precision` property");
		return new arrow_1.Float(typeLike.precision);
	}
	function sanitizeDecimal(typeLike) {
		if (!("scale" in typeLike) || typeof typeLike.scale !== "number" || !("precision" in typeLike) || typeof typeLike.precision !== "number" || !("bitWidth" in typeLike) || typeof typeLike.bitWidth !== "number") throw Error("Expected a Decimal Type to have `scale`, `precision`, and `bitWidth` properties");
		return new arrow_1.Decimal(typeLike.scale, typeLike.precision, typeLike.bitWidth);
	}
	function sanitizeDate(typeLike) {
		if (!("unit" in typeLike) || typeof typeLike.unit !== "number") throw Error("Expected a Date type to have a `unit` property");
		return new arrow_1.Date_(typeLike.unit);
	}
	function sanitizeTime(typeLike) {
		if (!("unit" in typeLike) || typeof typeLike.unit !== "number" || !("bitWidth" in typeLike) || typeof typeLike.bitWidth !== "number") throw Error("Expected a Time type to have `unit` and `bitWidth` properties");
		return new arrow_1.Time(typeLike.unit, typeLike.bitWidth);
	}
	function sanitizeTimestamp(typeLike) {
		if (!("unit" in typeLike) || typeof typeLike.unit !== "number") throw Error("Expected a Timestamp type to have a `unit` property");
		let timezone = null;
		if ("timezone" in typeLike && typeof typeLike.timezone === "string") timezone = typeLike.timezone;
		return new arrow_1.Timestamp(typeLike.unit, timezone);
	}
	function sanitizeTypedTimestamp(typeLike, Datatype) {
		let timezone = null;
		if ("timezone" in typeLike && typeof typeLike.timezone === "string") timezone = typeLike.timezone;
		return new Datatype(timezone);
	}
	function sanitizeInterval(typeLike) {
		if (!("unit" in typeLike) || typeof typeLike.unit !== "number") throw Error("Expected an Interval type to have a `unit` property");
		return new arrow_1.Interval(typeLike.unit);
	}
	function sanitizeList(typeLike) {
		return sanitizeListWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeListWithContext(typeLike, context) {
		if (!("children" in typeLike) || !Array.isArray(typeLike.children)) throw Error("Expected a List type to have an array-like `children` property");
		if (typeLike.children.length !== 1) throw Error("Expected a List type to have exactly one child");
		return new arrow_1.List(sanitizeFieldWithContext(typeLike.children[0], context));
	}
	function sanitizeStruct(typeLike) {
		return sanitizeStructWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeStructWithContext(typeLike, context) {
		if (!("children" in typeLike) || !Array.isArray(typeLike.children)) throw Error("Expected a Struct type to have an array-like `children` property");
		return new arrow_1.Struct(typeLike.children.map((child) => sanitizeFieldWithContext(child, context)));
	}
	function sanitizeUnion(typeLike) {
		return sanitizeUnionWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeUnionWithContext(typeLike, context) {
		if (!("typeIds" in typeLike) || !("mode" in typeLike) || typeof typeLike.mode !== "number") throw Error("Expected a Union type to have `typeIds` and `mode` properties");
		if (!("children" in typeLike) || !Array.isArray(typeLike.children)) throw Error("Expected a Union type to have an array-like `children` property");
		return new arrow_1.Union(typeLike.mode, typeLike.typeIds, typeLike.children.map((child) => sanitizeFieldWithContext(child, context)));
	}
	function sanitizeTypedUnion(typeLike, UnionType) {
		return sanitizeTypedUnionWithContext(typeLike, UnionType, createSanitizationContext());
	}
	function sanitizeTypedUnionWithContext(typeLike, UnionType, context) {
		if (!("typeIds" in typeLike)) throw Error("Expected a DenseUnion/SparseUnion type to have a `typeIds` property");
		if (!("children" in typeLike) || !Array.isArray(typeLike.children)) throw Error("Expected a DenseUnion/SparseUnion type to have an array-like `children` property");
		return new UnionType(typeLike.typeIds, typeLike.children.map((child) => sanitizeFieldWithContext(child, context)));
	}
	function sanitizeFixedSizeBinary(typeLike) {
		if (!("byteWidth" in typeLike) || typeof typeLike.byteWidth !== "number") throw Error("Expected a FixedSizeBinary type to have a `byteWidth` property");
		return new arrow_1.FixedSizeBinary(typeLike.byteWidth);
	}
	function sanitizeFixedSizeList(typeLike) {
		return sanitizeFixedSizeListWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeFixedSizeListWithContext(typeLike, context) {
		if (!("listSize" in typeLike) || typeof typeLike.listSize !== "number") throw Error("Expected a FixedSizeList type to have a `listSize` property");
		if (!("children" in typeLike) || !Array.isArray(typeLike.children)) throw Error("Expected a FixedSizeList type to have an array-like `children` property");
		if (typeLike.children.length !== 1) throw Error("Expected a FixedSizeList type to have exactly one child");
		return new arrow_1.FixedSizeList(typeLike.listSize, sanitizeFieldWithContext(typeLike.children[0], context));
	}
	function sanitizeMap(typeLike) {
		return sanitizeMapWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeMapWithContext(typeLike, context) {
		if (!("children" in typeLike) || !Array.isArray(typeLike.children)) throw Error("Expected a Map type to have an array-like `children` property");
		if (!("keysSorted" in typeLike) || typeof typeLike.keysSorted !== "boolean") throw Error("Expected a Map type to have a `keysSorted` property");
		if (typeLike.children.length !== 1) throw Error("Expected a Map type to have exactly one child");
		return new arrow_1.Map_(sanitizeFieldWithContext(typeLike.children[0], context), typeLike.keysSorted);
	}
	function sanitizeDuration(typeLike) {
		if (!("unit" in typeLike) || typeof typeLike.unit !== "number") throw Error("Expected a Duration type to have a `unit` property");
		return new arrow_1.Duration(typeLike.unit);
	}
	function sanitizeDictionary(typeLike) {
		return sanitizeDictionaryWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeDictionaryWithContext(typeLike, context) {
		if (!("id" in typeLike) || typeof typeLike.id !== "number") throw Error("Expected a Dictionary type to have an `id` property");
		if (!("indices" in typeLike) || typeof typeLike.indices !== "object") throw Error("Expected a Dictionary type to have an `indices` property");
		if (!("dictionary" in typeLike) || typeof typeLike.dictionary !== "object") throw Error("Expected a Dictionary type to have an `dictionary` property");
		if (!("isOrdered" in typeLike) || typeof typeLike.isOrdered !== "boolean") throw Error("Expected a Dictionary type to have an `isOrdered` property");
		return new arrow_1.Dictionary(sanitizeTypeWithContext(typeLike.dictionary, context), sanitizeTypeWithContext(typeLike.indices, context), typeLike.id, typeLike.isOrdered);
	}
	function sanitizeType(typeLike) {
		return sanitizeTypeWithContext(typeLike, createSanitizationContext());
	}
	function sanitizeTypeWithContext(typeLike, context) {
		if (typeof typeLike === "string") return dataTypeFromName(typeLike);
		if (typeof typeLike !== "object" || typeLike === null) throw Error("Expected a Type but object was null/undefined");
		const cached = context.types.get(typeLike);
		if (cached !== void 0) return cached;
		if (!("typeId" in typeLike) || !(typeof typeLike.typeId !== "function" || typeof typeLike.typeId !== "number")) throw Error("Expected a Type to have a typeId property");
		let typeId;
		if (typeof typeLike.typeId === "function") typeId = typeLike.typeId();
		else if (typeof typeLike.typeId === "number") typeId = typeLike.typeId;
		else throw Error("Type's typeId property was not a function or number");
		const type = sanitizeTypeById(typeLike, typeId, context);
		context.types.set(typeLike, type);
		return type;
	}
	function sanitizeTypeById(typeLike, typeId, context) {
		switch (typeId) {
			case arrow_1.Type.NONE: throw Error("Received a Type with a typeId of NONE");
			case arrow_1.Type.Null: return new arrow_1.Null();
			case arrow_1.Type.Int: return sanitizeInt(typeLike);
			case arrow_1.Type.Float: return sanitizeFloat(typeLike);
			case arrow_1.Type.Binary: return new arrow_1.Binary();
			case arrow_1.Type.Utf8: return new arrow_1.Utf8();
			case arrow_1.Type.Bool: return new arrow_1.Bool();
			case arrow_1.Type.Decimal: return sanitizeDecimal(typeLike);
			case arrow_1.Type.Date: return sanitizeDate(typeLike);
			case arrow_1.Type.Time: return sanitizeTime(typeLike);
			case arrow_1.Type.Timestamp: return sanitizeTimestamp(typeLike);
			case arrow_1.Type.Interval: return sanitizeInterval(typeLike);
			case arrow_1.Type.List: return sanitizeListWithContext(typeLike, context);
			case arrow_1.Type.Struct: return sanitizeStructWithContext(typeLike, context);
			case arrow_1.Type.Union: return sanitizeUnionWithContext(typeLike, context);
			case arrow_1.Type.FixedSizeBinary: return sanitizeFixedSizeBinary(typeLike);
			case arrow_1.Type.FixedSizeList: return sanitizeFixedSizeListWithContext(typeLike, context);
			case arrow_1.Type.Map: return sanitizeMapWithContext(typeLike, context);
			case arrow_1.Type.Duration: return sanitizeDuration(typeLike);
			case arrow_1.Type.Dictionary: return sanitizeDictionaryWithContext(typeLike, context);
			case arrow_1.Type.Int8: return new arrow_1.Int8();
			case arrow_1.Type.Int16: return new arrow_1.Int16();
			case arrow_1.Type.Int32: return new arrow_1.Int32();
			case arrow_1.Type.Int64: return new arrow_1.Int64();
			case arrow_1.Type.Uint8: return new arrow_1.Uint8();
			case arrow_1.Type.Uint16: return new arrow_1.Uint16();
			case arrow_1.Type.Uint32: return new arrow_1.Uint32();
			case arrow_1.Type.Uint64: return new arrow_1.Uint64();
			case arrow_1.Type.Float16: return new arrow_1.Float16();
			case arrow_1.Type.Float32: return new arrow_1.Float32();
			case arrow_1.Type.Float64: return new arrow_1.Float64();
			case arrow_1.Type.DateMillisecond: return new arrow_1.DateMillisecond();
			case arrow_1.Type.DateDay: return new arrow_1.DateDay();
			case arrow_1.Type.TimeNanosecond: return new arrow_1.TimeNanosecond();
			case arrow_1.Type.TimeMicrosecond: return new arrow_1.TimeMicrosecond();
			case arrow_1.Type.TimeMillisecond: return new arrow_1.TimeMillisecond();
			case arrow_1.Type.TimeSecond: return new arrow_1.TimeSecond();
			case arrow_1.Type.TimestampNanosecond: return sanitizeTypedTimestamp(typeLike, arrow_1.TimestampNanosecond);
			case arrow_1.Type.TimestampMicrosecond: return sanitizeTypedTimestamp(typeLike, arrow_1.TimestampMicrosecond);
			case arrow_1.Type.TimestampMillisecond: return sanitizeTypedTimestamp(typeLike, arrow_1.TimestampMillisecond);
			case arrow_1.Type.TimestampSecond: return sanitizeTypedTimestamp(typeLike, arrow_1.TimestampSecond);
			case arrow_1.Type.DenseUnion: return sanitizeTypedUnionWithContext(typeLike, arrow_1.DenseUnion, context);
			case arrow_1.Type.SparseUnion: return sanitizeTypedUnionWithContext(typeLike, arrow_1.SparseUnion, context);
			case arrow_1.Type.IntervalDayTime: return new arrow_1.IntervalDayTime();
			case arrow_1.Type.IntervalYearMonth: return new arrow_1.IntervalYearMonth();
			case arrow_1.Type.DurationNanosecond: return new arrow_1.DurationNanosecond();
			case arrow_1.Type.DurationMicrosecond: return new arrow_1.DurationMicrosecond();
			case arrow_1.Type.DurationMillisecond: return new arrow_1.DurationMillisecond();
			case arrow_1.Type.DurationSecond: return new arrow_1.DurationSecond();
			default: throw new Error("Unrecognized type id in schema: " + typeId);
		}
	}
	function sanitizeField(fieldLike) {
		return sanitizeFieldWithContext(fieldLike, createSanitizationContext());
	}
	function sanitizeFieldWithContext(fieldLike, context) {
		if (fieldLike instanceof arrow_1.Field) return fieldLike;
		if (typeof fieldLike !== "object" || fieldLike === null) throw Error("Expected a Field but object was null/undefined");
		if (!("type" in fieldLike) || !("name" in fieldLike) || !("nullable" in fieldLike)) throw Error("The field passed in is missing a `type`/`name`/`nullable` property");
		let type;
		try {
			type = sanitizeTypeWithContext(fieldLike.type, context);
		} catch (error) {
			throw Error(`Unable to sanitize type for field: ${fieldLike.name} due to error: ${error}`, { cause: error });
		}
		const name = fieldLike.name;
		if (!(typeof name === "string")) throw Error("The field passed in had a non-string `name` property");
		const nullable = fieldLike.nullable;
		if (!(typeof nullable === "boolean")) throw Error("The field passed in had a non-boolean `nullable` property");
		let metadata;
		if ("metadata" in fieldLike) metadata = sanitizeMetadata(fieldLike.metadata);
		return new arrow_1.Field(name, type, nullable, metadata);
	}
	/**
	* Convert something schemaLike into a Schema instance
	*
	* This method is often needed even when the caller is using a Schema
	* instance because they might be using a different instance of apache-arrow
	* than lancedb is using.
	*/
	function sanitizeSchema(schemaLike) {
		return sanitizeSchemaWithContext(schemaLike, createSanitizationContext());
	}
	function sanitizeSchemaWithContext(schemaLike, context) {
		if (schemaLike instanceof arrow_1.Schema) return schemaLike;
		if (typeof schemaLike !== "object" || schemaLike === null) throw Error("Expected a Schema but object was null/undefined");
		if (!("fields" in schemaLike)) throw Error("The schema passed in does not appear to be a schema (no 'fields' property)");
		let metadata;
		if ("metadata" in schemaLike) metadata = sanitizeMetadata(schemaLike.metadata);
		if (!Array.isArray(schemaLike.fields)) throw Error("The schema passed in had a 'fields' property but it was not an array");
		const sanitizedFields = schemaLike.fields.map((field) => sanitizeFieldWithContext(field, context));
		return new arrow_1.Schema(sanitizedFields, metadata);
	}
	function sanitizeTable(tableLike) {
		if (tableLike instanceof arrow_1.Table) return tableLike;
		if (typeof tableLike !== "object" || tableLike === null) throw Error("Expected a Table but object was null/undefined");
		if (!("schema" in tableLike)) throw Error("The table passed in does not appear to be a table (no 'schema' property)");
		if (!("batches" in tableLike)) throw Error("The table passed in does not appear to be a table (no 'columns' property)");
		const context = createSanitizationContext();
		const schema = sanitizeSchemaWithContext(tableLike.schema, context);
		const batches = tableLike.batches.map((batch) => sanitizeRecordBatch(batch, context));
		return new arrow_1.Table(schema, batches);
	}
	function sanitizeRecordBatch(batchLike, context) {
		if (batchLike instanceof arrow_1.RecordBatch) return batchLike;
		if (typeof batchLike !== "object" || batchLike === null) throw Error("Expected a RecordBatch but object was null/undefined");
		if (!("schema" in batchLike)) throw Error("The record batch passed in does not appear to be a record batch (no 'schema' property)");
		if (!("data" in batchLike)) throw Error("The record batch passed in does not appear to be a record batch (no 'data' property)");
		const schema = sanitizeSchemaWithContext(batchLike.schema, context);
		const data = sanitizeData(batchLike.data, context);
		return new arrow_1.RecordBatch(schema, data);
	}
	function sanitizeData(dataLike, context) {
		if (dataLike instanceof apache_arrow_1$3.Data) return dataLike;
		const cachedData = context.data.get(dataLike);
		if (cachedData !== void 0) return cachedData;
		const dictionaryLike = dataLike.dictionary;
		let dictionary;
		if (dictionaryLike !== void 0) {
			dictionary = context.vectors.get(dictionaryLike);
			if (dictionary === void 0) {
				dictionary = new apache_arrow_1$3.Vector(dictionaryLike.data.map((data) => sanitizeData(data, context)));
				context.vectors.set(dictionaryLike, dictionary);
			}
		}
		const data = new apache_arrow_1$3.Data(sanitizeTypeWithContext(dataLike.type, context), dataLike.offset, dataLike.length, dataLike.nullCount, {
			[apache_arrow_1$3.BufferType.OFFSET]: dataLike.valueOffsets,
			[apache_arrow_1$3.BufferType.DATA]: dataLike.values,
			[apache_arrow_1$3.BufferType.VALIDITY]: dataLike.nullBitmap,
			[apache_arrow_1$3.BufferType.TYPE]: dataLike.typeIds
		}, dataLike.children.map((child) => sanitizeData(child, context)), dictionary);
		context.data.set(dataLike, data);
		return data;
	}
	const constructorsByTypeName = {
		null: () => new arrow_1.Null(),
		binary: () => new arrow_1.Binary(),
		utf8: () => new arrow_1.Utf8(),
		bool: () => new arrow_1.Bool(),
		int8: () => new arrow_1.Int8(),
		int16: () => new arrow_1.Int16(),
		int32: () => new arrow_1.Int32(),
		int64: () => new arrow_1.Int64(),
		uint8: () => new arrow_1.Uint8(),
		uint16: () => new arrow_1.Uint16(),
		uint32: () => new arrow_1.Uint32(),
		uint64: () => new arrow_1.Uint64(),
		float16: () => new arrow_1.Float16(),
		float32: () => new arrow_1.Float32(),
		float64: () => new arrow_1.Float64(),
		datemillisecond: () => new arrow_1.DateMillisecond(),
		dateday: () => new arrow_1.DateDay(),
		timenanosecond: () => new arrow_1.TimeNanosecond(),
		timemicrosecond: () => new arrow_1.TimeMicrosecond(),
		timemillisecond: () => new arrow_1.TimeMillisecond(),
		timesecond: () => new arrow_1.TimeSecond(),
		intervaldaytime: () => new arrow_1.IntervalDayTime(),
		intervalyearmonth: () => new arrow_1.IntervalYearMonth(),
		durationnanosecond: () => new arrow_1.DurationNanosecond(),
		durationmicrosecond: () => new arrow_1.DurationMicrosecond(),
		durationmillisecond: () => new arrow_1.DurationMillisecond(),
		durationsecond: () => new arrow_1.DurationSecond()
	};
	function dataTypeFromName(typeName) {
		const normalizedTypeName = typeName.toLowerCase();
		const _constructor = constructorsByTypeName[normalizedTypeName];
		if (!_constructor) throw new Error("Unrecognized type name in schema: " + typeName);
		return _constructor();
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/schema.js
var require_schema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.inferSchema = inferSchema;
	const apache_arrow_1$2 = __require("apache-arrow");
	const arrow_type_1 = require_arrow_type();
	const sanitize_1 = require_sanitize();
	/**
	* Infer the Arrow schema represented by a set of records.
	*
	* This is the intentionally small interface to schema inference. The stateful
	* details of combining partial type evidence are encapsulated below so callers
	* only need to provide records, an optional schema, and inference options.
	*/
	function inferSchema(data, schema, options) {
		return new SchemaInferrer(schema, options).infer(data);
	}
	var SchemaInferrer = class {
		providedSchema;
		options;
		fields = new FieldTree();
		constructor(providedSchema, options) {
			this.providedSchema = providedSchema;
			this.options = options;
		}
		infer(data) {
			for (const [row, record] of data.entries()) for (const [path, value] of recordPathsAndValues(record)) this.observe(path, value, row);
			return this.providedSchema === void 0 ? new apache_arrow_1$2.Schema(fieldsFromTree(this.fields)) : new apache_arrow_1$2.Schema(matchingFields(this.providedSchema.fields, this.fields));
		}
		observe(path, value, row) {
			const current = this.fields.get(path);
			if (current === void 0) this.addField(path, value, row);
			else if (this.providedSchema === void 0) this.updateInferredField(path, value, row, current);
		}
		addField(path, value, row) {
			if (this.providedSchema !== void 0) {
				this.addSchemaField(this.providedSchema, path, row);
				return;
			}
			const evidence = this.inferType(value, path) ?? DeferredTypeEvidence.from(value, row);
			if (evidence === void 0) throw typeInferenceError(path, row);
			const conflict = this.fields.set(path, evidence, (existing) => existing instanceof DeferredTypeEvidence && existing.isOnlyNulls());
			if (conflict !== void 0) throw branchConflictError(conflict, row, "Struct");
		}
		addSchemaField(schema, path, row) {
			const field = fieldAtPath(schema, path);
			if (field === void 0) throw new Error(`Found field not in schema: ${path.join(".")} at row ${row}`);
			const conflict = this.fields.set(path, field.type);
			if (conflict !== void 0) throw branchConflictError(conflict, row, "Struct");
		}
		updateInferredField(path, value, row, current) {
			const newType = this.inferType(value, path);
			const deferred = DeferredTypeEvidence.from(value, row);
			if (current instanceof FieldTree) {
				if (deferred?.isOnlyNulls()) return;
				throw schemaInferenceError(path, row, "Struct", describeEvidence(newType ?? deferred));
			}
			if (current instanceof DeferredTypeEvidence) {
				this.resolveDeferredField(path, row, current, newType, deferred);
				return;
			}
			if (newType !== void 0) {
				if (!inferredTypesEqual(current, newType)) throw schemaInferenceError(path, row, describeEvidence(current), describeEvidence(newType));
				return;
			}
			if (deferred === void 0 || !deferred.matches(current)) throw schemaInferenceError(path, row, describeEvidence(current), describeEvidence(deferred));
		}
		resolveDeferredField(path, row, current, newType, deferred) {
			if (newType !== void 0) {
				if (!current.matches(newType)) throw schemaInferenceError(path, row, current.describe(), describeEvidence(newType));
				this.fields.set(path, newType);
				return;
			}
			if (deferred !== void 0) {
				this.fields.set(path, current.merge(deferred));
				return;
			}
			throw schemaInferenceError(path, row, current.describe(), describeEvidence(newType));
		}
		inferType(value, path) {
			if (typeof value === "bigint") return new apache_arrow_1$2.Int64();
			if (typeof value === "number") return new apache_arrow_1$2.Float64();
			if (typeof value === "string") return this.options.dictionaryEncodeStrings ? new apache_arrow_1$2.Dictionary(new apache_arrow_1$2.Utf8(), new apache_arrow_1$2.Int32()) : new apache_arrow_1$2.Utf8();
			if (typeof value === "boolean") return new apache_arrow_1$2.Bool();
			if (value instanceof Buffer) return new apache_arrow_1$2.Binary();
			if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
				const typedArray = (0, arrow_type_1.typedArrayToArrowType)(value);
				return typedArray === void 0 ? void 0 : new apache_arrow_1$2.FixedSizeList(typedArray.length, new apache_arrow_1$2.Field("item", typedArray.elementType, true));
			}
			if (!Array.isArray(value) || value.length === 0) return;
			const configuredVector = path.length === 1 ? this.options.vectorColumns[path[0]] : void 0;
			if (configuredVector !== void 0) return new apache_arrow_1$2.FixedSizeList(value.length, new apache_arrow_1$2.Field("item", (0, sanitize_1.sanitizeType)(configuredVector.type), true));
			const itemType = this.inferArrayItemType(value, path);
			if (itemType === void 0) return;
			return nameSuggestsVectorColumn(path[path.length - 1]) ? new apache_arrow_1$2.FixedSizeList(value.length, new apache_arrow_1$2.Field("item", new apache_arrow_1$2.Float32(), true)) : new apache_arrow_1$2.List(new apache_arrow_1$2.Field("item", itemType, true));
		}
		inferArrayItemType(values, path) {
			let itemType;
			const deferredItems = [];
			for (const value of values) {
				const candidate = this.inferType(value, path);
				if (candidate === void 0) {
					if (!isDeferredValue(value)) return;
					deferredItems.push(value);
				} else if (itemType === void 0) itemType = candidate;
				else if (!inferredTypesEqual(itemType, candidate)) return;
			}
			if (itemType === void 0) return;
			return deferredItems.every((value) => deferredValueMatchesType(value, itemType)) ? itemType : void 0;
		}
	};
	/** Nulls and empty/all-null lists that do not determine a type by themselves. */
	var DeferredTypeEvidence = class DeferredTypeEvidence {
		values;
		constructor(values) {
			this.values = values;
		}
		static from(value, row) {
			return isDeferredValue(value) ? new DeferredTypeEvidence([{
				value,
				row
			}]) : void 0;
		}
		isOnlyNulls() {
			return this.values.every(({ value }) => value == null);
		}
		matches(type) {
			return this.values.every(({ value }) => deferredValueMatchesType(value, type));
		}
		merge(other) {
			return new DeferredTypeEvidence([...this.values, ...other.values]);
		}
		describe() {
			const list = this.values.find(({ value }) => Array.isArray(value));
			return list === void 0 ? "null" : `List[${list.value.length}]`;
		}
		firstRow() {
			return this.values[0].row;
		}
	};
	/** Nested field state, kept separate from Arrow's eventual Struct types. */
	var FieldTree = class FieldTree {
		children = /* @__PURE__ */ new Map();
		get(path) {
			let current = this;
			for (const part of path) {
				if (!(current instanceof FieldTree)) return;
				const child = current.children.get(part);
				if (child === void 0) return;
				current = child;
			}
			return current;
		}
		set(path, value, canReplaceLeaf = () => false) {
			let branch = this;
			for (const [index, part] of path.slice(0, -1).entries()) {
				const child = branch.children.get(part);
				if (child === void 0 || isLeaf(child) && canReplaceLeaf(child)) {
					const nextBranch = new FieldTree();
					branch.children.set(part, nextBranch);
					branch = nextBranch;
				} else if (child instanceof FieldTree) branch = child;
				else return {
					path: path.slice(0, index + 1),
					value: child
				};
			}
			const name = path[path.length - 1];
			const current = branch.children.get(name);
			if (current instanceof FieldTree) return {
				path,
				value: current
			};
			branch.children.set(name, value);
		}
		entries() {
			return this.children.entries();
		}
		has(name) {
			return this.children.has(name);
		}
	};
	function isLeaf(value) {
		return !(value instanceof FieldTree);
	}
	function fieldsFromTree(tree, path = []) {
		const fields = [];
		for (const [name, value] of tree.entries()) if (value instanceof FieldTree) fields.push(new apache_arrow_1$2.Field(name, new apache_arrow_1$2.Struct(fieldsFromTree(value, [...path, name])), true));
		else if (value instanceof DeferredTypeEvidence) throw typeInferenceError([...path, name], value.firstRow());
		else fields.push(new apache_arrow_1$2.Field(name, value, true));
		return fields;
	}
	function matchingFields(fields, tree) {
		const matches = [];
		for (const field of fields) {
			if (!tree.has(field.name)) continue;
			const value = tree.get([field.name]);
			if (value instanceof FieldTree) {
				const struct = field.type;
				matches.push(new apache_arrow_1$2.Field(field.name, new apache_arrow_1$2.Struct(matchingFields(struct.children, value)), field.nullable, field.metadata));
			} else matches.push(field);
		}
		return matches;
	}
	function* recordPathsAndValues(record, path = []) {
		for (const [name, value] of Object.entries(record)) if (isRecord(value)) yield* recordPathsAndValues(value, [...path, name]);
		else if (value !== void 0) yield [[...path, name], value];
	}
	function isRecord(value) {
		return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof RegExp) && !(value instanceof Date) && !(value instanceof Set) && !(value instanceof Map) && !(value instanceof Buffer) && !ArrayBuffer.isView(value);
	}
	function fieldAtPath(schema, path) {
		let fields = schema.fields;
		let field;
		for (const [index, name] of path.entries()) {
			field = fields.find((candidate) => candidate.name === name);
			if (field === void 0 || index === path.length - 1) return field;
			if (!apache_arrow_1$2.DataType.isStruct(field.type)) return;
			fields = field.type.children;
		}
		return field;
	}
	function isDeferredValue(value) {
		return value == null || Array.isArray(value) && value.every(isDeferredValue);
	}
	function deferredValueMatchesType(value, type) {
		if (value == null) return true;
		if (!Array.isArray(value)) return false;
		if (apache_arrow_1$2.DataType.isList(type)) return value.every((item) => deferredValueMatchesType(item, type.valueType));
		if (apache_arrow_1$2.DataType.isFixedSizeList(type)) return value.length === type.listSize && value.every((item) => deferredValueMatchesType(item, type.valueType));
		return false;
	}
	function inferredTypesEqual(current, candidate) {
		if (apache_arrow_1$2.DataType.isDictionary(current)) return apache_arrow_1$2.DataType.isDictionary(candidate) && current.isOrdered === candidate.isOrdered && inferredTypesEqual(current.indices, candidate.indices) && inferredTypesEqual(current.dictionary, candidate.dictionary);
		if (apache_arrow_1$2.DataType.isList(current)) return apache_arrow_1$2.DataType.isList(candidate) && current.valueField.name === candidate.valueField.name && current.valueField.nullable === candidate.valueField.nullable && inferredTypesEqual(current.valueType, candidate.valueType);
		if (apache_arrow_1$2.DataType.isFixedSizeList(current)) return apache_arrow_1$2.DataType.isFixedSizeList(candidate) && current.listSize === candidate.listSize && current.valueField.name === candidate.valueField.name && current.valueField.nullable === candidate.valueField.nullable && inferredTypesEqual(current.valueType, candidate.valueType);
		return apache_arrow_1$2.util.compareTypes(current, candidate);
	}
	function describeEvidence(evidence) {
		if (evidence === void 0) return "an unsupported value";
		return evidence instanceof DeferredTypeEvidence ? evidence.describe() : evidence.toString();
	}
	function branchConflictError(conflict, row, candidate) {
		return schemaInferenceError(conflict.path, row, conflict.value instanceof FieldTree ? "Struct" : describeEvidence(conflict.value), candidate);
	}
	function schemaInferenceError(path, row, currentType, newType) {
		return /* @__PURE__ */ new Error(`Failed to infer schema for data. Previously inferred type ${currentType} but found ${newType} for field ${path.join(".")} at row ${row}. Consider providing an explicit schema.`);
	}
	function typeInferenceError(path, row) {
		return /* @__PURE__ */ new Error(`Failed to infer data type for field ${path.join(".")} at row ${row}. Consider providing an explicit schema.`);
	}
	function nameSuggestsVectorColumn(name) {
		const normalized = name.toLowerCase();
		return normalized.includes("vector") || normalized.includes("embedding");
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/arrow.js
var require_arrow = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MakeArrowTableOptions = exports.VectorColumnOptions = void 0;
	exports.isMultiVector = isMultiVector;
	exports.isIntoVector = isIntoVector;
	exports.extractVectorBuffer = extractVectorBuffer;
	exports.isArrowTable = isArrowTable;
	exports.isNull = isNull;
	exports.isInt = isInt;
	exports.isFloat = isFloat;
	exports.isBinary = isBinary;
	exports.isLargeBinary = isLargeBinary;
	exports.isUtf8 = isUtf8;
	exports.isLargeUtf8 = isLargeUtf8;
	exports.isBool = isBool;
	exports.isDecimal = isDecimal;
	exports.isDate = isDate;
	exports.isTime = isTime;
	exports.isTimestamp = isTimestamp;
	exports.isInterval = isInterval;
	exports.isDuration = isDuration;
	exports.isList = isList;
	exports.isStruct = isStruct;
	exports.isUnion = isUnion;
	exports.isFixedSizeBinary = isFixedSizeBinary;
	exports.isFixedSizeList = isFixedSizeList;
	exports.makeArrowTable = makeArrowTable;
	exports.makeEmptyTable = makeEmptyTable;
	exports.convertToTable = convertToTable;
	exports.newVectorType = newVectorType;
	exports.fromRecordsToBuffer = fromRecordsToBuffer;
	exports.fromRecordsToStreamBuffer = fromRecordsToStreamBuffer;
	exports.fromTableToBuffer = fromTableToBuffer;
	exports.fromDataToBuffer = fromDataToBuffer;
	exports.fromBufferToRecordBatch = fromBufferToRecordBatch;
	exports.fromRecordBatchToBuffer = fromRecordBatchToBuffer;
	exports.fromRecordBatchToStreamBuffer = fromRecordBatchToStreamBuffer;
	exports.fromTableToStreamBuffer = fromTableToStreamBuffer;
	exports.createEmptyTable = createEmptyTable;
	exports.ensureNestedFieldsExist = ensureNestedFieldsExist;
	exports.dataTypeToJson = dataTypeToJson;
	const apache_arrow_1$1 = __require("apache-arrow");
	const arrow_type_1 = require_arrow_type();
	const registry_1 = require_registry();
	const sanitize_1 = require_sanitize();
	const schema_1 = require_schema();
	__exportStar(__require("apache-arrow"), exports);
	function isMultiVector(value) {
		return Array.isArray(value) && isIntoVector(value[0]);
	}
	const float16ArrayCtor = globalThis.Float16Array;
	function isIntoVector(value) {
		return value instanceof Float32Array || value instanceof Float64Array || value instanceof Uint8Array || float16ArrayCtor !== void 0 && value instanceof float16ArrayCtor || Array.isArray(value) && !Array.isArray(value[0]);
	}
	/**
	* Extract the underlying byte buffer and data type from a typed array
	* for passing to the Rust NAPI layer without precision loss.
	*/
	function extractVectorBuffer(vector) {
		if (float16ArrayCtor !== void 0 && vector instanceof float16ArrayCtor) return {
			data: new Uint8Array(vector.buffer, vector.byteOffset, vector.byteLength),
			dtype: "float16"
		};
		if (vector instanceof Float64Array) return {
			data: new Uint8Array(vector.buffer, vector.byteOffset, vector.byteLength),
			dtype: "float64"
		};
		if (vector instanceof Uint8Array && !(vector instanceof Float32Array)) return {
			data: vector,
			dtype: "uint8"
		};
		return null;
	}
	function isArrowTable(value) {
		if (value instanceof apache_arrow_1$1.Table) return true;
		return "schema" in value && "batches" in value;
	}
	function isNull(value) {
		return value instanceof apache_arrow_1$1.Null || apache_arrow_1$1.DataType.isNull(value);
	}
	function isInt(value) {
		return value instanceof apache_arrow_1$1.Int || apache_arrow_1$1.DataType.isInt(value);
	}
	function isFloat(value) {
		return value instanceof apache_arrow_1$1.Float || apache_arrow_1$1.DataType.isFloat(value);
	}
	function isBinary(value) {
		return value instanceof apache_arrow_1$1.Binary || apache_arrow_1$1.DataType.isBinary(value);
	}
	function isLargeBinary(value) {
		return value instanceof apache_arrow_1$1.LargeBinary || apache_arrow_1$1.DataType.isLargeBinary(value);
	}
	function isUtf8(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isUtf8(value);
	}
	function isLargeUtf8(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isLargeUtf8(value);
	}
	function isBool(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isBool(value);
	}
	function isDecimal(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isDecimal(value);
	}
	function isDate(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isDate(value);
	}
	function isTime(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isTime(value);
	}
	function isTimestamp(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isTimestamp(value);
	}
	function isInterval(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isInterval(value);
	}
	function isDuration(value) {
		return value instanceof apache_arrow_1$1.Utf8 || apache_arrow_1$1.DataType.isDuration(value);
	}
	function isList(value) {
		return value instanceof apache_arrow_1$1.List || apache_arrow_1$1.DataType.isList(value);
	}
	function isStruct(value) {
		return value instanceof apache_arrow_1$1.Struct || apache_arrow_1$1.DataType.isStruct(value);
	}
	function isUnion(value) {
		return value instanceof apache_arrow_1$1.Struct || apache_arrow_1$1.DataType.isUnion(value);
	}
	function isFixedSizeBinary(value) {
		return value instanceof apache_arrow_1$1.FixedSizeBinary || apache_arrow_1$1.DataType.isFixedSizeBinary(value);
	}
	function isFixedSizeList(value) {
		return value instanceof apache_arrow_1$1.FixedSizeList || apache_arrow_1$1.DataType.isFixedSizeList(value);
	}
	var VectorColumnOptions = class {
		/** Vector column type. */
		type = new apache_arrow_1$1.Float32();
		constructor(values) {
			Object.assign(this, values);
		}
	};
	exports.VectorColumnOptions = VectorColumnOptions;
	function vectorFromArray(data, type) {
		if (apache_arrow_1$1.DataType.isFixedSizeList(type) && apache_arrow_1$1.DataType.isFloat(type.valueType)) {
			const extendedData = [...data, new Array(type.listSize).fill(0)];
			return (0, apache_arrow_1$1.vectorFromArray)(extendedData, type).slice(0, data.length);
		} else if (type === void 0) return (0, apache_arrow_1$1.vectorFromArray)(data);
		else return (0, apache_arrow_1$1.vectorFromArray)(data, type);
	}
	/** Options to control the makeArrowTable call. */
	var MakeArrowTableOptions = class {
		schema;
		vectorColumns = { vector: new VectorColumnOptions() };
		embeddings;
		embeddingFunction;
		/**
		* If true then string columns will be encoded with dictionary encoding
		*
		* Set this to true if your string columns tend to repeat the same values
		* often.  For more precise control use the `schema` property to specify the
		* data type for individual columns.
		*
		* If `schema` is provided then this property is ignored.
		*/
		dictionaryEncodeStrings = false;
		constructor(values) {
			Object.assign(this, values);
		}
	};
	exports.MakeArrowTableOptions = MakeArrowTableOptions;
	/**
	* An enhanced version of the apache-arrow makeTable function from Apache Arrow
	* that supports nested fields and embeddings columns.
	*
	* (typically you do not need to call this function.  It will be called automatically
	* when creating a table or adding data to it)
	*
	* This function converts an array of Record<String, any> (row-major JS objects)
	* to an Arrow Table (a columnar structure)
	*
	* If a schema is provided then it will be used to determine the resulting array
	* types.  Fields will also be reordered to fit the order defined by the schema.
	*
	* If a schema is not provided then the types will be inferred and the field order
	* will be controlled by the order of properties in the first record.  If a type
	* is inferred it will always be nullable.
	*
	* If not all fields are found in the data, then a subset of the schema will be
	* returned.
	*
	* If the input is empty then a schema must be provided to create an empty table.
	*
	* When a schema is not specified then data types will be inferred.  The inference
	* rules are as follows:
	*
	*  - boolean => Bool
	*  - number => Float64
	*  - bigint => Int64
	*  - String => Utf8
	*  - Buffer => Binary
	*  - Record<String, any> => Struct
	*  - Array<any> => List
	* @example
	* ```ts
	* import { fromTableToBuffer, makeArrowTable } from "../arrow";
	* import { Field, FixedSizeList, Float16, Float32, Int32, Schema } from "apache-arrow";
	*
	* const schema = new Schema([
	*   new Field("a", new Int32()),
	*   new Field("b", new Float32()),
	*   new Field("c", new FixedSizeList(3, new Field("item", new Float16()))),
	*  ]);
	*  const table = makeArrowTable([
	*    { a: 1, b: 2, c: [1, 2, 3] },
	*    { a: 4, b: 5, c: [4, 5, 6] },
	*    { a: 7, b: 8, c: [7, 8, 9] },
	*  ], { schema });
	* ```
	*
	* By default it assumes that the column named `vector` is a vector column
	* and it will be converted into a fixed size list array of type float32.
	* The `vectorColumns` option can be used to support other vector column
	* names and data types.
	*
	* ```ts
	* const schema = new Schema([
	*   new Field("a", new Float64()),
	*   new Field("b", new Float64()),
	*   new Field(
	*     "vector",
	*     new FixedSizeList(3, new Field("item", new Float32()))
	*   ),
	* ]);
	* const table = makeArrowTable([
	*   { a: 1, b: 2, vector: [1, 2, 3] },
	*   { a: 4, b: 5, vector: [4, 5, 6] },
	*   { a: 7, b: 8, vector: [7, 8, 9] },
	* ]);
	* assert.deepEqual(table.schema, schema);
	* ```
	*
	* You can specify the vector column types and names using the options as well
	*
	* ```ts
	* const schema = new Schema([
	*   new Field('a', new Float64()),
	*   new Field('b', new Float64()),
	*   new Field('vec1', new FixedSizeList(3, new Field('item', new Float16()))),
	*   new Field('vec2', new FixedSizeList(3, new Field('item', new Float16())))
	* ]);
	* const table = makeArrowTable([
	*   { a: 1, b: 2, vec1: [1, 2, 3], vec2: [2, 4, 6] },
	*   { a: 4, b: 5, vec1: [4, 5, 6], vec2: [8, 10, 12] },
	*   { a: 7, b: 8, vec1: [7, 8, 9], vec2: [14, 16, 18] }
	* ], {
	*   vectorColumns: {
	*     vec1: { type: new Float16() },
	*     vec2: { type: new Float16() }
	*   }
	* }
	* assert.deepEqual(table.schema, schema)
	* ```
	*/
	function makeArrowTable(data, options, metadata) {
		const opt = new MakeArrowTableOptions(options !== void 0 ? options : {});
		let schema = void 0;
		if (opt.schema !== void 0 && opt.schema !== null) {
			schema = (0, sanitize_1.sanitizeSchema)(opt.schema);
			schema = validateSchemaEmbeddings(schema, data, options?.embeddingFunction);
		}
		let schemaMetadata = schema?.metadata || /* @__PURE__ */ new Map();
		if (metadata !== void 0) schemaMetadata = new Map([...schemaMetadata, ...metadata]);
		if (data.length === 0 && (options?.schema === void 0 || options?.schema === null)) throw new Error("At least one record or a schema needs to be provided");
		else if (data.length === 0) {
			if (schema === void 0) throw new Error("A schema must be provided if data is empty");
			else {
				schema = new apache_arrow_1$1.Schema(schema.fields, schemaMetadata);
				return new apache_arrow_1$1.Table(schema);
			}
		}
		let inferredSchema = (0, schema_1.inferSchema)(data, schema, opt);
		inferredSchema = new apache_arrow_1$1.Schema(inferredSchema.fields, schemaMetadata);
		const finalColumns = {};
		for (const field of inferredSchema.fields) finalColumns[field.name] = transposeData(data, field);
		return new apache_arrow_1$1.Table(inferredSchema, finalColumns);
	}
	function isObject(value) {
		return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof RegExp) && !(value instanceof Date) && !(value instanceof Set) && !(value instanceof Map) && !(value instanceof Buffer) && !ArrayBuffer.isView(value);
	}
	function valueAtPath(datum, path) {
		let current = datum;
		for (const key of path) {
			if (current == null) return null;
			if (isObject(current) && (Object.hasOwn(current, key) || key in current)) current = current[key];
			else return;
		}
		return current;
	}
	function transposeData(data, field, path = []) {
		const valuesPath = [...path, field.name];
		const values = data.map((datum) => valueAtPath(datum, valuesPath));
		if (field.type instanceof apache_arrow_1$1.Struct) {
			const childVectors = field.type.children.map((child) => {
				return transposeData(data, child, valuesPath);
			});
			const nullCount = values.filter((value) => value === null).length;
			const structData = (0, apache_arrow_1$1.makeData)({
				type: field.type,
				length: values.length,
				nullCount,
				nullBitmap: nullCount > 0 ? apache_arrow_1$1.util.packBools(values.map((value) => value !== null)) : void 0,
				children: childVectors
			});
			return (0, apache_arrow_1$1.makeVector)(structData);
		} else return makeVector(values, field.type, void 0, field.nullable);
	}
	/**
	* Create an empty Arrow table with the provided schema
	*/
	function makeEmptyTable(schema, metadata) {
		return makeArrowTable([], { schema }, metadata);
	}
	/**
	* Helper function to convert Array<Array<any>> to a variable sized list array
	*/
	function makeListVector(lists) {
		if (lists.length === 0 || lists[0].length === 0) throw Error("Cannot infer list vector from empty array or empty list");
		const sampleList = lists[0];
		let inferredType;
		try {
			inferredType = makeVector(sampleList).type;
		} catch (error) {
			throw Error(`Cannot infer list vector.  Cannot infer inner type: ${error}`);
		}
		const listBuilder = (0, apache_arrow_1$1.makeBuilder)({ type: new apache_arrow_1$1.List(new apache_arrow_1$1.Field("item", inferredType, true)) });
		for (const list of lists) listBuilder.append(list);
		return listBuilder.finish().toVector();
	}
	/** Helper function to convert an Array of JS values to an Arrow Vector */
	function makeVector(values, type, stringAsDictionary, nullable) {
		if (type !== void 0) {
			if (nullable) values = values.map((v) => v === void 0 ? null : v);
			if (apache_arrow_1$1.DataType.isBool(type)) {
				if (!values.some((v) => v !== null && v !== void 0)) {
					const nullBitmap = new Uint8Array(Math.ceil(values.length / 8));
					const data = (0, apache_arrow_1$1.makeData)({
						type,
						length: values.length,
						nullCount: values.length,
						nullBitmap
					});
					return (0, apache_arrow_1$1.makeVector)(data);
				}
			}
			if (type instanceof apache_arrow_1$1.Int) {
				if (apache_arrow_1$1.DataType.isInt(type) && type.bitWidth === 64) values = values.map((v) => {
					if (v === null) return v;
					else if (typeof v === "bigint") return v;
					else if (typeof v === "number") return BigInt(v);
					else return v;
				});
				else values = values.map((v) => {
					if (typeof v == "bigint") return Number(v);
					else return v;
				});
			}
			return vectorFromArray(values, type);
		}
		if (values.length === 0) throw Error("makeVector requires at least one value or the type must be specfied");
		const sampleValue = values.find((val) => val !== null && val !== void 0);
		if (sampleValue === void 0) throw Error("makeVector cannot infer the type if all values are null or undefined");
		if (ArrayBuffer.isView(sampleValue) && !(sampleValue instanceof DataView)) {
			const info = (0, arrow_type_1.typedArrayToArrowType)(sampleValue);
			if (info !== void 0) {
				const fslType = new apache_arrow_1$1.FixedSizeList(info.length, new apache_arrow_1$1.Field("item", info.elementType, true));
				return vectorFromArray(values, fslType);
			}
		}
		if (Array.isArray(sampleValue)) return makeListVector(values);
		else if (Buffer.isBuffer(sampleValue)) return vectorFromArray(values, new apache_arrow_1$1.Binary());
		else if (!(stringAsDictionary ?? false) && (typeof sampleValue === "string" || sampleValue instanceof String)) return vectorFromArray(values, new apache_arrow_1$1.Utf8());
		else return vectorFromArray(values);
	}
	/** Helper function to apply embeddings from metadata to an input table */
	async function applyEmbeddingsFromMetadata(table, schema) {
		const functions = await (0, registry_1.getRegistry)().parseFunctions(schema.metadata);
		const columns = Object.fromEntries(table.schema.fields.map((field) => [field.name, table.getChild(field.name)]));
		for (const functionEntry of functions.values()) {
			const sourceColumn = columns[functionEntry.sourceColumn];
			const destColumn = functionEntry.vectorColumn;
			if (sourceColumn === void 0) throw new Error(`Cannot apply embedding function because the source column '${functionEntry.sourceColumn}' was not present in the data`);
			if (columns[destColumn] !== void 0) {
				const existingColumn = columns[destColumn];
				if (existingColumn.nullCount !== existingColumn.length) continue;
			}
			if (table.batches.length > 1) throw new Error("Internal error: `makeArrowTable` unexpectedly created a table with more than one batch");
			const values = sourceColumn.toArray();
			const vectors = await functionEntry.function.computeSourceEmbeddings(values);
			if (vectors.length !== values.length) throw new Error("Embedding function did not return an embedding for each input element");
			let destType;
			const dtype = schema.fields.find((f) => f.name === destColumn).type;
			if (isFixedSizeList(dtype)) destType = (0, sanitize_1.sanitizeType)(dtype);
			else throw new Error("Expected FixedSizeList as datatype for vector field, instead got: " + dtype);
			columns[destColumn] = makeVector(vectors, destType);
		}
		for (const field of schema.fields) if (!(field.name in columns)) {
			const nullValues = new Array(table.numRows).fill(null);
			columns[field.name] = makeVector(nullValues, field.type, void 0, field.nullable);
		}
		return alignTable(new apache_arrow_1$1.Table(columns), schema);
	}
	/** Helper function to apply embeddings to an input table */
	async function applyEmbeddings(table, embeddings, schema) {
		if (schema !== void 0 && schema !== null) schema = (0, sanitize_1.sanitizeSchema)(schema);
		if (schema?.metadata.has("embedding_functions")) return applyEmbeddingsFromMetadata(table, schema);
		else if (embeddings == null || embeddings === void 0) return table;
		let schemaMetadata = schema?.metadata || /* @__PURE__ */ new Map();
		if (!(embeddings == null || embeddings === void 0)) {
			const embeddingMetadata = (0, registry_1.getRegistry)().getTableMetadata([embeddings]);
			schemaMetadata = new Map([...schemaMetadata, ...embeddingMetadata]);
		}
		const colEntries = [...Array(table.numCols).keys()].map((_, idx) => {
			return [table.schema.fields[idx].name, table.getChildAt(idx)];
		});
		const newColumns = Object.fromEntries(colEntries);
		const sourceColumn = newColumns[embeddings.sourceColumn];
		const destColumn = embeddings.vectorColumn ?? "vector";
		const innerDestType = embeddings.function.embeddingDataType() ?? new apache_arrow_1$1.Float32();
		if (sourceColumn === void 0) throw new Error(`Cannot apply embedding function because the source column '${embeddings.sourceColumn}' was not present in the data`);
		if (table.numRows === 0) {
			if (Object.prototype.hasOwnProperty.call(newColumns, destColumn)) return table;
			const dimensions = embeddings.function.ndims();
			if (dimensions !== void 0) newColumns[destColumn] = makeVector([], newVectorType(dimensions, innerDestType));
			else if (schema != null) {
				const destField = schema.fields.find((f) => f.name === destColumn);
				if (destField != null) newColumns[destColumn] = makeVector([], destField.type, void 0, destField.nullable);
				else throw new Error(`Attempt to apply embeddings to an empty table failed because schema was missing embedding column '${destColumn}'`);
			} else throw new Error("Attempt to apply embeddings to an empty table when the embeddings function does not specify `embeddingDimension`");
		} else {
			if (Object.prototype.hasOwnProperty.call(newColumns, destColumn)) {
				const existingColumn = newColumns[destColumn];
				if (existingColumn.nullCount !== existingColumn.length) {
					let newTable = new apache_arrow_1$1.Table(newColumns);
					if (schema != null) newTable = alignTable(newTable, schema);
					return new apache_arrow_1$1.Table(new apache_arrow_1$1.Schema(newTable.schema.fields, schemaMetadata), newTable.batches);
				}
			}
			if (table.batches.length > 1) throw new Error("Internal error: `makeArrowTable` unexpectedly created a table with more than one batch");
			const values = sourceColumn.toArray();
			const vectors = await embeddings.function.computeSourceEmbeddings(values);
			if (vectors.length !== values.length) throw new Error("Embedding function did not return an embedding for each input element");
			newColumns[destColumn] = makeVector(vectors, newVectorType(vectors[0].length, innerDestType));
		}
		let newTable = new apache_arrow_1$1.Table(newColumns);
		if (schema != null) {
			if (schema.fields.find((f) => f.name === destColumn) === void 0) throw new Error(`When using embedding functions and specifying a schema the schema should include the embedding column but the column ${destColumn} was missing`);
			newTable = alignTable(newTable, schema);
		}
		newTable = new apache_arrow_1$1.Table(new apache_arrow_1$1.Schema(newTable.schema.fields, schemaMetadata), newTable.batches);
		return newTable;
	}
	/**
	* Convert an Array of records into an Arrow Table, optionally applying an
	* embeddings function to it.
	*
	* This function calls `makeArrowTable` first to create the Arrow Table.
	* Any provided `makeTableOptions` (e.g. a schema) will be passed on to
	* that call.
	*
	* The embedding function will be passed a column of values (based on the
	* `sourceColumn` of the embedding function) and expects to receive back
	* number[][] which will be converted into a fixed size list column.  By
	* default this will be a fixed size list of Float32 but that can be
	* customized by the `embeddingDataType` property of the embedding function.
	*
	* If a schema is provided in `makeTableOptions` then it should include the
	* embedding columns.  If no schema is provded then embedding columns will
	* be placed at the end of the table, after all of the input columns.
	*/
	async function convertToTable(data, embeddings, makeTableOptions) {
		let processedData = data;
		if (makeTableOptions?.schema && makeTableOptions.schema.metadata?.has("embedding_functions")) processedData = ensureNestedFieldsExist(data, makeTableOptions.schema);
		return await applyEmbeddings(makeArrowTable(processedData, makeTableOptions), embeddings, makeTableOptions?.schema);
	}
	/** Creates the Arrow Type for a Vector column with dimension `dim` */
	function newVectorType(dim, innerType) {
		const children = new apache_arrow_1$1.Field("item", (0, sanitize_1.sanitizeType)(innerType), true);
		return new apache_arrow_1$1.FixedSizeList(dim, children);
	}
	/**
	* Serialize an Array of records into a buffer using the Arrow IPC File serialization
	*
	* This function will call `convertToTable` and pass on `embeddings` and `schema`
	*
	* `schema` is required if data is empty
	*/
	async function fromRecordsToBuffer(data, embeddings, schema) {
		if (schema !== void 0 && schema !== null) schema = (0, sanitize_1.sanitizeSchema)(schema);
		const table = await convertToTable(data, embeddings, { schema });
		const writer = apache_arrow_1$1.RecordBatchFileWriter.writeAll(table);
		return Buffer.from(await writer.toUint8Array());
	}
	/**
	* Serialize an Array of records into a buffer using the Arrow IPC Stream serialization
	*
	* This function will call `convertToTable` and pass on `embeddings` and `schema`
	*
	* `schema` is required if data is empty
	*/
	async function fromRecordsToStreamBuffer(data, embeddings, schema) {
		if (schema !== void 0 && schema !== null) schema = (0, sanitize_1.sanitizeSchema)(schema);
		const table = await convertToTable(data, embeddings, { schema });
		const writer = apache_arrow_1$1.RecordBatchStreamWriter.writeAll(table);
		return Buffer.from(await writer.toUint8Array());
	}
	/**
	* Serialize an Arrow Table into a buffer using the Arrow IPC File serialization
	*
	* This function will apply `embeddings` to the table in a manner similar to
	* `convertToTable`.
	*
	* `schema` is required if the table is empty
	*/
	async function fromTableToBuffer(table, embeddings, schema) {
		if (schema !== void 0 && schema !== null) schema = (0, sanitize_1.sanitizeSchema)(schema);
		const tableWithEmbeddings = await applyEmbeddings(table, embeddings, schema);
		const writer = apache_arrow_1$1.RecordBatchFileWriter.writeAll(tableWithEmbeddings);
		return Buffer.from(await writer.toUint8Array());
	}
	/**
	* Serialize an Arrow Table into a buffer using the Arrow IPC File serialization
	*
	* This function will apply `embeddings` to the table in a manner similar to
	* `convertToTable`.
	*
	* `schema` is required if the table is empty
	*/
	async function fromDataToBuffer(data, embeddings, schema) {
		if (schema !== void 0 && schema !== null) schema = (0, sanitize_1.sanitizeSchema)(schema);
		if (isArrowTable(data)) {
			const table = (0, sanitize_1.sanitizeTable)(data);
			if (schema && schema.metadata?.has("embedding_functions")) return fromTableToBuffer(alignTableToSchema(table, schema), embeddings, schema);
			else return fromTableToBuffer(table, embeddings, schema);
		} else return fromTableToBuffer(await convertToTable(data, embeddings, { schema }));
	}
	/**
	* Read a single record batch from a buffer.
	*
	* Returns null if the buffer does not contain a record batch
	*/
	async function fromBufferToRecordBatch(data) {
		return (await apache_arrow_1$1.RecordBatchFileReader.readAll(Buffer.from(data)).next().value)?.next().value || null;
	}
	/**
	* Create a buffer containing a single record batch
	*/
	async function fromRecordBatchToBuffer(batch) {
		const writer = new apache_arrow_1$1.RecordBatchFileWriter().writeAll([batch]);
		return Buffer.from(await writer.toUint8Array());
	}
	/**
	* Create a buffer containing a single record batch using the Arrow IPC Stream
	* serialization. Each call produces a self-contained Stream message (schema +
	* batch + EOS) suitable for incremental decode by `arrow_ipc::reader::StreamReader`.
	*/
	async function fromRecordBatchToStreamBuffer(batch) {
		const writer = apache_arrow_1$1.RecordBatchStreamWriter.writeAll([batch]);
		return Buffer.from(await writer.toUint8Array());
	}
	/**
	* Serialize an Arrow Table into a buffer using the Arrow IPC Stream serialization
	*
	* This function will apply `embeddings` to the table in a manner similar to
	* `convertToTable`.
	*
	* `schema` is required if the table is empty
	*/
	async function fromTableToStreamBuffer(table, embeddings, schema) {
		const tableWithEmbeddings = await applyEmbeddings(table, embeddings, schema);
		const writer = apache_arrow_1$1.RecordBatchStreamWriter.writeAll(tableWithEmbeddings);
		return Buffer.from(await writer.toUint8Array());
	}
	/**
	* Reorder the columns in `batch` so that they agree with the field order in `schema`
	*/
	function alignBatch(batch, schema) {
		const alignedChildren = [];
		for (const field of schema.fields) {
			const indexInBatch = batch.schema.fields?.findIndex((f) => f.name === field.name);
			if (indexInBatch < 0) throw new Error(`The column ${field.name} was not found in the Arrow Table`);
			alignedChildren.push(batch.data.children[indexInBatch]);
		}
		const newData = (0, apache_arrow_1$1.makeData)({
			type: new apache_arrow_1$1.Struct(schema.fields),
			length: batch.numRows,
			nullCount: batch.nullCount,
			children: alignedChildren
		});
		return new apache_arrow_1$1.RecordBatch(schema, newData);
	}
	/**
	* Reorder the columns in `table` so that they agree with the field order in `schema`
	*/
	function alignTable(table, schema) {
		const alignedBatches = table.batches.map((batch) => alignBatch(batch, schema));
		return new apache_arrow_1$1.Table(schema, alignedBatches);
	}
	/**
	* Create an empty table with the given schema
	*/
	function createEmptyTable(schema) {
		return new apache_arrow_1$1.Table((0, sanitize_1.sanitizeSchema)(schema));
	}
	function validateSchemaEmbeddings(schema, data, embeddings) {
		const fields = [];
		const missingEmbeddingFields = [];
		for (let field of schema.fields) if (isFixedSizeList(field.type)) {
			field = (0, sanitize_1.sanitizeField)(field);
			if (data.length !== 0 && data?.[0]?.[field.name] === void 0) {
				let hasEmbeddingFunction = false;
				if (schema.metadata.has("embedding_functions")) {
					if ((0, registry_1.parseEmbeddingMetadata)(schema.metadata.get("embedding_functions")).some((f) => f.vectorColumn === field.name)) hasEmbeddingFunction = true;
				}
				if (embeddings && embeddings.vectorColumn === field.name) hasEmbeddingFunction = true;
				if (field.nullable && !hasEmbeddingFunction) fields.push(field);
				else if (hasEmbeddingFunction) fields.push(field);
				else missingEmbeddingFields.push(field);
			} else fields.push(field);
		} else fields.push(field);
		if (missingEmbeddingFields.length > 0 && embeddings === void 0) throw new Error(`Table has embeddings: "${missingEmbeddingFields.map((f) => f.name).join(",")}", but no embedding function was provided`);
		return new apache_arrow_1$1.Schema(fields, schema.metadata);
	}
	/**
	* Ensures that all nested fields defined in the schema exist in the data,
	* filling missing fields with null values.
	*/
	function ensureNestedFieldsExist(data, schema) {
		return data.map((row) => {
			const completeRow = {};
			for (const field of schema.fields) if (field.name in row) {
				if (field.type.constructor.name === "Struct" && row[field.name] !== null && row[field.name] !== void 0) {
					const nestedValue = row[field.name];
					completeRow[field.name] = ensureStructFieldsExist(nestedValue, field.type);
				} else completeRow[field.name] = row[field.name];
			} else completeRow[field.name] = field.type.constructor.name === "Struct" ? ensureStructFieldsExist({}, field.type) : null;
			return completeRow;
		});
	}
	/**
	* Recursively ensures that all fields in a struct type exist in the data,
	* filling missing fields with null values.
	*/
	function ensureStructFieldsExist(data, structType) {
		const completeStruct = {};
		for (const childField of structType.children) if (childField.name in data) {
			if (childField.type.constructor.name === "Struct" && data[childField.name] !== null && data[childField.name] !== void 0) completeStruct[childField.name] = ensureStructFieldsExist(data[childField.name], childField.type);
			else completeStruct[childField.name] = data[childField.name];
		} else completeStruct[childField.name] = childField.type.constructor.name === "Struct" ? ensureStructFieldsExist({}, childField.type) : null;
		return completeStruct;
	}
	function dataTypeToJson(dataType) {
		switch (dataType.typeId) {
			case apache_arrow_1$1.Type.Null: return { type: "null" };
			case apache_arrow_1$1.Type.Bool: return { type: "bool" };
			case apache_arrow_1$1.Type.Int8: return { type: "int8" };
			case apache_arrow_1$1.Type.Int16: return { type: "int16" };
			case apache_arrow_1$1.Type.Int32: return { type: "int32" };
			case apache_arrow_1$1.Type.Int64: return { type: "int64" };
			case apache_arrow_1$1.Type.Uint8: return { type: "uint8" };
			case apache_arrow_1$1.Type.Uint16: return { type: "uint16" };
			case apache_arrow_1$1.Type.Uint32: return { type: "uint32" };
			case apache_arrow_1$1.Type.Uint64: return { type: "uint64" };
			case apache_arrow_1$1.Type.Int: {
				const bitWidth = dataType.bitWidth;
				return { type: `${dataType.isSigned ? "" : "u"}int${bitWidth}` };
			}
			case apache_arrow_1$1.Type.Float:
				switch (dataType.precision) {
					case apache_arrow_1$1.Precision.HALF: return { type: "halffloat" };
					case apache_arrow_1$1.Precision.SINGLE: return { type: "float" };
					case apache_arrow_1$1.Precision.DOUBLE: return { type: "double" };
				}
				throw Error("Unsupported float precision");
			case apache_arrow_1$1.Type.Float16: return { type: "halffloat" };
			case apache_arrow_1$1.Type.Float32: return { type: "float" };
			case apache_arrow_1$1.Type.Float64: return { type: "double" };
			case apache_arrow_1$1.Type.Utf8: return { type: "string" };
			case apache_arrow_1$1.Type.Binary: return { type: "binary" };
			case apache_arrow_1$1.Type.LargeUtf8: return { type: "large_string" };
			case apache_arrow_1$1.Type.LargeBinary: return { type: "large_binary" };
			case apache_arrow_1$1.Type.List: return {
				type: "list",
				fields: [fieldToJson(dataType.children[0])]
			};
			case apache_arrow_1$1.Type.FixedSizeList: {
				const fixedSizeList = dataType;
				return {
					type: "fixed_size_list",
					fields: [fieldToJson(fixedSizeList.children[0])],
					length: fixedSizeList.listSize
				};
			}
			case apache_arrow_1$1.Type.Struct: return {
				type: "struct",
				fields: dataType.children.map(fieldToJson)
			};
			case apache_arrow_1$1.Type.Date: return { type: dataType.unit === apache_arrow_1$1.DateUnit.DAY ? "date32:day" : "date64:ms" };
			case apache_arrow_1$1.Type.Timestamp: {
				const timestamp = dataType;
				const timezone = timestamp.timezone || "-";
				return { type: `timestamp:${timestamp.unit}:${timezone}` };
			}
			case apache_arrow_1$1.Type.Decimal: {
				const decimal = dataType;
				return { type: `decimal:${decimal.bitWidth}:${decimal.precision}:${decimal.scale}` };
			}
			case apache_arrow_1$1.Type.Duration: return { type: `duration:${dataType.unit}` };
			case apache_arrow_1$1.Type.FixedSizeBinary: return { type: `fixed_size_binary:${dataType.byteWidth}` };
			case apache_arrow_1$1.Type.Dictionary: {
				const dict = dataType;
				const indexType = dataTypeToJson(dict.indices);
				return { type: `dict:${dataTypeToJson(dict.valueType).type}:${indexType.type}:false` };
			}
		}
		throw new Error("Unsupported data type");
	}
	function fieldToJson(field) {
		return {
			name: field.name,
			type: dataTypeToJson(field.type),
			nullable: field.nullable,
			metadata: field.metadata
		};
	}
	function alignTableToSchema(table, targetSchema) {
		const existingColumns = /* @__PURE__ */ new Map();
		for (const field of table.schema.fields) existingColumns.set(field.name, table.getChild(field.name));
		const alignedColumns = {};
		for (const field of targetSchema.fields) if (existingColumns.has(field.name)) alignedColumns[field.name] = existingColumns.get(field.name);
		else alignedColumns[field.name] = createNullVector(field, table.numRows);
		return new apache_arrow_1$1.Table(targetSchema, alignedColumns);
	}
	function createNullVector(field, numRows) {
		if (field.type.constructor.name === "Struct") {
			const structType = field.type;
			const childVectors = structType.children.map((childField) => createNullVector(childField, numRows));
			const structData = (0, apache_arrow_1$1.makeData)({
				type: structType,
				length: numRows,
				nullCount: 0,
				children: childVectors.map((v) => v.data[0])
			});
			return (0, apache_arrow_1$1.makeVector)(structData);
		} else {
			const nullBitmap = new Uint8Array(Math.ceil(numRows / 8));
			const data = (0, apache_arrow_1$1.makeData)({
				type: field.type,
				length: numRows,
				nullCount: numRows,
				nullBitmap
			});
			return (0, apache_arrow_1$1.makeVector)(data);
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/materialized_view.js
var require_materialized_view = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MaterializedView = exports.DEFINITION_META_KEY = void 0;
	exports.validateNonNegativeInteger = validateNonNegativeInteger;
	exports.normalizeSelect = normalizeSelect;
	exports.definitionFromMetadata = definitionFromMetadata;
	/** Schema metadata key holding a materialized view's definition. */
	exports.DEFINITION_META_KEY = "mv.definition";
	/**
	* @internal Reject a numeric option N-API would otherwise silently coerce:
	* `Infinity` reaches Rust as 0, `1.5` as 1.
	*/
	function validateNonNegativeInteger(value, name) {
		if (value !== void 0 && !(Number.isSafeInteger(value) && value >= 0)) throw new Error(`${name} must be a non-negative integer`);
	}
	/** @internal Quote a column name as a Lance SQL identifier (backticks). */
	function quoteIdentifier(name) {
		return "`" + name.replace(/`/g, "``") + "`";
	}
	/**
	* @internal Normalize a select argument into `[alias, expression]` pairs.
	* A bare name projects itself and is quoted, so any valid column name works;
	* pair and record entries are kept verbatim because their right side is an
	* expression.
	*/
	function normalizeSelect(select) {
		if (select === void 0) return;
		if (Array.isArray(select)) return select.map((item) => typeof item === "string" ? [item, quoteIdentifier(item)] : item);
		return Object.entries(select);
	}
	/** @internal Parse a definition off a table's stored schema metadata. */
	function definitionFromMetadata(metadata, name) {
		const raw = metadata.get(exports.DEFINITION_META_KEY);
		if (raw === void 0) throw new Error(`Table '${name}' is not a materialized view`);
		const value = JSON.parse(raw);
		if (value.kind !== "select") throw new Error(`materialized view '${name}' is defined by '${value.kind}', which this version of lancedb cannot refresh`);
		const limit = value.limit ?? void 0;
		if (limit !== void 0 && !Number.isSafeInteger(limit)) throw new Error(`materialized view '${name}' has a stored limit too large to represent exactly`);
		return {
			sourceTable: value.source_table,
			projections: (value.projections ?? []).map((p) => [p.output, p.expression]),
			filter: value.filter ?? void 0,
			limit,
			inputs: value.inputs ?? []
		};
	}
	/**
	* A handle on a materialized view: its table plus its definition.
	*
	* Obtained from {@link Connection#createMaterializedView} or
	* {@link Connection#openMaterializedView}. The view is a normal table --
	* queries, indexes and search all apply through {@link MaterializedView#table}
	* -- whose contents are maintained by {@link MaterializedView#refresh}.
	*/
	var MaterializedView = class {
		inner;
		constructor(table) {
			this.inner = table;
		}
		get name() {
			return this.inner.name;
		}
		/** The view, as the table it is. */
		table() {
			return this.inner;
		}
		/** The query that defines the view, read from its stored schema. */
		async definition() {
			return definitionFromMetadata((await this.inner.schema()).metadata, this.name);
		}
		/**
		* Recompute the view from its source.
		*
		* The refresh is incremental when the source's changes can be reconciled
		* into the view -- rows added, changed or removed since the last one --
		* and otherwise rebuilds. `full` forces a rebuild; `sourceVersion`
		* refreshes to that source version instead of the latest.
		*
		* Concurrent refreshes of one view do not duplicate its rows. Two that
		* plan the same source rows conflict on commit, and the loser throws
		* rather than writing them a second time.
		*/
		async refresh(options) {
			validateNonNegativeInteger(options?.sourceVersion, "sourceVersion");
			return await this.inner.refreshMaterializedView(options?.full, options?.sourceVersion);
		}
	};
	exports.MaterializedView = MaterializedView;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MergeInsertBuilder = void 0;
	const arrow_1 = require_arrow();
	exports.MergeInsertBuilder = class MergeInsertBuilder {
		#native;
		#schema;
		/** Construct a MergeInsertBuilder. __Internal use only.__ */
		constructor(native, schema) {
			this.#native = native;
			this.#schema = schema;
		}
		/**
		* Rows that exist in both the source table (new data) and
		* the target table (old data) will be updated, replacing
		* the old row with the corresponding matching row.
		*
		* If there are multiple matches then the behavior is undefined.
		* Currently this causes multiple copies of the row to be created
		* but that behavior is subject to change.
		*
		* An optional condition may be specified.  If it is, then only
		* matched rows that satisfy the condtion will be updated.  Any
		* rows that do not satisfy the condition will be left as they
		* are.  Failing to satisfy the condition does not cause a
		* "matched row" to become a "not matched" row.
		*
		* The condition should be an SQL string.  Use the prefix
		* target. to refer to rows in the target table (old data)
		* and the prefix source. to refer to rows in the source
		* table (new data).
		*
		* For example, "target.last_update < source.last_update"
		*/
		whenMatchedUpdateAll(options) {
			return new MergeInsertBuilder(this.#native.whenMatchedUpdateAll(options?.where), this.#schema);
		}
		/**
		* Rows that exist only in the source table (new data) should
		* be inserted into the target table.
		*/
		whenNotMatchedInsertAll() {
			return new MergeInsertBuilder(this.#native.whenNotMatchedInsertAll(), this.#schema);
		}
		/**
		* Rows that exist only in the target table (old data) will be
		* deleted.  An optional condition can be provided to limit what
		* data is deleted.
		*
		* @param options.where - An optional condition to limit what data is deleted
		*/
		whenNotMatchedBySourceDelete(options) {
			return new MergeInsertBuilder(this.#native.whenNotMatchedBySourceDelete(options?.where), this.#schema);
		}
		/**
		* Controls whether to use indexes for the merge operation.
		*
		* When set to `true` (the default), the operation will use an index if available
		* on the join key for improved performance. When set to `false`, it forces a full
		* table scan even if an index exists. This can be useful for benchmarking or when
		* the query optimizer chooses a suboptimal path.
		*
		* @param useIndex - Whether to use indices for the merge operation. Defaults to `true`.
		*/
		useIndex(useIndex) {
			return new MergeInsertBuilder(this.#native.useIndex(useIndex), this.#schema);
		}
		/**
		* Control MemWAL routing for this merge.
		*
		* By default (unset), a `mergeInsert` on a table with an LSM write spec is
		* routed through Lance's MemWAL shard writer, and a table without one uses the
		* standard path.
		*
		* @param enable - `true` forces MemWAL routing and errors if the table has no
		* LSM write spec. `false` forces the standard write path even when a spec is set.
		*/
		useLsm(enable) {
			return new MergeInsertBuilder(this.#native.useLsm(enable), this.#schema);
		}
		/**
		* Controls how an LSM merge checks that its input targets a single shard.
		*
		* When a table has an LSM write spec, every row in a `mergeInsert` call must
		* route to the same shard. When `true` (the default), every row is inspected
		* to verify this. When `false`, only the first row is inspected and the
		* shard it routes to is used for the whole input — a faster path for callers
		* that have already pre-sharded their input. Has no effect on tables without
		* an LSM write spec.
		*
		* @param validateSingleShard - Whether to check every row routes to one shard. Defaults to `true`.
		*/
		validateSingleShard(validateSingleShard) {
			return new MergeInsertBuilder(this.#native.validateSingleShard(validateSingleShard), this.#schema);
		}
		/**
		* Executes the merge insert operation
		*
		* @returns {Promise<MergeResult>} the merge result
		*/
		async execute(data, execOptions) {
			let schema;
			if (this.#schema instanceof Promise) {
				schema = await this.#schema;
				this.#schema = schema;
			} else schema = this.#schema;
			if (execOptions?.timeoutMs !== void 0) this.#native.setTimeout(execOptions.timeoutMs);
			const buffer = await (0, arrow_1.fromDataToBuffer)(data, void 0, schema);
			return await this.#native.execute(buffer);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/native.js
var require_native = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { readFileSync } = __require("node:fs");
	let nativeBinding = null;
	const loadErrors = [];
	const isMusl = () => {
		let musl = false;
		if (process.platform === "linux") {
			musl = isMuslFromFilesystem();
			if (musl === null) musl = isMuslFromReport();
			if (musl === null) musl = isMuslFromChildProcess();
		}
		return musl;
	};
	const isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
	const isMuslFromFilesystem = () => {
		try {
			return readFileSync("/usr/bin/ldd", "utf-8").includes("musl");
		} catch {
			return null;
		}
	};
	const isMuslFromReport = () => {
		let report = null;
		if (typeof process.report?.getReport === "function") {
			process.report.excludeNetwork = true;
			report = process.report.getReport();
		}
		if (!report) return null;
		if (report.header && report.header.glibcVersionRuntime) return false;
		if (Array.isArray(report.sharedObjects)) {
			if (report.sharedObjects.some(isFileMusl)) return true;
		}
		return false;
	};
	const isMuslFromChildProcess = () => {
		try {
			return __require("child_process").execSync("ldd --version", { encoding: "utf8" }).includes("musl");
		} catch (e) {
			return false;
		}
	};
	function requireNative() {
		if (process.env.NAPI_RS_NATIVE_LIBRARY_PATH) try {
			return __require(process.env.NAPI_RS_NATIVE_LIBRARY_PATH);
		} catch (err) {
			loadErrors.push(err);
		}
		else if (process.platform === "android") {
			if (process.arch === "arm64") {
				try {
					return __require("./lancedb.android-arm64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-android-arm64");
					const bindingPackageVersion = __require("@lancedb/lancedb-android-arm64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "arm") {
				try {
					return __require("./lancedb.android-arm-eabi.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-android-arm-eabi");
					const bindingPackageVersion = __require("@lancedb/lancedb-android-arm-eabi/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Android ${process.arch}`));
		} else if (process.platform === "win32") {
			if (process.arch === "x64") {
				if (process.config?.variables?.shlib_suffix === "dll.a" || process.config?.variables?.node_target_type === "shared_library") {
					try {
						return __require("./lancedb.win32-x64-gnu.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-win32-x64-gnu");
						const bindingPackageVersion = __require("@lancedb/lancedb-win32-x64-gnu/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				} else {
					try {
						return __require("./lancedb.win32-x64-msvc.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-win32-x64-msvc");
						const bindingPackageVersion = __require("@lancedb/lancedb-win32-x64-msvc/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				}
			} else if (process.arch === "ia32") {
				try {
					return __require("./lancedb.win32-ia32-msvc.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-win32-ia32-msvc");
					const bindingPackageVersion = __require("@lancedb/lancedb-win32-ia32-msvc/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "arm64") {
				try {
					return __require("./lancedb.win32-arm64-msvc.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-win32-arm64-msvc");
					const bindingPackageVersion = __require("@lancedb/lancedb-win32-arm64-msvc/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Windows: ${process.arch}`));
		} else if (process.platform === "darwin") {
			try {
				return __require("./lancedb.darwin-universal.node");
			} catch (e) {
				loadErrors.push(e);
			}
			try {
				const binding = __require("@lancedb/lancedb-darwin-universal");
				const bindingPackageVersion = __require("@lancedb/lancedb-darwin-universal/package.json").version;
				if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e) {
				loadErrors.push(e);
			}
			if (process.arch === "x64") {
				try {
					return __require("./lancedb.darwin-x64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-darwin-x64");
					const bindingPackageVersion = __require("@lancedb/lancedb-darwin-x64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "arm64") {
				try {
					return __require("./lancedb.darwin-arm64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-darwin-arm64");
					const bindingPackageVersion = __require("@lancedb/lancedb-darwin-arm64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on macOS: ${process.arch}`));
		} else if (process.platform === "freebsd") {
			if (process.arch === "x64") {
				try {
					return __require("./lancedb.freebsd-x64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-freebsd-x64");
					const bindingPackageVersion = __require("@lancedb/lancedb-freebsd-x64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "arm64") {
				try {
					return __require("./lancedb.freebsd-arm64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-freebsd-arm64");
					const bindingPackageVersion = __require("@lancedb/lancedb-freebsd-arm64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on FreeBSD: ${process.arch}`));
		} else if (process.platform === "linux") {
			if (process.arch === "x64") {
				if (isMusl()) {
					try {
						return __require("./lancedb.linux-x64-musl.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-x64-musl");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-x64-musl/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				} else {
					try {
						return __require("./lancedb.linux-x64-gnu.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-x64-gnu");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-x64-gnu/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				}
			} else if (process.arch === "arm64") {
				if (isMusl()) {
					try {
						return __require("./lancedb.linux-arm64-musl.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-arm64-musl");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-arm64-musl/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				} else {
					try {
						return __require("./lancedb.linux-arm64-gnu.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-arm64-gnu");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-arm64-gnu/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				}
			} else if (process.arch === "arm") {
				if (isMusl()) {
					try {
						return __require("./lancedb.linux-arm-musleabihf.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-arm-musleabihf");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-arm-musleabihf/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				} else {
					try {
						return __require("./lancedb.linux-arm-gnueabihf.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-arm-gnueabihf");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-arm-gnueabihf/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				}
			} else if (process.arch === "loong64") {
				if (isMusl()) {
					try {
						return __require("./lancedb.linux-loong64-musl.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-loong64-musl");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-loong64-musl/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				} else {
					try {
						return __require("./lancedb.linux-loong64-gnu.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-loong64-gnu");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-loong64-gnu/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				}
			} else if (process.arch === "riscv64") {
				if (isMusl()) {
					try {
						return __require("./lancedb.linux-riscv64-musl.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-riscv64-musl");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-riscv64-musl/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				} else {
					try {
						return __require("./lancedb.linux-riscv64-gnu.node");
					} catch (e) {
						loadErrors.push(e);
					}
					try {
						const binding = __require("@lancedb/lancedb-linux-riscv64-gnu");
						const bindingPackageVersion = __require("@lancedb/lancedb-linux-riscv64-gnu/package.json").version;
						if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
						return binding;
					} catch (e) {
						loadErrors.push(e);
					}
				}
			} else if (process.arch === "ppc64") {
				try {
					return __require("./lancedb.linux-ppc64-gnu.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-linux-ppc64-gnu");
					const bindingPackageVersion = __require("@lancedb/lancedb-linux-ppc64-gnu/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "s390x") {
				try {
					return __require("./lancedb.linux-s390x-gnu.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-linux-s390x-gnu");
					const bindingPackageVersion = __require("@lancedb/lancedb-linux-s390x-gnu/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Linux: ${process.arch}`));
		} else if (process.platform === "openharmony") {
			if (process.arch === "arm64") {
				try {
					return __require("./lancedb.openharmony-arm64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-openharmony-arm64");
					const bindingPackageVersion = __require("@lancedb/lancedb-openharmony-arm64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "x64") {
				try {
					return __require("./lancedb.openharmony-x64.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-openharmony-x64");
					const bindingPackageVersion = __require("@lancedb/lancedb-openharmony-x64/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else if (process.arch === "arm") {
				try {
					return __require("./lancedb.openharmony-arm.node");
				} catch (e) {
					loadErrors.push(e);
				}
				try {
					const binding = __require("@lancedb/lancedb-openharmony-arm");
					const bindingPackageVersion = __require("@lancedb/lancedb-openharmony-arm/package.json").version;
					if (bindingPackageVersion !== "0.38.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.38.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
					return binding;
				} catch (e) {
					loadErrors.push(e);
				}
			} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on OpenHarmony: ${process.arch}`));
		} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported OS: ${process.platform}, architecture: ${process.arch}`));
	}
	nativeBinding = requireNative();
	const forceWasi = process.env.NAPI_RS_FORCE_WASI === "true" || process.env.NAPI_RS_FORCE_WASI === "error";
	if (!nativeBinding || forceWasi) {
		let wasiBinding = null;
		let wasiBindingError = null;
		try {
			wasiBinding = __require("./lancedb.wasi.cjs");
			nativeBinding = wasiBinding;
		} catch (err) {
			if (forceWasi) wasiBindingError = err;
		}
		if (!nativeBinding || forceWasi) try {
			wasiBinding = __require("@lancedb/lancedb-wasm32-wasi");
			nativeBinding = wasiBinding;
		} catch (err) {
			if (forceWasi) {
				if (!wasiBindingError) wasiBindingError = err;
				else wasiBindingError.cause = err;
				loadErrors.push(err);
			}
		}
		if (process.env.NAPI_RS_FORCE_WASI === "error" && !wasiBinding) {
			const error = /* @__PURE__ */ new Error("WASI binding not found and NAPI_RS_FORCE_WASI is set to error");
			error.cause = wasiBindingError;
			throw error;
		}
	}
	if (!nativeBinding) {
		if (loadErrors.length > 0) throw new Error("Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.", { cause: loadErrors.reduce((err, cur) => {
			cur.cause = err;
			return cur;
		}) });
		throw new Error(`Failed to load native binding`);
	}
	module.exports = nativeBinding;
	module.exports.BranchContents = nativeBinding.BranchContents;
	module.exports.Branches = nativeBinding.Branches;
	module.exports.Connection = nativeBinding.Connection;
	module.exports.Index = nativeBinding.Index;
	module.exports.Job = nativeBinding.Job;
	module.exports.JsFullTextQuery = nativeBinding.JsFullTextQuery;
	module.exports.JsHeaderProvider = nativeBinding.JsHeaderProvider;
	module.exports.NapiScannable = nativeBinding.NapiScannable;
	module.exports.NativeMergeInsertBuilder = nativeBinding.NativeMergeInsertBuilder;
	module.exports.PermutationBuilder = nativeBinding.PermutationBuilder;
	module.exports.Query = nativeBinding.Query;
	module.exports.RecordBatchIterator = nativeBinding.RecordBatchIterator;
	module.exports.RrfReranker = nativeBinding.RrfReranker;
	module.exports.RRFReranker = nativeBinding.RRFReranker;
	module.exports.Session = nativeBinding.Session;
	module.exports.Table = nativeBinding.Table;
	module.exports.TagContents = nativeBinding.TagContents;
	module.exports.Tags = nativeBinding.Tags;
	module.exports.TakeQuery = nativeBinding.TakeQuery;
	module.exports.VectorQuery = nativeBinding.VectorQuery;
	module.exports.lancedbMetricsCatalog = nativeBinding.lancedbMetricsCatalog;
	module.exports.permutationBuilder = nativeBinding.permutationBuilder;
	module.exports.registerLancedbMetricsRecorder = nativeBinding.registerLancedbMetricsRecorder;
	module.exports.snapshotLancedbMetrics = nativeBinding.snapshotLancedbMetrics;
	module.exports.tokenize = nativeBinding.tokenize;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/query.js
var require_query = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BooleanQuery = exports.MultiMatchQuery = exports.BoostQuery = exports.PhraseQuery = exports.MatchQuery = exports.Occur = exports.Operator = exports.FullTextQueryType = exports.Query = exports.AutoQuery = exports.TakeQuery = exports.VectorQuery = exports.StandardQueryBase = exports.QueryBase = void 0;
	exports.RecordBatchIterator = RecordBatchIterator;
	exports.createAutoQuery = createAutoQuery;
	exports.instanceOfFullTextQuery = instanceOfFullTextQuery;
	const arrow_1 = require_arrow();
	const native_1 = require_native();
	async function* RecordBatchIterator(promisedInner) {
		const inner = await promisedInner;
		if (inner === void 0) throw new Error("Invalid iterator state");
		for (let buffer = await inner.next(); buffer; buffer = await inner.next()) {
			const { batches } = (0, arrow_1.tableFromIPC)(buffer);
			if (batches.length !== 1) throw new Error("Expected only one batch");
			yield batches[0];
		}
	}
	var RecordBatchIterable = class {
		inner;
		options;
		constructor(inner, options) {
			this.inner = inner;
			this.options = options;
		}
		[Symbol.asyncIterator]() {
			return RecordBatchIterator(this.inner.execute(this.options?.maxBatchLength, this.options?.timeoutMs));
		}
	};
	function nearestToNative(inner, vector) {
		const raw = Array.isArray(vector) ? null : (0, arrow_1.extractVectorBuffer)(vector);
		if (raw) return inner.nearestToRaw(raw.data, raw.dtype);
		return inner.nearestTo(Float32Array.from(vector));
	}
	function addQueryVectorToNative(inner, vector) {
		const raw = Array.isArray(vector) ? null : (0, arrow_1.extractVectorBuffer)(vector);
		if (raw) inner.addQueryVectorRaw(raw.data, raw.dtype);
		else inner.addQueryVector(Float32Array.from(vector));
	}
	/** Common methods supported by all query types
	*
	* @see {@link Query}
	* @see {@link VectorQuery}
	*
	* @hideconstructor
	*/
	var QueryBase = class {
		inner;
		/**
		* @hidden
		*/
		constructor(inner) {
			if (inner !== void 0) this.inner = inner;
		}
		/**
		* @hidden
		*/
		doCall(fn) {
			if (this.inner instanceof Promise) this.inner = this.inner.then((inner) => {
				fn(inner);
				return inner;
			});
			else fn(this.inner);
		}
		/**
		* Return the native query used by the next terminal operation.
		*
		* @hidden
		*/
		async getInner() {
			return this.inner;
		}
		/**
		* Return only the specified columns.
		*
		* By default a query will return all columns from the table.  However, this can have
		* a very significant impact on latency.  LanceDb stores data in a columnar fashion.  This
		* means we can finely tune our I/O to select exactly the columns we need.
		*
		* As a best practice you should always limit queries to the columns that you need.  If you
		* pass in an array of column names then only those columns will be returned.
		*
		* You can also use this method to create new "dynamic" columns based on your existing columns.
		* For example, you may not care about "a" or "b" but instead simply want "a + b".  This is often
		* seen in the SELECT clause of an SQL query (e.g. `SELECT a+b FROM my_table`).
		*
		* To create dynamic columns you can pass in a Map<string, string>.  A column will be returned
		* for each entry in the map.  The key provides the name of the column.  The value is
		* an SQL string used to specify how the column is calculated.
		*
		* For example, an SQL query might state `SELECT a + b AS combined, c`.  The equivalent
		* input to this method would be:
		* @example
		* new Map([["combined", "a + b"], ["c", "c"]])
		*
		* Columns will always be returned in the order given, even if that order is different than
		* the order used when adding the data.
		*
		* Note that you can pass in a `Record<string, string>` (e.g. an object literal). This method
		* uses `Object.entries` which should preserve the insertion order of the object.  However,
		* object insertion order is easy to get wrong and `Map` is more foolproof.
		*/
		select(columns) {
			const selectColumns = (columnArray) => {
				this.doCall((inner) => {
					inner.selectColumns(columnArray);
				});
			};
			const selectMapping = (columnTuples) => {
				this.doCall((inner) => {
					inner.select(columnTuples);
				});
			};
			if (typeof columns === "string") selectColumns([columns]);
			else if (Array.isArray(columns)) selectColumns(columns);
			else if (columns instanceof Map) selectMapping(Array.from(columns.entries()));
			else selectMapping(Object.entries(columns));
			return this;
		}
		/**
		* Whether to return the row id in the results.
		*
		* This column can be used to match results between different queries. For
		* example, to match results from a full text search and a vector search in
		* order to perform hybrid search.
		*/
		withRowId() {
			this.doCall((inner) => inner.withRowId());
			return this;
		}
		/**
		* @hidden
		*/
		async nativeExecute(options) {
			return (await this.getInner()).execute(options?.maxBatchLength, options?.timeoutMs);
		}
		/**
		* Execute the query and return the results as an @see {@link AsyncIterator}
		* of @see {@link RecordBatch}.
		*
		* By default, LanceDb will use many threads to calculate results and, when
		* the result set is large, multiple batches will be processed at one time.
		* This readahead is limited however and backpressure will be applied if this
		* stream is consumed slowly (this constrains the maximum memory used by a
		* single query)
		*
		*/
		execute(options) {
			return RecordBatchIterator(this.nativeExecute(options));
		}
		/**
		* @hidden
		*/
		[Symbol.asyncIterator]() {
			return RecordBatchIterator(this.nativeExecute());
		}
		/** Collect the results as an Arrow @see {@link ArrowTable}. */
		async toArrow(options) {
			const batches = [];
			const inner = await this.getInner();
			for await (const batch of new RecordBatchIterable(inner, options)) batches.push(batch);
			return new arrow_1.Table(batches);
		}
		/** Collect the results as an array of objects. */
		async toArray(options) {
			return (await this.toArrow(options)).toArray();
		}
		/**
		* Generates an explanation of the query execution plan.
		*
		* @example
		* import * as lancedb from "@lancedb/lancedb"
		* const db = await lancedb.connect("./.lancedb");
		* const table = await db.createTable("my_table", [
		*   { vector: [1.1, 0.9], id: "1" },
		* ]);
		* const plan = await table.query().nearestTo([0.5, 0.2]).explainPlan();
		*
		* @param verbose - If true, provides a more detailed explanation. Defaults to false.
		* @returns A Promise that resolves to a string containing the query execution plan explanation.
		*/
		async explainPlan(verbose = false) {
			return (await this.getInner()).explainPlan(verbose);
		}
		/**
		* Executes the query and returns the physical query plan annotated with runtime metrics.
		*
		* This is useful for debugging and performance analysis, as it shows how the query was executed
		* and includes metrics such as elapsed time, rows processed, and I/O statistics.
		*
		* @example
		* import * as lancedb from "@lancedb/lancedb"
		*
		* const db = await lancedb.connect("./.lancedb");
		* const table = await db.createTable("my_table", [
		*   { vector: [1.1, 0.9], id: "1" },
		* ]);
		*
		* const plan = await table.query().nearestTo([0.5, 0.2]).analyzePlan();
		*
		* Example output (with runtime metrics inlined):
		* AnalyzeExec verbose=true, metrics=[]
		*  ProjectionExec: expr=[id@3 as id, vector@0 as vector, _distance@2 as _distance], metrics=[output_rows=1, elapsed_compute=3.292µs]
		*   Take: columns="vector, _rowid, _distance, (id)", metrics=[output_rows=1, elapsed_compute=66.001µs, batches_processed=1, bytes_read=8, iops=1, requests=1]
		*    CoalesceBatchesExec: target_batch_size=1024, metrics=[output_rows=1, elapsed_compute=3.333µs]
		*     GlobalLimitExec: skip=0, fetch=10, metrics=[output_rows=1, elapsed_compute=167ns]
		*      FilterExec: _distance@2 IS NOT NULL, metrics=[output_rows=1, elapsed_compute=8.542µs]
		*       SortExec: TopK(fetch=10), expr=[_distance@2 ASC NULLS LAST], metrics=[output_rows=1, elapsed_compute=63.25µs, row_replacements=1]
		*        KNNVectorDistance: metric=l2, metrics=[output_rows=1, elapsed_compute=114.333µs, output_batches=1]
		*         LanceScan: uri=/path/to/data, projection=[vector], row_id=true, row_addr=false, ordered=false, metrics=[output_rows=1, elapsed_compute=103.626µs, bytes_read=549, iops=2, requests=2]
		*
		* @param distributedMetrics - How distributed worker metrics are displayed for remote query plans.
		* Defaults to `"aggregate"`.
		* @returns A query execution plan with runtime metrics for each step.
		*/
		async analyzePlan(distributedMetrics) {
			const distributedMetricsMode = distributedMetrics ?? "aggregate";
			return (await this.getInner()).analyzePlan(distributedMetricsMode);
		}
		/**
		* Returns the schema of the output that will be returned by this query.
		*
		* This can be used to inspect the types and names of the columns that will be
		* returned by the query before executing it.
		*
		* @returns An Arrow Schema describing the output columns.
		*/
		async outputSchema() {
			const schemaBuffer = await (await this.getInner()).outputSchema();
			return (0, arrow_1.tableFromIPC)(schemaBuffer).schema;
		}
	};
	exports.QueryBase = QueryBase;
	var StandardQueryBase = class extends QueryBase {
		constructor(inner) {
			super(inner);
		}
		/**
		* A filter statement to be applied to this query.
		*
		* The filter should be supplied as an SQL query string.  For example:
		* @example
		* x > 10
		* y > 0 AND y < 100
		* x > 5 OR y = 'test'
		*
		* Filtering performance can often be improved by creating a scalar index
		* on the filter column(s).
		*
		* Calling this multiple times combines the filters with a logical AND rather
		* than replacing the previous filter.
		*/
		where(predicate) {
			this.doCall((inner) => inner.onlyIf(predicate));
			return this;
		}
		/**
		* A filter statement to be applied to this query.
		* @see where
		* @deprecated Use `where` instead
		*/
		filter(predicate) {
			return this.where(predicate);
		}
		fullTextSearch(query, options) {
			let columns = null;
			if (options) {
				if (typeof options.columns === "string") columns = [options.columns];
				else if (Array.isArray(options.columns)) columns = options.columns;
			}
			this.doCall((inner) => {
				if (typeof query === "string") inner.fullTextSearch({
					query,
					columns
				});
				else inner.fullTextSearch({ query: query.inner });
			});
			return this;
		}
		/**
		* Set the maximum number of results to return.
		*
		* By default, a plain search has no limit.  If this method is not
		* called then every valid row from the table will be returned.
		*/
		limit(limit) {
			this.doCall((inner) => inner.limit(limit));
			return this;
		}
		/**
		* Set the number of rows to skip before returning results.
		*
		* This is useful for pagination.
		*/
		offset(offset) {
			this.doCall((inner) => inner.offset(offset));
			return this;
		}
		/**
		* Sort the results by the specified column(s).
		* @returns This query builder.
		*/
		orderBy(ordering) {
			const normalized = (Array.isArray(ordering) ? ordering : [ordering]).map((o) => ({
				columnName: o.columnName,
				ascending: o.ascending ?? true,
				nullsFirst: o.nullsFirst ?? false
			}));
			this.doCall((inner) => inner.orderBy(normalized));
			return this;
		}
		/**
		* Skip searching un-indexed data. This can make search faster, but will miss
		* any data that is not yet indexed.
		*
		* Use {@link Table#optimize} to index all un-indexed data.
		*/
		fastSearch() {
			this.doCall((inner) => inner.fastSearch());
			return this;
		}
		/**
		* Control MemWAL read routing for this query.
		*
		* By default (unset), when the table carries a MemWAL write spec (see
		* {@link Table#setLsmWriteSpec}), reads are routed through the LSM scanner so
		* they also return data written via the `mergeInsert` LSM path that has not yet
		* been compacted into the base table (the active/frozen in-memory memtables and
		* the flushed generations), deduplicated by primary key; a table without a spec
		* reads the base table.
		*
		* @param enable - `true` forces the LSM scanner and errors if the table has no
		* MemWAL write spec. `false` bypasses the MemWAL and reads the base table only,
		* even when a spec is present.
		*
		* Note: the LSM scanner does not support every query shape (e.g. reranking,
		* hybrid search, `orderBy`). On a MemWAL table those shapes error unless
		* `useLsm(false)` is set, because a base-only read would silently exclude
		* un-compacted MemWAL data.
		*/
		useLsm(enable) {
			this.doCall((inner) => inner.useLsm(enable));
			return this;
		}
	};
	exports.StandardQueryBase = StandardQueryBase;
	/**
	* A builder used to construct a vector search
	*
	* This builder can be reused to execute the query many times.
	*
	* @see {@link Query#nearestTo}
	*
	* @hideconstructor
	*/
	var VectorQuery = class VectorQuery extends StandardQueryBase {
		/**
		* @hidden
		*/
		constructor(inner) {
			super(inner);
		}
		/**
		* @hidden
		*/
		doVectorCall(fn) {
			super.doCall(fn);
		}
		/**
		* Set the number of partitions to search (probe)
		*
		* This argument is only used when the vector column has an IVF PQ index.
		* If there is no index then this value is ignored.
		*
		* The IVF stage of IVF PQ divides the input into partitions (clusters) of
		* related values.
		*
		* The partition whose centroids are closest to the query vector will be
		* exhaustiely searched to find matches.  This parameter controls how many
		* partitions should be searched.
		*
		* Increasing this value will increase the recall of your query but will
		* also increase the latency of your query.  The default value is 20.  This
		* default is good for many cases but the best value to use will depend on
		* your data and the recall that you need to achieve.
		*
		* For best results we recommend tuning this parameter with a benchmark against
		* your actual data to find the smallest possible value that will still give
		* you the desired recall.
		*
		* For more fine grained control over behavior when you have a very narrow filter
		* you can use `minimumNprobes` and `maximumNprobes`.  This method sets both
		* the minimum and maximum to the same value.
		*/
		nprobes(nprobes) {
			this.doVectorCall((inner) => inner.nprobes(nprobes));
			return this;
		}
		/**
		* Set the minimum number of probes used.
		*
		* This controls the minimum number of partitions that will be searched.  This
		* parameter will impact every query against a vector index, regardless of the
		* filter.  See `nprobes` for more details.  Higher values will increase recall
		* but will also increase latency.
		*/
		minimumNprobes(minimumNprobes) {
			this.doVectorCall((inner) => inner.minimumNprobes(minimumNprobes));
			return this;
		}
		/**
		* Set the maximum number of probes used.
		*
		* This controls the maximum number of partitions that will be searched.  If this
		* number is greater than minimumNprobes then the excess partitions will _only_ be
		* searched if we have not found enough results.  This can be useful when there is
		* a narrow filter to allow these queries to spend more time searching and avoid
		* potential false negatives.
		*/
		maximumNprobes(maximumNprobes) {
			this.doVectorCall((inner) => inner.maximumNprobes(maximumNprobes));
			return this;
		}
		distanceRange(lowerBound, upperBound) {
			this.doVectorCall((inner) => inner.distanceRange(lowerBound, upperBound));
			return this;
		}
		/**
		* Set the number of candidates to consider during the search
		*
		* This argument is only used when the vector column has an HNSW index.
		* If there is no index then this value is ignored.
		*
		* Increasing this value will increase the recall of your query but will
		* also increase the latency of your query. The default value is 1.5*limit.
		*/
		ef(ef) {
			this.doVectorCall((inner) => inner.ef(ef));
			return this;
		}
		/**
		* Set the vector column to query
		*
		* This controls which column is compared to the query vector supplied in
		* the call to @see {@link Query#nearestTo}
		*
		* This parameter must be specified if the table has more than one column
		* whose data type is a fixed-size-list of floats.
		*/
		column(column) {
			this.doVectorCall((inner) => inner.column(column));
			return this;
		}
		/**
		* Set the distance metric to use
		*
		* When performing a vector search we try and find the "nearest" vectors according
		* to some kind of distance metric.  This parameter controls which distance metric to
		* use.  See @see {@link IvfPqOptions.distanceType} for more details on the different
		* distance metrics available.
		*
		* Note: if there is a vector index then the distance type used MUST match the distance
		* type used to train the vector index.  If this is not done then the results will be
		* invalid.
		*
		* By default "l2" is used.
		*/
		distanceType(distanceType) {
			this.doVectorCall((inner) => inner.distanceType(distanceType));
			return this;
		}
		/**
		* A multiplier to control how many additional rows are taken during the refine step
		*
		* This argument is only used when the vector column has an IVF PQ index.
		* If there is no index then this value is ignored.
		*
		* An IVF PQ index stores compressed (quantized) values.  They query vector is compared
		* against these values and, since they are compressed, the comparison is inaccurate.
		*
		* This parameter can be used to refine the results.  It can improve both improve recall
		* and correct the ordering of the nearest results.
		*
		* To refine results LanceDb will first perform an ANN search to find the nearest
		* `limit` * `refine_factor` results.  In other words, if `refine_factor` is 3 and
		* `limit` is the default (10) then the first 30 results will be selected.  LanceDb
		* then fetches the full, uncompressed, values for these 30 results.  The results are
		* then reordered by the true distance and only the nearest 10 are kept.
		*
		* Note: there is a difference between calling this method with a value of 1 and never
		* calling this method at all.  Calling this method with any value will have an impact
		* on your search latency.  When you call this method with a `refine_factor` of 1 then
		* LanceDb still needs to fetch the full, uncompressed, values so that it can potentially
		* reorder the results.
		*
		* Note: if this method is NOT called then the distances returned in the _distance column
		* will be approximate distances based on the comparison of the quantized query vector
		* and the quantized result vectors.  This can be considerably different than the true
		* distance between the query vector and the actual uncompressed vector.
		*/
		refineFactor(refineFactor) {
			this.doVectorCall((inner) => inner.refineFactor(refineFactor));
			return this;
		}
		/**
		* If this is called then filtering will happen after the vector search instead of
		* before.
		*
		* By default filtering will be performed before the vector search.  This is how
		* filtering is typically understood to work.  This prefilter step does add some
		* additional latency.  Creating a scalar index on the filter column(s) can
		* often improve this latency.  However, sometimes a filter is too complex or scalar
		* indices cannot be applied to the column.  In these cases postfiltering can be
		* used instead of prefiltering to improve latency.
		*
		* Post filtering applies the filter to the results of the vector search.  This means
		* we only run the filter on a much smaller set of data.  However, it can cause the
		* query to return fewer than `limit` results (or even no results) if none of the nearest
		* results match the filter.
		*
		* Post filtering happens during the "refine stage" (described in more detail in
		* @see {@link VectorQuery#refineFactor}).  This means that setting a higher refine
		* factor can often help restore some of the results lost by post filtering.
		*/
		postfilter() {
			this.doVectorCall((inner) => inner.postfilter());
			return this;
		}
		/**
		* If this is called then any vector index is skipped
		*
		* An exhaustive (flat) search will be performed.  The query vector will
		* be compared to every vector in the table.  At high scales this can be
		* expensive.  However, this is often still useful.  For example, skipping
		* the vector index can give you ground truth results which you can use to
		* calculate your recall to select an appropriate value for nprobes.
		*/
		bypassVectorIndex() {
			this.doVectorCall((inner) => inner.bypassVectorIndex());
			return this;
		}
		addQueryVector(vector) {
			if (vector instanceof Promise) {
				const settledVector = vector.then((value) => ({
					status: "fulfilled",
					value
				}), (reason) => ({
					status: "rejected",
					reason
				}));
				const res = (async () => {
					const inner = await this.getInner();
					const outcome = await settledVector;
					if (outcome.status === "rejected") throw outcome.reason;
					addQueryVectorToNative(inner, outcome.value);
					return inner;
				})();
				return new VectorQuery(res);
			} else {
				this.doVectorCall((inner) => addQueryVectorToNative(inner, vector));
				return this;
			}
		}
		rerank(reranker) {
			this.doVectorCall((inner) => inner.rerank(async (args) => {
				const vecResults = await (0, arrow_1.fromBufferToRecordBatch)(args.vecResults);
				const ftsResults = await (0, arrow_1.fromBufferToRecordBatch)(args.ftsResults);
				const result = await reranker.rerankHybrid(args.query, vecResults, ftsResults);
				return (0, arrow_1.fromRecordBatchToBuffer)(result);
			}));
			return this;
		}
	};
	exports.VectorQuery = VectorQuery;
	/**
	* Create a string query whose vector/FTS routing is resolved against the active
	* table schema when the query executes.
	*
	* @hidden
	*/
	function createAutoQuery(table, query, columns, getVector) {
		let cachedPreparation;
		const snapshotRoute = async () => {
			const snapshot = await table.querySnapshot();
			return {
				table: snapshot,
				embeddingMetadata: (0, arrow_1.tableFromIPC)(await snapshot.schema()).schema.metadata.get("embedding_functions")
			};
		};
		const createInner = async () => {
			const route = await snapshotRoute();
			if (route.embeddingMetadata === void 0) {
				const inner = route.table.query();
				inner.fullTextSearch({
					query,
					columns
				});
				return inner;
			}
			const metadata = route.embeddingMetadata;
			if (cachedPreparation?.metadata !== metadata) cachedPreparation = {
				metadata,
				vector: Promise.resolve().then(() => getVector(metadata))
			};
			const preparation = cachedPreparation;
			let vector;
			try {
				vector = await preparation.vector;
			} catch (error) {
				if (cachedPreparation === preparation) cachedPreparation = void 0;
				throw error;
			}
			return nearestToNative(route.table.query(), vector);
		};
		return new AutoQuery(createInner);
	}
	/**
	* A query that returns a subset of the rows in the table.
	*
	* @hideconstructor
	*/
	var TakeQuery = class extends QueryBase {
		constructor(inner) {
			super(inner);
		}
		/**
		* Control MemWAL read routing for this take query.
		*
		* `false` bypasses the MemWAL and reads the base table only — the escape hatch,
		* since take-by-row-id/offset is not supported on the LSM scanner and, on a
		* MemWAL table, auto-routes to it and errors otherwise.
		*
		* @param enable - `false` reads the base table only.
		*/
		useLsm(enable) {
			this.doCall((inner) => inner.useLsm(enable));
			return this;
		}
	};
	exports.TakeQuery = TakeQuery;
	/**
	* A builder for automatic string searches.
	*
	* Automatic search determines whether to use full-text or vector search from
	* the table revision selected for each execution. This builder exposes the
	* common operations supported by both query families.
	*
	* @hideconstructor
	*/
	var AutoQuery = class extends StandardQueryBase {
		createInner;
		calls = [];
		/** @hidden */
		constructor(createInner) {
			super();
			this.createInner = createInner;
		}
		/** @hidden */
		doCall(fn) {
			this.calls.push(fn);
		}
		/** @hidden */
		async getInner() {
			const calls = [...this.calls];
			const inner = await this.createInner();
			for (const call of calls) call(inner);
			return inner;
		}
	};
	exports.AutoQuery = AutoQuery;
	/** A builder for LanceDB queries.
	*
	* @see {@link Table#query}, {@link Table#search}
	*
	* @hideconstructor
	*/
	var Query = class extends StandardQueryBase {
		/**
		* @hidden
		*/
		constructor(tbl) {
			super(tbl.query());
		}
		/**
		* Find the nearest vectors to the given query vector.
		*
		* This converts the query from a plain query to a vector query.
		*
		* This method will attempt to convert the input to the query vector
		* expected by the embedding model.  If the input cannot be converted
		* then an error will be thrown.
		*
		* By default, there is no embedding model, and the input should be
		* an array-like object of numbers (something that can be used as input
		* to Float32Array.from)
		*
		* If there is only one vector column (a column whose data type is a
		* fixed size list of floats) then the column does not need to be specified.
		* If there is more than one vector column you must use
		* @see {@link VectorQuery#column}  to specify which column you would like
		* to compare with.
		*
		* If no index has been created on the vector column then a vector query
		* will perform a distance comparison between the query vector and every
		* vector in the database and then sort the results.  This is sometimes
		* called a "flat search"
		*
		* For small databases, with a few hundred thousand vectors or less, this can
		* be reasonably fast.  In larger databases you should create a vector index
		* on the column.  If there is a vector index then an "approximate" nearest
		* neighbor search (frequently called an ANN search) will be performed.  This
		* search is much faster, but the results will be approximate.
		*
		* The query can be further parameterized using the returned builder.  There
		* are various ANN search parameters that will let you fine tune your recall
		* accuracy vs search latency.
		*
		* Vector searches always have a `limit`.  If `limit` has not been called then
		* a default `limit` of 10 will be used.  @see {@link Query#limit}
		*/
		nearestTo(vector) {
			const inner = this.inner;
			if (inner instanceof Promise) return new VectorQuery(inner.then(async (resolvedInner) => nearestToNative(resolvedInner, await vector)));
			if (vector instanceof Promise) return new VectorQuery(vector.then((resolvedVector) => nearestToNative(inner, resolvedVector)));
			return new VectorQuery(nearestToNative(inner, vector));
		}
		nearestToText(query, columns) {
			this.doCall((inner) => {
				if (typeof query === "string") inner.fullTextSearch({
					query,
					columns
				});
				else inner.fullTextSearch({ query: query.inner });
			});
			return this;
		}
	};
	exports.Query = Query;
	/**
	* Enum representing the types of full-text queries supported.
	*
	* - `Match`: Performs a full-text search for terms in the query string.
	* - `MatchPhrase`: Searches for an exact phrase match in the text.
	* - `Boost`: Boosts the relevance score of specific terms in the query.
	* - `MultiMatch`: Searches across multiple fields for the query terms.
	*/
	var FullTextQueryType;
	(function(FullTextQueryType) {
		FullTextQueryType["Match"] = "match";
		FullTextQueryType["MatchPhrase"] = "match_phrase";
		FullTextQueryType["Boost"] = "boost";
		FullTextQueryType["MultiMatch"] = "multi_match";
		FullTextQueryType["Boolean"] = "boolean";
	})(FullTextQueryType || (exports.FullTextQueryType = FullTextQueryType = {}));
	/**
	* Enum representing the logical operators used in full-text queries.
	*
	* - `And`: All terms must match.
	* - `Or`: At least one term must match.
	*/
	var Operator;
	(function(Operator) {
		Operator["And"] = "AND";
		Operator["Or"] = "OR";
	})(Operator || (exports.Operator = Operator = {}));
	/**
	* Enum representing the occurrence of terms in full-text queries.
	*
	* - `Must`: The term must be present in the document.
	* - `Should`: The term should contribute to the document score, but is not required.
	* - `MustNot`: The term must not be present in the document.
	*/
	var Occur;
	(function(Occur) {
		Occur["Should"] = "SHOULD";
		Occur["Must"] = "MUST";
		Occur["MustNot"] = "MUST_NOT";
	})(Occur || (exports.Occur = Occur = {}));
	function instanceOfFullTextQuery(obj) {
		return obj != null && obj.inner instanceof native_1.JsFullTextQuery;
	}
	var MatchQuery = class {
		/** @ignore */
		inner;
		/**
		* Creates an instance of MatchQuery.
		*
		* @param query - The text query to search for.
		* @param column - The name of the column to search within.
		* @param options - Optional parameters for the match query.
		*   - `boost`: The boost factor for the query (default is 1.0).
		*   - `fuzziness`: The fuzziness level for the query (default is 0).
		*   - `maxExpansions`: The maximum number of terms to consider for fuzzy matching (default is 50).
		*   - `operator`: The logical operator to use for combining terms in the query (default is "OR").
		*   - `prefixLength`: The number of beginning characters being unchanged for fuzzy matching.
		*/
		constructor(query, column, options) {
			let fuzziness = options?.fuzziness;
			if (fuzziness === void 0) fuzziness = 0;
			this.inner = native_1.JsFullTextQuery.matchQuery(query, column, options?.boost ?? 1, fuzziness, options?.maxExpansions ?? 50, options?.operator ?? Operator.Or, options?.prefixLength ?? 0);
		}
		queryType() {
			return FullTextQueryType.Match;
		}
	};
	exports.MatchQuery = MatchQuery;
	var PhraseQuery = class {
		/** @ignore */
		inner;
		/**
		* Creates an instance of `PhraseQuery`.
		*
		* @param query - The phrase to search for in the specified column.
		* @param column - The name of the column to search within.
		* @param options - Optional parameters for the phrase query.
		*   - `slop`: The maximum number of intervening unmatched positions allowed between words in the phrase (default is 0).
		*/
		constructor(query, column, options) {
			this.inner = native_1.JsFullTextQuery.phraseQuery(query, column, options?.slop ?? 0);
		}
		queryType() {
			return FullTextQueryType.MatchPhrase;
		}
	};
	exports.PhraseQuery = PhraseQuery;
	var BoostQuery = class {
		/** @ignore */
		inner;
		/**
		* Creates an instance of BoostQuery.
		* The boost returns documents that match the positive query,
		* but penalizes those that match the negative query.
		* the penalty is controlled by the `negativeBoost` parameter.
		*
		* @param positive - The positive query that boosts the relevance score.
		* @param negative - The negative query that reduces the relevance score.
		* @param options - Optional parameters for the boost query.
		*  - `negativeBoost`: The boost factor for the negative query (default is 0.0).
		*/
		constructor(positive, negative, options) {
			this.inner = native_1.JsFullTextQuery.boostQuery(positive.inner, negative.inner, options?.negativeBoost);
		}
		queryType() {
			return FullTextQueryType.Boost;
		}
	};
	exports.BoostQuery = BoostQuery;
	var MultiMatchQuery = class {
		/** @ignore */
		inner;
		/**
		* Creates an instance of MultiMatchQuery.
		*
		* @param query - The text query to search for across multiple columns.
		* @param columns - An array of column names to search within.
		* @param options - Optional parameters for the multi-match query.
		*  - `boosts`: An array of boost factors for each column (default is 1.0 for all).
		*  - `operator`: The logical operator to use for combining terms in the query (default is "OR").
		*/
		constructor(query, columns, options) {
			this.inner = native_1.JsFullTextQuery.multiMatchQuery(query, columns, options?.boosts, options?.operator ?? Operator.Or);
		}
		queryType() {
			return FullTextQueryType.MultiMatch;
		}
	};
	exports.MultiMatchQuery = MultiMatchQuery;
	var BooleanQuery = class {
		/** @ignore */
		inner;
		/**
		* Creates an instance of BooleanQuery.
		*
		* @param queries - An array of (Occur, FullTextQuery objects) to combine.
		* Occur specifies whether the query must match, or should match.
		*/
		constructor(queries) {
			this.inner = native_1.JsFullTextQuery.booleanQuery(queries.map(([occur, query]) => [occur, query.inner]));
		}
		queryType() {
			return FullTextQueryType.Boolean;
		}
	};
	exports.BooleanQuery = BooleanQuery;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TTLCache = void 0;
	exports.toSQL = toSQL;
	exports.packBits = packBits;
	function toSQL(value) {
		if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
		else if (typeof value === "number") return value.toString();
		else if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
		else if (value === null) return "NULL";
		else if (value instanceof Date) return `'${value.toISOString()}'`;
		else if (Array.isArray(value)) return `[${value.map(toSQL).join(", ")}]`;
		else if (Buffer.isBuffer(value)) return `X'${value.toString("hex")}'`;
		else if (value instanceof ArrayBuffer) return `X'${Buffer.from(value).toString("hex")}'`;
		else throw new Error(`Unsupported value type: ${typeof value} value: (${value})`);
	}
	function packBits(data) {
		const packed = Array(data.length >> 3).fill(0);
		for (let i = 0; i < data.length; i++) {
			const byte = i >> 3;
			const bit = i & 7;
			packed[byte] |= data[i] << bit;
		}
		return packed;
	}
	var TTLCache = class {
		ttl;
		cache;
		/**
		* @param ttl Time to live in milliseconds
		*/
		constructor(ttl) {
			this.ttl = ttl;
			this.cache = /* @__PURE__ */ new Map();
		}
		get(key) {
			const entry = this.cache.get(key);
			if (entry === void 0) return;
			if (entry.expires < Date.now()) {
				this.cache.delete(key);
				return;
			}
			return entry.value;
		}
		set(key, value) {
			this.cache.set(key, {
				value,
				expires: Date.now() + this.ttl
			});
		}
		delete(key) {
			this.cache.delete(key);
		}
	};
	exports.TTLCache = TTLCache;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/table.js
var require_table = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Branches = exports.LocalTable = exports.Table = void 0;
	const arrow_1 = require_arrow();
	const registry_1 = require_registry();
	const merge_1 = require_merge();
	const query_1 = require_query();
	const sanitize_1 = require_sanitize();
	const util_1 = require_util();
	/**
	* A Table is a collection of Records in a LanceDB Database.
	*
	* A Table object is expected to be long lived and reused for multiple operations.
	* Table objects will cache a certain amount of index data in memory.  This cache
	* will be freed when the Table is garbage collected.  To eagerly free the cache you
	* can call the `close` method.  Once the Table is closed, it cannot be used for any
	* further operations.
	*
	* Tables are created using the methods {@link Connection#createTable}
	* and {@link Connection#createEmptyTable}. Existing tables are opened
	* using {@link Connection#openTable}.
	*
	* Closing a table is optional.  It not closed, it will be closed when it is garbage
	* collected.
	*
	* @hideconstructor
	*/
	var Table = class {
		[Symbol.for("nodejs.util.inspect.custom")]() {
			return this.display();
		}
	};
	exports.Table = Table;
	var LocalTable = class extends Table {
		inner;
		constructor(inner) {
			super();
			this.inner = inner;
		}
		get name() {
			return this.inner.name;
		}
		isOpen() {
			return this.inner.isOpen();
		}
		close() {
			this.inner.close();
		}
		display() {
			return this.inner.display();
		}
		async getEmbeddingFunctions(inner = this.inner) {
			const schemaBuf = await inner.schema();
			const schema = (0, arrow_1.tableFromIPC)(schemaBuf).schema;
			return (0, registry_1.getRegistry)().parseFunctions(schema.metadata);
		}
		/** Get the schema of the table. */
		async schema() {
			const schemaBuf = await this.inner.schema();
			return (0, arrow_1.tableFromIPC)(schemaBuf).schema;
		}
		async add(data, options) {
			const mode = options?.mode ?? "append";
			const schema = await this.schema();
			const buffer = await (0, arrow_1.fromDataToBuffer)(data, void 0, schema);
			const userProgress = options?.progress;
			const progress = userProgress ? (p) => {
				try {
					userProgress(p);
				} catch (e) {
					console.warn("Table.add progress callback threw:", e);
				}
			} : void 0;
			return await this.inner.add(buffer, mode, progress);
		}
		async update(optsOrUpdates, options) {
			const isValues = "values" in optsOrUpdates && typeof optsOrUpdates.values !== "string";
			const isValuesSql = "valuesSql" in optsOrUpdates && typeof optsOrUpdates.valuesSql !== "string";
			const isMap = (obj) => {
				return obj instanceof Map;
			};
			let predicate;
			let columns;
			switch (true) {
				case isMap(optsOrUpdates):
					columns = Array.from(optsOrUpdates.entries());
					predicate = options?.where;
					break;
				case isValues && isMap(optsOrUpdates.values):
					columns = Array.from(optsOrUpdates.values.entries()).map(([k, v]) => [k, (0, util_1.toSQL)(v)]);
					predicate = optsOrUpdates.where;
					break;
				case isValues && !isMap(optsOrUpdates.values):
					columns = Object.entries(optsOrUpdates.values).map(([k, v]) => [k, (0, util_1.toSQL)(v)]);
					predicate = optsOrUpdates.where;
					break;
				case isValuesSql && isMap(optsOrUpdates.valuesSql):
					columns = Array.from(optsOrUpdates.valuesSql.entries());
					predicate = optsOrUpdates.where;
					break;
				case isValuesSql && !isMap(optsOrUpdates.valuesSql):
					columns = Object.entries(optsOrUpdates.valuesSql).map(([k, v]) => [k, v]);
					predicate = optsOrUpdates.where;
					break;
				default:
					columns = Object.entries(optsOrUpdates);
					predicate = options?.where;
			}
			return await this.inner.update(predicate, columns);
		}
		async countRows(filter) {
			return await this.inner.countRows(filter);
		}
		async delete(predicate) {
			return await this.inner.delete(predicate);
		}
		async createIndex(column, options) {
			const nativeIndex = options?.config?.inner;
			await this.inner.createIndex(nativeIndex, column, options?.replace, options?.waitTimeoutSeconds, options?.name, options?.train);
		}
		async createIndexAsync(column, options) {
			const nativeIndex = options?.config?.inner;
			return await this.inner.createIndexAsync(nativeIndex, column, options?.replace, options?.waitTimeoutSeconds, options?.name, options?.train);
		}
		async dropIndex(name) {
			await this.inner.dropIndex(name);
		}
		async prewarmIndex(name) {
			await this.inner.prewarmIndex(name);
		}
		async prewarmData(columns) {
			await this.inner.prewarmData(columns);
		}
		async waitForIndex(indexNames, timeoutSeconds) {
			await this.inner.waitForIndex(indexNames, timeoutSeconds);
		}
		takeOffsets(offsets) {
			return new query_1.TakeQuery(this.inner.takeOffsets(offsets));
		}
		takeRowIds(rowIds) {
			const ids = rowIds.map((id) => {
				if (typeof id === "bigint") return id;
				if (!Number.isInteger(id)) throw new Error("Row id must be an integer (or bigint)");
				if (id < 0) throw new Error("Row id cannot be negative");
				if (!Number.isSafeInteger(id)) throw new Error("Row id is too large for number; use bigint instead");
				return BigInt(id);
			});
			return new query_1.TakeQuery(this.inner.takeRowIds(ids));
		}
		query() {
			return new query_1.Query(this.inner);
		}
		search(query, queryType = "auto", ftsColumns) {
			if (typeof query !== "string" && !(0, query_1.instanceOfFullTextQuery)(query)) {
				if (queryType === "fts") throw new Error("Cannot perform full text search on a vector query");
				return this.vectorSearch(query);
			}
			if (queryType === "fts") return this.query().fullTextSearch(query, { columns: ftsColumns });
			if (queryType === "auto") {
				if ((0, query_1.instanceOfFullTextQuery)(query)) return this.query().fullTextSearch(query, { columns: ftsColumns });
				const columns = typeof ftsColumns === "string" ? [ftsColumns] : ftsColumns ?? null;
				return (0, query_1.createAutoQuery)(this.inner, query, columns, async (metadata) => {
					const embeddingFunc = (await (0, registry_1.getRegistry)().parseFunctions(/* @__PURE__ */ new Map([["embedding_functions", metadata]]))).values().next().value;
					if (!embeddingFunc) throw new Error("Invalid embedding function metadata");
					return await embeddingFunc.function.computeQueryEmbeddings(query);
				});
			}
			const queryPromise = this.getEmbeddingFunctions().then(async (functions) => {
				const embeddingFunc = functions.values().next().value;
				if (!embeddingFunc) return Promise.reject(/* @__PURE__ */ new Error("No embedding functions are defined in the table"));
				return await embeddingFunc.function.computeQueryEmbeddings(query);
			});
			return this.query().nearestTo(queryPromise);
		}
		vectorSearch(vector) {
			if ((0, arrow_1.isMultiVector)(vector)) {
				const query = this.query().nearestTo(vector[0]);
				for (const v of vector.slice(1)) query.addQueryVector(v);
				return query;
			}
			return this.query().nearestTo(vector);
		}
		async addColumns(newColumnTransforms) {
			if (typeof newColumnTransforms === "object" && !Array.isArray(newColumnTransforms) && "computed" in newColumnTransforms) return await this.inner.addComputedColumns(newColumnTransforms.computed);
			if (newColumnTransforms instanceof arrow_1.Field) newColumnTransforms = [newColumnTransforms];
			if (Array.isArray(newColumnTransforms) && newColumnTransforms.length > 0 && newColumnTransforms[0] instanceof arrow_1.Field) {
				const fields = newColumnTransforms;
				newColumnTransforms = new arrow_1.Schema(fields);
			}
			if (newColumnTransforms instanceof arrow_1.Schema) {
				const schema = newColumnTransforms;
				const emptyTable = (0, arrow_1.makeEmptyTable)(schema);
				const schemaBuf = await (0, arrow_1.fromTableToBuffer)(emptyTable);
				return await this.inner.addColumnsWithSchema(schemaBuf);
			}
			if (Array.isArray(newColumnTransforms)) return await this.inner.addColumns(newColumnTransforms);
			throw new Error("Invalid input type for addColumns");
		}
		async refreshColumn(column) {
			return await this.inner.refreshColumn(column);
		}
		async refreshColumnAsync(column) {
			return await this.inner.refreshColumnAsync(column);
		}
		async refreshMaterializedView(full, sourceVersion) {
			return await this.inner.refreshMaterializedView(full, sourceVersion);
		}
		async alterColumns(columnAlterations) {
			const processedAlterations = columnAlterations.map((alteration) => {
				if (typeof alteration.dataType === "string") return {
					...alteration,
					dataType: JSON.stringify({ type: alteration.dataType })
				};
				else if (alteration.dataType === void 0) return {
					...alteration,
					dataType: void 0
				};
				else {
					const dataType = (0, sanitize_1.sanitizeType)(alteration.dataType);
					return {
						...alteration,
						dataType: JSON.stringify((0, arrow_1.dataTypeToJson)(dataType))
					};
				}
			});
			return await this.inner.alterColumns(processedAlterations);
		}
		async updateFieldMetadata(updates) {
			return await this.inner.updateFieldMetadata(updates);
		}
		async dropColumns(columnNames) {
			return await this.inner.dropColumns(columnNames);
		}
		async setUnenforcedPrimaryKey(columns) {
			const cols = typeof columns === "string" ? [columns] : columns;
			return await this.inner.setUnenforcedPrimaryKey(cols);
		}
		async setLsmWriteSpec(spec) {
			return await this.inner.setLsmWriteSpec(spec);
		}
		async unsetLsmWriteSpec() {
			return await this.inner.unsetLsmWriteSpec();
		}
		async getLsmWriteSpec() {
			return await this.inner.getLsmWriteSpec() ?? void 0;
		}
		async closeLsmWriters() {
			return await this.inner.closeLsmWriters();
		}
		async flushLsm() {
			return await this.inner.flushLsm();
		}
		async compactLsm() {
			return await this.inner.compactLsm();
		}
		async checkpointLsm() {
			return await this.inner.checkpointLsm();
		}
		async getLsmStats(includeGenerationRows = false) {
			return await this.inner.getLsmStats(includeGenerationRows) ?? void 0;
		}
		async version() {
			return await this.inner.version();
		}
		async checkout(version) {
			if (typeof version === "string") return this.inner.checkoutTag(version);
			return this.inner.checkout(version);
		}
		async checkoutLatest() {
			await this.inner.checkoutLatest();
		}
		async listVersions() {
			return (await this.inner.listVersions()).map((version) => ({
				version: version.version,
				timestamp: /* @__PURE__ */ new Date(version.timestamp / 1e3),
				metadata: version.metadata
			}));
		}
		async restore() {
			await this.inner.restore();
		}
		async tags() {
			return await this.inner.tags();
		}
		async branches() {
			return new Branches(await this.inner.branches());
		}
		currentBranch() {
			return this.inner.currentBranch() ?? null;
		}
		async optimize(options) {
			let cleanupOlderThanMs;
			if (options?.cleanupOlderThan !== void 0 && options?.cleanupOlderThan !== null) cleanupOlderThanMs = (/* @__PURE__ */ new Date()).getTime() - options.cleanupOlderThan.getTime();
			return await this.inner.optimize(cleanupOlderThanMs, options?.deleteUnverified);
		}
		async listIndices() {
			return await this.inner.listIndices();
		}
		async tokenize(query, options) {
			return await this.inner.tokenize(query, options?.column, options?.indexName);
		}
		async toArrow() {
			return await this.query().toArrow();
		}
		async indexStats(name) {
			const stats = await this.inner.indexStats(name);
			if (stats === null) return;
			return stats;
		}
		async stats() {
			return await this.inner.stats();
		}
		async initialStorageOptions() {
			return await this.inner.initialStorageOptions();
		}
		async latestStorageOptions() {
			return await this.inner.latestStorageOptions();
		}
		mergeInsert(on) {
			on = Array.isArray(on) ? on : [on];
			return new merge_1.MergeInsertBuilder(this.inner.mergeInsert(on), this.schema());
		}
		/**
		* Check if the table uses the new manifest path scheme.
		*
		* This function will return true if the table uses the V2 manifest
		* path scheme.
		*/
		async usesV2ManifestPaths() {
			return await this.inner.usesV2ManifestPaths();
		}
		/**
		* Migrate the table to use the new manifest path scheme.
		*
		* This function will rename all V1 manifests to V2 manifest paths.
		* These paths provide more efficient opening of datasets with many versions
		* on object stores.
		*
		* This function is idempotent, and can be run multiple times without
		* changing the state of the object store.
		*
		* However, it should not be run while other concurrent operations are happening.
		* And it should also run until completion before resuming other operations.
		*/
		async migrateManifestPathsV2() {
			await this.inner.migrateManifestPathsV2();
		}
	};
	exports.LocalTable = LocalTable;
	/**
	* Branch manager for a {@link Table}.
	*
	* Unlike tags, `create` and `checkout` return a new {@link Table} handle scoped
	* to the branch; writes on it do not affect `main`.
	*/
	var Branches = class {
		#inner;
		/**
		* Construct a Branches manager. Internal use only.
		* @hidden
		*/
		constructor(inner) {
			this.#inner = inner;
		}
		/** List all branches, mapping name to branch metadata. */
		async list() {
			return await this.#inner.list();
		}
		/**
		* Create a branch and return a handle scoped to it.
		*
		* @param name Name of the new branch.
		* @param fromRef Source branch to fork from. Defaults to `main`.
		* @param fromVersion A specific version on `fromRef`. Defaults to latest.
		*/
		async create(name, fromRef, fromVersion) {
			return new LocalTable(await this.#inner.create(name, fromRef, fromVersion));
		}
		/**
		* Check out an existing branch and return a handle scoped to it.
		*
		* With `version` set, the returned handle is pinned to that version of the
		* branch (a read-only, detached view); otherwise it tracks the branch's
		* latest and stays writable.
		*/
		async checkout(name, version) {
			return new LocalTable(await this.#inner.checkout(name, version));
		}
		/** Delete a branch. */
		async delete(name) {
			return await this.#inner.delete(name);
		}
		/** Compare a branch against main without modifying either branch. */
		async diff(fromBranch) {
			return await this.#inner.diff(fromBranch);
		}
		/**
		* Cherry-pick a branch onto main.
		*
		* Set `dryRun` to `true` to preview. A failed cherry-pick resolves
		* with `status: "failed"` instead of throwing.
		*
		* @param fromBranch Branch to cherry-pick from.
		* @param dryRun When true, only preview. Defaults to false.
		*/
		async cherryPick(fromBranch, dryRun = false) {
			return await this.#inner.cherryPick(fromBranch, dryRun);
		}
	};
	exports.Branches = Branches;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/connection.js
var require_connection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LocalConnection = exports.Connection = void 0;
	exports.cleanseStorageOptions = cleanseStorageOptions;
	const apache_arrow_1 = __require("apache-arrow");
	const arrow_1 = require_arrow();
	const arrow_2 = require_arrow();
	const registry_1 = require_registry();
	const materialized_view_1 = require_materialized_view();
	const sanitize_1 = require_sanitize();
	const table_1 = require_table();
	/**
	* A LanceDB Connection that allows you to open tables and create new ones.
	*
	* Connection could be local against filesystem or remote against a server.
	*
	* A Connection is intended to be a long lived object and may hold open
	* resources such as HTTP connection pools.  This is generally fine and
	* a single connection should be shared if it is going to be used many
	* times. However, if you are finished with a connection, you may call
	* close to eagerly free these resources.  Any call to a Connection
	* method after it has been closed will result in an error.
	*
	* Closing a connection is optional.  Connections will automatically
	* be closed when they are garbage collected.
	*
	* Any created tables are independent and will continue to work even if
	* the underlying connection has been closed.
	* @hideconstructor
	*/
	var Connection = class {
		[Symbol.for("nodejs.util.inspect.custom")]() {
			return this.display();
		}
	};
	exports.Connection = Connection;
	/** @hideconstructor */
	var LocalConnection = class extends Connection {
		inner;
		/** @hidden */
		constructor(inner) {
			super();
			this.inner = inner;
		}
		isOpen() {
			return this.inner.isOpen();
		}
		close() {
			this.inner.close();
		}
		display() {
			return this.inner.display();
		}
		async tableNames(namespacePathOrOptions, options) {
			let namespacePath;
			let tableNamesOptions;
			if (Array.isArray(namespacePathOrOptions)) {
				namespacePath = namespacePathOrOptions;
				tableNamesOptions = options;
			} else {
				namespacePath = void 0;
				tableNamesOptions = namespacePathOrOptions;
			}
			return this.inner.tableNames(namespacePath ?? [], tableNamesOptions?.startAfter, tableNamesOptions?.limit);
		}
		async createMaterializedView(name, source, options) {
			(0, materialized_view_1.validateNonNegativeInteger)(options?.limit, "limit");
			const innerTable = await this.inner.createMaterializedView(name, source, (0, materialized_view_1.normalizeSelect)(options?.select), options?.where, options?.limit);
			return new materialized_view_1.MaterializedView(new table_1.LocalTable(innerTable));
		}
		async openMaterializedView(name) {
			const innerTable = await this.inner.openMaterializedView(name);
			return new materialized_view_1.MaterializedView(new table_1.LocalTable(innerTable));
		}
		async listMaterializedViews() {
			return await this.inner.listMaterializedViews();
		}
		async listTables(namespacePathOrOptions, options) {
			const namespacePath = Array.isArray(namespacePathOrOptions) ? namespacePathOrOptions : void 0;
			const listTablesOptions = Array.isArray(namespacePathOrOptions) ? options : namespacePathOrOptions;
			return this.inner.listTables(namespacePath ?? [], listTablesOptions?.pageToken, listTablesOptions?.limit);
		}
		async openTable(name, namespacePath, options) {
			const innerTable = await this.inner.openTable(name, namespacePath ?? [], cleanseStorageOptions(options?.storageOptions), options?.indexCacheSize);
			let table = new table_1.LocalTable(innerTable);
			const branch = options?.branch != null && options.branch !== "main" ? options.branch : void 0;
			if (branch != null) table = await (await table.branches()).checkout(branch, options?.version);
			else if (options?.version != null) await table.checkout(options.version);
			return table;
		}
		async cloneTable(targetTableName, sourceUri, options) {
			const innerTable = await this.inner.cloneTable(targetTableName, sourceUri, options?.targetNamespacePath ?? [], options?.sourceVersion ?? null, options?.sourceTag ?? null, options?.isShallow ?? true);
			return new table_1.LocalTable(innerTable);
		}
		getStorageOptions(options) {
			if (options?.dataStorageVersion !== void 0) {
				if (options.storageOptions === void 0) options.storageOptions = {};
				options.storageOptions["newTableDataStorageVersion"] = options.dataStorageVersion;
			}
			if (options?.enableV2ManifestPaths !== void 0) {
				if (options.storageOptions === void 0) options.storageOptions = {};
				options.storageOptions["newTableEnableV2ManifestPaths"] = options.enableV2ManifestPaths ? "true" : "false";
			}
			return cleanseStorageOptions(options?.storageOptions);
		}
		async createTable(nameOrOptions, dataOrNamespacePath, namespacePathOrOptions, options) {
			if (typeof nameOrOptions !== "string" && "name" in nameOrOptions) {
				const { name, data, ...createOptions } = nameOrOptions;
				const namespacePath = dataOrNamespacePath;
				return this._createTableImpl(name, data, namespacePath, createOptions);
			}
			const name = nameOrOptions;
			const data = dataOrNamespacePath;
			let namespacePath;
			let createOptions;
			if (Array.isArray(namespacePathOrOptions)) {
				namespacePath = namespacePathOrOptions;
				createOptions = options;
			} else {
				namespacePath = void 0;
				createOptions = namespacePathOrOptions;
			}
			return this._createTableImpl(name, data, namespacePath, createOptions);
		}
		async _createTableImpl(name, data, namespacePath, options) {
			if (data === void 0) throw new Error("data is required");
			const { buf, mode } = await parseTableData(data, options);
			const storageOptions = this.getStorageOptions(options);
			const innerTable = await this.inner.createTable(name, buf, mode, namespacePath ?? [], storageOptions);
			return new table_1.LocalTable(innerTable);
		}
		async createEmptyTable(name, schema, namespacePathOrOptions, options) {
			let namespacePath;
			let createOptions;
			if (Array.isArray(namespacePathOrOptions)) {
				namespacePath = namespacePathOrOptions;
				createOptions = options;
			} else {
				namespacePath = void 0;
				createOptions = namespacePathOrOptions;
			}
			let mode = createOptions?.mode ?? "create";
			const existOk = createOptions?.existOk ?? false;
			if (mode === "create" && existOk) mode = "exist_ok";
			let metadata = void 0;
			if (createOptions?.embeddingFunction !== void 0) {
				const embeddingFunction = createOptions.embeddingFunction;
				metadata = (0, registry_1.getRegistry)().getTableMetadata([embeddingFunction]);
			}
			const storageOptions = this.getStorageOptions(createOptions);
			const table = (0, arrow_2.makeEmptyTable)(schema, metadata);
			const buf = await (0, arrow_2.fromTableToBuffer)(table);
			const innerTable = await this.inner.createEmptyTable(name, buf, mode, namespacePath ?? [], storageOptions);
			return new table_1.LocalTable(innerTable);
		}
		async dropTable(name, namespacePath) {
			return this.inner.dropTable(name, namespacePath ?? []);
		}
		async dropTableAsync(name, namespacePath) {
			return this.inner.dropTableAsync(name, namespacePath ?? []);
		}
		async dropAllTables(namespacePath) {
			return this.inner.dropAllTables(namespacePath ?? []);
		}
		describeNamespace(namespacePath) {
			return this.inner.describeNamespace(namespacePath);
		}
		listNamespaces(namespacePath, options) {
			return this.inner.listNamespaces(namespacePath ?? [], options?.pageToken, options?.limit);
		}
		createNamespace(namespacePath, options) {
			return this.inner.createNamespace(namespacePath, options?.mode, options?.properties);
		}
		dropNamespace(namespacePath, options) {
			return this.inner.dropNamespace(namespacePath, options?.mode, options?.behavior);
		}
		async renameTable(currentName, newName, options) {
			return this.inner.renameTable(currentName, newName, options?.namespacePath ?? [], options?.newNamespacePath);
		}
		job(jobId) {
			return this.inner.job(jobId);
		}
		async listJobs() {
			return this.inner.listJobs();
		}
		async getJob(jobId) {
			return this.inner.getJob(jobId);
		}
		async cancelJob(jobId) {
			return this.inner.cancelJob(jobId);
		}
		async jobHistory(jobId) {
			const buf = await this.inner.jobHistory(jobId);
			if (buf.length === 0) return new arrow_2.Table();
			return (0, apache_arrow_1.tableFromIPC)(buf);
		}
	};
	exports.LocalConnection = LocalConnection;
	/**
	* Takes storage options and makes all the keys snake case.
	*/
	function cleanseStorageOptions(options) {
		if (options === void 0) return;
		const result = {};
		for (const [key, value] of Object.entries(options)) if (value !== void 0) {
			const newKey = camelToSnakeCase(key);
			result[newKey] = value;
		}
		return result;
	}
	/**
	* Convert a string to snake case. It might already be snake case, in which case it is
	* returned unchanged.
	*/
	function camelToSnakeCase(camel) {
		if (camel.includes("_")) return camel;
		if (camel.toLocaleUpperCase() === camel) return camel;
		let result = camel.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
		if (result.startsWith("_")) result = result.slice(1);
		return result;
	}
	async function parseTableData(data, options, streaming = false) {
		let mode = options?.mode ?? "create";
		const existOk = options?.existOk ?? false;
		if (mode === "create" && existOk) mode = "exist_ok";
		let table;
		if ((0, arrow_1.isArrowTable)(data)) table = (0, sanitize_1.sanitizeTable)(data);
		else table = (0, arrow_1.makeArrowTable)(data, options);
		if (streaming) return {
			buf: await (0, arrow_1.fromTableToStreamBuffer)(table, options?.embeddingFunction, options?.schema),
			mode
		};
		else return {
			buf: await (0, arrow_2.fromTableToBuffer)(table, options?.embeddingFunction, options?.schema),
			mode
		};
	}
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/version.js
var VERSION;
var init_version = __esmMin((() => {
	VERSION = "1.9.1";
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/internal/semver.js
/**
* Create a function to test an API version to see if it is compatible with the provided ownVersion.
*
* The returned function has the following semantics:
* - Exact match is always compatible
* - Major versions must match exactly
*    - 1.x package cannot use global 2.x package
*    - 2.x package cannot use global 1.x package
* - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
*    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
*    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
* - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
* - Patch and build tag differences are not considered at this time
*
* @param ownVersion version which should be checked against
*/
function _makeCompatibilityCheck(ownVersion) {
	const acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
	const rejectedVersions = /* @__PURE__ */ new Set();
	const myVersionMatch = ownVersion.match(re);
	if (!myVersionMatch) return () => false;
	const ownVersionParsed = {
		major: +myVersionMatch[1],
		minor: +myVersionMatch[2],
		patch: +myVersionMatch[3],
		prerelease: myVersionMatch[4]
	};
	if (ownVersionParsed.prerelease != null) return function isExactmatch(globalVersion) {
		return globalVersion === ownVersion;
	};
	function _reject(v) {
		rejectedVersions.add(v);
		return false;
	}
	function _accept(v) {
		acceptedVersions.add(v);
		return true;
	}
	return function isCompatible(globalVersion) {
		if (acceptedVersions.has(globalVersion)) return true;
		if (rejectedVersions.has(globalVersion)) return false;
		const globalVersionMatch = globalVersion.match(re);
		if (!globalVersionMatch) return _reject(globalVersion);
		const globalVersionParsed = {
			major: +globalVersionMatch[1],
			minor: +globalVersionMatch[2],
			patch: +globalVersionMatch[3],
			prerelease: globalVersionMatch[4]
		};
		if (globalVersionParsed.prerelease != null) return _reject(globalVersion);
		if (ownVersionParsed.major !== globalVersionParsed.major) return _reject(globalVersion);
		if (ownVersionParsed.major === 0) {
			if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) return _accept(globalVersion);
			return _reject(globalVersion);
		}
		if (ownVersionParsed.minor <= globalVersionParsed.minor) return _accept(globalVersion);
		return _reject(globalVersion);
	};
}
var re, isCompatible;
var init_semver = __esmMin((() => {
	init_version();
	re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
	isCompatible = _makeCompatibilityCheck(VERSION);
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/internal/global-utils.js
function registerGlobal(type, instance, diag, allowOverride = false) {
	var _a;
	const api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : { version: VERSION };
	if (!allowOverride && api[type]) {
		const err = /* @__PURE__ */ new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
		diag.error(err.stack || err.message);
		return false;
	}
	if (api.version !== "1.9.1") {
		const err = /* @__PURE__ */ new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${VERSION}`);
		diag.error(err.stack || err.message);
		return false;
	}
	api[type] = instance;
	diag.debug(`@opentelemetry/api: Registered a global for ${type} v${VERSION}.`);
	return true;
}
function getGlobal(type) {
	var _a, _b;
	const globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
	if (!globalVersion || !isCompatible(globalVersion)) return;
	return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
	diag.debug(`@opentelemetry/api: Unregistering a global for ${type} v${VERSION}.`);
	const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
	if (api) delete api[type];
}
var major, GLOBAL_OPENTELEMETRY_API_KEY, _global;
var init_global_utils = __esmMin((() => {
	init_version();
	init_semver();
	major = VERSION.split(".")[0];
	GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`);
	_global = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/diag/ComponentLogger.js
function logProxy(funcName, namespace, args) {
	const logger = getGlobal("diag");
	if (!logger) return;
	return logger[funcName](namespace, ...args);
}
var DiagComponentLogger;
var init_ComponentLogger = __esmMin((() => {
	init_global_utils();
	DiagComponentLogger = class {
		constructor(props) {
			this._namespace = props.namespace || "DiagComponentLogger";
		}
		debug(...args) {
			return logProxy("debug", this._namespace, args);
		}
		error(...args) {
			return logProxy("error", this._namespace, args);
		}
		info(...args) {
			return logProxy("info", this._namespace, args);
		}
		warn(...args) {
			return logProxy("warn", this._namespace, args);
		}
		verbose(...args) {
			return logProxy("verbose", this._namespace, args);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/diag/types.js
var DiagLogLevel;
var init_types = __esmMin((() => {
	(function(DiagLogLevel) {
		/** Diagnostic Logging level setting to disable all logging (except and forced logs) */
		DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
		/** Identifies an error scenario */
		DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
		/** Identifies a warning scenario */
		DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
		/** General informational log message */
		DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
		/** General debug log message */
		DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
		/**
		* Detailed trace level logging should only be used for development, should only be set
		* in a development environment.
		*/
		DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
		/** Used to set the logging level to include all logging */
		DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
	})(DiagLogLevel || (DiagLogLevel = {}));
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/diag/internal/logLevelLogger.js
function createLogLevelDiagLogger(maxLevel, logger) {
	if (maxLevel < DiagLogLevel.NONE) maxLevel = DiagLogLevel.NONE;
	else if (maxLevel > DiagLogLevel.ALL) maxLevel = DiagLogLevel.ALL;
	logger = logger || {};
	function _filterFunc(funcName, theLevel) {
		const theFunc = logger[funcName];
		if (typeof theFunc === "function" && maxLevel >= theLevel) return theFunc.bind(logger);
		return function() {};
	}
	return {
		error: _filterFunc("error", DiagLogLevel.ERROR),
		warn: _filterFunc("warn", DiagLogLevel.WARN),
		info: _filterFunc("info", DiagLogLevel.INFO),
		debug: _filterFunc("debug", DiagLogLevel.DEBUG),
		verbose: _filterFunc("verbose", DiagLogLevel.VERBOSE)
	};
}
var init_logLevelLogger = __esmMin((() => {
	init_types();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/api/diag.js
var API_NAME$4, DiagAPI;
var init_diag = __esmMin((() => {
	init_ComponentLogger();
	init_logLevelLogger();
	init_types();
	init_global_utils();
	API_NAME$4 = "diag";
	DiagAPI = class DiagAPI {
		/** Get the singleton instance of the DiagAPI API */
		static instance() {
			if (!this._instance) this._instance = new DiagAPI();
			return this._instance;
		}
		/**
		* Private internal constructor
		* @private
		*/
		constructor() {
			function _logProxy(funcName) {
				return function(...args) {
					const logger = getGlobal("diag");
					if (!logger) return;
					return logger[funcName](...args);
				};
			}
			const self = this;
			const setLogger = (logger, optionsOrLogLevel = { logLevel: DiagLogLevel.INFO }) => {
				var _a, _b, _c;
				if (logger === self) {
					const err = /* @__PURE__ */ new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
					self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
					return false;
				}
				if (typeof optionsOrLogLevel === "number") optionsOrLogLevel = { logLevel: optionsOrLogLevel };
				const oldLogger = getGlobal("diag");
				const newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
				if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
					const stack = (_c = (/* @__PURE__ */ new Error()).stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
					oldLogger.warn(`Current logger will be overwritten from ${stack}`);
					newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
				}
				return registerGlobal("diag", newLogger, self, true);
			};
			self.setLogger = setLogger;
			self.disable = () => {
				unregisterGlobal(API_NAME$4, self);
			};
			self.createComponentLogger = (options) => {
				return new DiagComponentLogger(options);
			};
			self.verbose = _logProxy("verbose");
			self.debug = _logProxy("debug");
			self.info = _logProxy("info");
			self.warn = _logProxy("warn");
			self.error = _logProxy("error");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/baggage/internal/baggage-impl.js
var BaggageImpl;
var init_baggage_impl = __esmMin((() => {
	BaggageImpl = class BaggageImpl {
		constructor(entries) {
			this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
		}
		getEntry(key) {
			const entry = this._entries.get(key);
			if (!entry) return;
			return Object.assign({}, entry);
		}
		getAllEntries() {
			return Array.from(this._entries.entries());
		}
		setEntry(key, entry) {
			const newBaggage = new BaggageImpl(this._entries);
			newBaggage._entries.set(key, entry);
			return newBaggage;
		}
		removeEntry(key) {
			const newBaggage = new BaggageImpl(this._entries);
			newBaggage._entries.delete(key);
			return newBaggage;
		}
		removeEntries(...keys) {
			const newBaggage = new BaggageImpl(this._entries);
			for (const key of keys) newBaggage._entries.delete(key);
			return newBaggage;
		}
		clear() {
			return new BaggageImpl();
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/baggage/internal/symbol.js
var baggageEntryMetadataSymbol;
var init_symbol = __esmMin((() => {
	baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/baggage/utils.js
/**
* Create a new Baggage with optional entries
*
* @param entries An array of baggage entries the new baggage should contain
*/
function createBaggage(entries = {}) {
	return new BaggageImpl(new Map(Object.entries(entries)));
}
/**
* Create a serializable BaggageEntryMetadata object from a string.
*
* @param str string metadata. Format is currently not defined by the spec and has no special meaning.
*
* @since 1.0.0
*/
function baggageEntryMetadataFromString(str) {
	if (typeof str !== "string") {
		diag$1.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
		str = "";
	}
	return {
		__TYPE__: baggageEntryMetadataSymbol,
		toString() {
			return str;
		}
	};
}
var diag$1;
var init_utils$1 = __esmMin((() => {
	init_diag();
	init_baggage_impl();
	init_symbol();
	diag$1 = DiagAPI.instance();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/context/context.js
/**
* Get a key to uniquely identify a context value
*
* @since 1.0.0
*/
function createContextKey(description) {
	return Symbol.for(description);
}
var BaseContext, ROOT_CONTEXT;
var init_context$1 = __esmMin((() => {
	BaseContext = class BaseContext {
		/**
		* Construct a new context which inherits values from an optional parent context.
		*
		* @param parentContext a context from which to inherit values
		*/
		constructor(parentContext) {
			const self = this;
			self._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
			self.getValue = (key) => self._currentContext.get(key);
			self.setValue = (key, value) => {
				const context = new BaseContext(self._currentContext);
				context._currentContext.set(key, value);
				return context;
			};
			self.deleteValue = (key) => {
				const context = new BaseContext(self._currentContext);
				context._currentContext.delete(key);
				return context;
			};
		}
	};
	ROOT_CONTEXT = new BaseContext();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/diag/consoleLogger.js
var consoleMap, _originalConsoleMethods, DiagConsoleLogger;
var init_consoleLogger = __esmMin((() => {
	consoleMap = [
		{
			n: "error",
			c: "error"
		},
		{
			n: "warn",
			c: "warn"
		},
		{
			n: "info",
			c: "info"
		},
		{
			n: "debug",
			c: "debug"
		},
		{
			n: "verbose",
			c: "trace"
		}
	];
	_originalConsoleMethods = {};
	if (typeof console !== "undefined") {
		for (const key of [
			"error",
			"warn",
			"info",
			"debug",
			"trace",
			"log"
		]) if (typeof console[key] === "function") _originalConsoleMethods[key] = console[key];
	}
	DiagConsoleLogger = class {
		constructor() {
			function _consoleFunc(funcName) {
				return function(...args) {
					let theFunc = _originalConsoleMethods[funcName];
					if (typeof theFunc !== "function") theFunc = _originalConsoleMethods["log"];
					if (typeof theFunc !== "function" && console) {
						theFunc = console[funcName];
						if (typeof theFunc !== "function") theFunc = console.log;
					}
					if (typeof theFunc === "function") return theFunc.apply(console, args);
				};
			}
			for (let i = 0; i < consoleMap.length; i++) this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/metrics/NoopMeter.js
/**
* Create a no-op Meter
*
* @since 1.3.0
*/
function createNoopMeter() {
	return NOOP_METER;
}
var NoopMeter, NoopMetric, NoopCounterMetric, NoopUpDownCounterMetric, NoopGaugeMetric, NoopHistogramMetric, NoopObservableMetric, NoopObservableCounterMetric, NoopObservableGaugeMetric, NoopObservableUpDownCounterMetric, NOOP_METER, NOOP_COUNTER_METRIC, NOOP_GAUGE_METRIC, NOOP_HISTOGRAM_METRIC, NOOP_UP_DOWN_COUNTER_METRIC, NOOP_OBSERVABLE_COUNTER_METRIC, NOOP_OBSERVABLE_GAUGE_METRIC, NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
var init_NoopMeter = __esmMin((() => {
	NoopMeter = class {
		constructor() {}
		/**
		* @see {@link Meter.createGauge}
		*/
		createGauge(_name, _options) {
			return NOOP_GAUGE_METRIC;
		}
		/**
		* @see {@link Meter.createHistogram}
		*/
		createHistogram(_name, _options) {
			return NOOP_HISTOGRAM_METRIC;
		}
		/**
		* @see {@link Meter.createCounter}
		*/
		createCounter(_name, _options) {
			return NOOP_COUNTER_METRIC;
		}
		/**
		* @see {@link Meter.createUpDownCounter}
		*/
		createUpDownCounter(_name, _options) {
			return NOOP_UP_DOWN_COUNTER_METRIC;
		}
		/**
		* @see {@link Meter.createObservableGauge}
		*/
		createObservableGauge(_name, _options) {
			return NOOP_OBSERVABLE_GAUGE_METRIC;
		}
		/**
		* @see {@link Meter.createObservableCounter}
		*/
		createObservableCounter(_name, _options) {
			return NOOP_OBSERVABLE_COUNTER_METRIC;
		}
		/**
		* @see {@link Meter.createObservableUpDownCounter}
		*/
		createObservableUpDownCounter(_name, _options) {
			return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
		}
		/**
		* @see {@link Meter.addBatchObservableCallback}
		*/
		addBatchObservableCallback(_callback, _observables) {}
		/**
		* @see {@link Meter.removeBatchObservableCallback}
		*/
		removeBatchObservableCallback(_callback) {}
	};
	NoopMetric = class {};
	NoopCounterMetric = class extends NoopMetric {
		add(_value, _attributes) {}
	};
	NoopUpDownCounterMetric = class extends NoopMetric {
		add(_value, _attributes) {}
	};
	NoopGaugeMetric = class extends NoopMetric {
		record(_value, _attributes) {}
	};
	NoopHistogramMetric = class extends NoopMetric {
		record(_value, _attributes) {}
	};
	NoopObservableMetric = class {
		addCallback(_callback) {}
		removeCallback(_callback) {}
	};
	NoopObservableCounterMetric = class extends NoopObservableMetric {};
	NoopObservableGaugeMetric = class extends NoopObservableMetric {};
	NoopObservableUpDownCounterMetric = class extends NoopObservableMetric {};
	NOOP_METER = new NoopMeter();
	NOOP_COUNTER_METRIC = new NoopCounterMetric();
	NOOP_GAUGE_METRIC = new NoopGaugeMetric();
	NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
	NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
	NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
	NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
	NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/metrics/Metric.js
var ValueType;
var init_Metric = __esmMin((() => {
	(function(ValueType) {
		ValueType[ValueType["INT"] = 0] = "INT";
		ValueType[ValueType["DOUBLE"] = 1] = "DOUBLE";
	})(ValueType || (ValueType = {}));
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/propagation/TextMapPropagator.js
var defaultTextMapGetter, defaultTextMapSetter;
var init_TextMapPropagator = __esmMin((() => {
	defaultTextMapGetter = {
		get(carrier, key) {
			if (carrier == null) return;
			return carrier[key];
		},
		keys(carrier) {
			if (carrier == null) return [];
			return Object.keys(carrier);
		}
	};
	defaultTextMapSetter = { set(carrier, key, value) {
		if (carrier == null) return;
		carrier[key] = value;
	} };
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/context/NoopContextManager.js
var NoopContextManager;
var init_NoopContextManager = __esmMin((() => {
	init_context$1();
	NoopContextManager = class {
		active() {
			return ROOT_CONTEXT;
		}
		with(_context, fn, thisArg, ...args) {
			return fn.call(thisArg, ...args);
		}
		bind(_context, target) {
			return target;
		}
		enable() {
			return this;
		}
		disable() {
			return this;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/api/context.js
var API_NAME$3, NOOP_CONTEXT_MANAGER, ContextAPI;
var init_context = __esmMin((() => {
	init_NoopContextManager();
	init_global_utils();
	init_diag();
	API_NAME$3 = "context";
	NOOP_CONTEXT_MANAGER = new NoopContextManager();
	ContextAPI = class ContextAPI {
		/** Empty private constructor prevents end users from constructing a new instance of the API */
		constructor() {}
		/** Get the singleton instance of the Context API */
		static getInstance() {
			if (!this._instance) this._instance = new ContextAPI();
			return this._instance;
		}
		/**
		* Set the current context manager.
		*
		* @returns true if the context manager was successfully registered, else false
		*/
		setGlobalContextManager(contextManager) {
			return registerGlobal(API_NAME$3, contextManager, DiagAPI.instance());
		}
		/**
		* Get the currently active context
		*/
		active() {
			return this._getContextManager().active();
		}
		/**
		* Execute a function with an active context
		*
		* @param context context to be active during function execution
		* @param fn function to execute in a context
		* @param thisArg optional receiver to be used for calling fn
		* @param args optional arguments forwarded to fn
		*/
		with(context, fn, thisArg, ...args) {
			return this._getContextManager().with(context, fn, thisArg, ...args);
		}
		/**
		* Bind a context to a target function or event emitter
		*
		* @param context context to bind to the event emitter or function. Defaults to the currently active context
		* @param target function or event emitter to bind
		*/
		bind(context, target) {
			return this._getContextManager().bind(context, target);
		}
		_getContextManager() {
			return getGlobal(API_NAME$3) || NOOP_CONTEXT_MANAGER;
		}
		/** Disable and remove the global context manager */
		disable() {
			this._getContextManager().disable();
			unregisterGlobal(API_NAME$3, DiagAPI.instance());
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/trace_flags.js
var TraceFlags;
var init_trace_flags = __esmMin((() => {
	(function(TraceFlags) {
		/** Represents no flag set. */
		TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
		/** Bit to represent whether trace is sampled in trace flags. */
		TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
	})(TraceFlags || (TraceFlags = {}));
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/invalid-span-constants.js
var INVALID_SPANID, INVALID_TRACEID, INVALID_SPAN_CONTEXT;
var init_invalid_span_constants = __esmMin((() => {
	init_trace_flags();
	INVALID_SPANID = "0000000000000000";
	INVALID_TRACEID = "00000000000000000000000000000000";
	INVALID_SPAN_CONTEXT = {
		traceId: INVALID_TRACEID,
		spanId: INVALID_SPANID,
		traceFlags: TraceFlags.NONE
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/NonRecordingSpan.js
var NonRecordingSpan;
var init_NonRecordingSpan = __esmMin((() => {
	init_invalid_span_constants();
	NonRecordingSpan = class {
		constructor(spanContext = INVALID_SPAN_CONTEXT) {
			this._spanContext = spanContext;
		}
		spanContext() {
			return this._spanContext;
		}
		setAttribute(_key, _value) {
			return this;
		}
		setAttributes(_attributes) {
			return this;
		}
		addEvent(_name, _attributes) {
			return this;
		}
		addLink(_link) {
			return this;
		}
		addLinks(_links) {
			return this;
		}
		setStatus(_status) {
			return this;
		}
		updateName(_name) {
			return this;
		}
		end(_endTime) {}
		isRecording() {
			return false;
		}
		recordException(_exception, _time) {}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/context-utils.js
/**
* Return the span if one exists
*
* @param context context to get span from
*/
function getSpan(context) {
	return context.getValue(SPAN_KEY) || void 0;
}
/**
* Gets the span from the current context, if one exists.
*/
function getActiveSpan() {
	return getSpan(ContextAPI.getInstance().active());
}
/**
* Set the span on a context
*
* @param context context to use as parent
* @param span span to set active
*/
function setSpan(context, span) {
	return context.setValue(SPAN_KEY, span);
}
/**
* Remove current span stored in the context
*
* @param context context to delete span from
*/
function deleteSpan(context) {
	return context.deleteValue(SPAN_KEY);
}
/**
* Wrap span context in a NoopSpan and set as span in a new
* context
*
* @param context context to set active span on
* @param spanContext span context to be wrapped
*/
function setSpanContext(context, spanContext) {
	return setSpan(context, new NonRecordingSpan(spanContext));
}
/**
* Get the span context of the span if it exists.
*
* @param context context to get values from
*/
function getSpanContext(context) {
	var _a;
	return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
var SPAN_KEY;
var init_context_utils = __esmMin((() => {
	init_context$1();
	init_NonRecordingSpan();
	init_context();
	SPAN_KEY = createContextKey("OpenTelemetry Context Key SPAN");
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/spancontext-utils.js
function isValidHex(id, length) {
	if (typeof id !== "string" || id.length !== length) return false;
	let r = 0;
	for (let i = 0; i < id.length; i += 4) r += (isHex[id.charCodeAt(i)] | 0) + (isHex[id.charCodeAt(i + 1)] | 0) + (isHex[id.charCodeAt(i + 2)] | 0) + (isHex[id.charCodeAt(i + 3)] | 0);
	return r === length;
}
/**
* @since 1.0.0
*/
function isValidTraceId(traceId) {
	return isValidHex(traceId, 32) && traceId !== "00000000000000000000000000000000";
}
/**
* @since 1.0.0
*/
function isValidSpanId(spanId) {
	return isValidHex(spanId, 16) && spanId !== "0000000000000000";
}
/**
* Returns true if this {@link SpanContext} is valid.
* @return true if this {@link SpanContext} is valid.
*
* @since 1.0.0
*/
function isSpanContextValid(spanContext) {
	return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
/**
* Wrap the given {@link SpanContext} in a new non-recording {@link Span}
*
* @param spanContext span context to be wrapped
* @returns a new non-recording {@link Span} with the provided context
*/
function wrapSpanContext(spanContext) {
	return new NonRecordingSpan(spanContext);
}
var isHex;
var init_spancontext_utils = __esmMin((() => {
	init_invalid_span_constants();
	init_NonRecordingSpan();
	isHex = new Uint8Array([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1
	]);
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/NoopTracer.js
function isSpanContext(spanContext) {
	return spanContext !== null && typeof spanContext === "object" && "spanId" in spanContext && typeof spanContext["spanId"] === "string" && "traceId" in spanContext && typeof spanContext["traceId"] === "string" && "traceFlags" in spanContext && typeof spanContext["traceFlags"] === "number";
}
var contextApi, NoopTracer;
var init_NoopTracer = __esmMin((() => {
	init_context();
	init_context_utils();
	init_NonRecordingSpan();
	init_spancontext_utils();
	contextApi = ContextAPI.getInstance();
	NoopTracer = class {
		startSpan(name, options, context = contextApi.active()) {
			if (Boolean(options === null || options === void 0 ? void 0 : options.root)) return new NonRecordingSpan();
			const parentFromContext = context && getSpanContext(context);
			if (isSpanContext(parentFromContext) && isSpanContextValid(parentFromContext)) return new NonRecordingSpan(parentFromContext);
			else return new NonRecordingSpan();
		}
		startActiveSpan(name, arg2, arg3, arg4) {
			let opts;
			let ctx;
			let fn;
			if (arguments.length < 2) return;
			else if (arguments.length === 2) fn = arg2;
			else if (arguments.length === 3) {
				opts = arg2;
				fn = arg3;
			} else {
				opts = arg2;
				ctx = arg3;
				fn = arg4;
			}
			const parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
			const span = this.startSpan(name, opts, parentContext);
			const contextWithSpanSet = setSpan(parentContext, span);
			return contextApi.with(contextWithSpanSet, fn, void 0, span);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracer.js
var NOOP_TRACER, ProxyTracer;
var init_ProxyTracer = __esmMin((() => {
	init_NoopTracer();
	NOOP_TRACER = new NoopTracer();
	ProxyTracer = class {
		constructor(provider, name, version, options) {
			this._provider = provider;
			this.name = name;
			this.version = version;
			this.options = options;
		}
		startSpan(name, options, context) {
			return this._getTracer().startSpan(name, options, context);
		}
		startActiveSpan(_name, _options, _context, _fn) {
			const tracer = this._getTracer();
			return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
		}
		/**
		* Try to get a tracer from the proxy tracer provider.
		* If the proxy tracer provider has no delegate, return a noop tracer.
		*/
		_getTracer() {
			if (this._delegate) return this._delegate;
			const tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
			if (!tracer) return NOOP_TRACER;
			this._delegate = tracer;
			return this._delegate;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/NoopTracerProvider.js
var NoopTracerProvider;
var init_NoopTracerProvider = __esmMin((() => {
	init_NoopTracer();
	NoopTracerProvider = class {
		getTracer(_name, _version, _options) {
			return new NoopTracer();
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/ProxyTracerProvider.js
var NOOP_TRACER_PROVIDER, ProxyTracerProvider;
var init_ProxyTracerProvider = __esmMin((() => {
	init_ProxyTracer();
	init_NoopTracerProvider();
	NOOP_TRACER_PROVIDER = new NoopTracerProvider();
	ProxyTracerProvider = class {
		/**
		* Get a {@link ProxyTracer}
		*/
		getTracer(name, version, options) {
			var _a;
			return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options);
		}
		getDelegate() {
			var _a;
			return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
		}
		/**
		* Set the delegate tracer provider
		*/
		setDelegate(delegate) {
			this._delegate = delegate;
		}
		getDelegateTracer(name, version, options) {
			var _a;
			return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/SamplingResult.js
var SamplingDecision;
var init_SamplingResult = __esmMin((() => {
	(function(SamplingDecision) {
		/**
		* `Span.isRecording() === false`, span will not be recorded and all events
		* and attributes will be dropped.
		*/
		SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
		/**
		* `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
		* MUST NOT be set.
		*/
		SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
		/**
		* `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
		* MUST be set.
		*/
		SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
	})(SamplingDecision || (SamplingDecision = {}));
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/span_kind.js
var SpanKind;
var init_span_kind = __esmMin((() => {
	(function(SpanKind) {
		/** Default value. Indicates that the span is used internally. */
		SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
		/**
		* Indicates that the span covers server-side handling of an RPC or other
		* remote request.
		*/
		SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
		/**
		* Indicates that the span covers the client-side wrapper around an RPC or
		* other remote request.
		*/
		SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
		/**
		* Indicates that the span describes producer sending a message to a
		* broker. Unlike client and server, there is no direct critical path latency
		* relationship between producer and consumer spans.
		*/
		SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
		/**
		* Indicates that the span describes consumer receiving a message from a
		* broker. Unlike client and server, there is no direct critical path latency
		* relationship between producer and consumer spans.
		*/
		SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
	})(SpanKind || (SpanKind = {}));
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/status.js
var SpanStatusCode;
var init_status = __esmMin((() => {
	(function(SpanStatusCode) {
		/**
		* The default status.
		*/
		SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
		/**
		* The operation has been validated by an Application developer or
		* Operator to have completed successfully.
		*/
		SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
		/**
		* The operation contains an error.
		*/
		SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
	})(SpanStatusCode || (SpanStatusCode = {}));
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/internal/tracestate-validators.js
/**
* Key is opaque string up to 256 characters printable. It MUST begin with a
* lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
* underscores _, dashes -, asterisks *, and forward slashes /.
* For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
* vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
* see https://www.w3.org/TR/trace-context/#key
*/
function validateKey(key) {
	return VALID_KEY_REGEX.test(key);
}
/**
* Value is opaque string up to 256 characters printable ASCII RFC0020
* characters (i.e., the range 0x20 to 0x7E) except comma , and =.
*/
function validateValue(value) {
	return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}
var VALID_KEY_CHAR_RANGE, VALID_KEY_REGEX, VALID_VALUE_BASE_REGEX, INVALID_VALUE_COMMA_EQUAL_REGEX;
var init_tracestate_validators = __esmMin((() => {
	VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
	VALID_KEY_REGEX = new RegExp(`^(?:${`[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`}|${`[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`})$`);
	VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
	INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/internal/tracestate-impl.js
var MAX_TRACE_STATE_ITEMS, MAX_TRACE_STATE_LEN, LIST_MEMBERS_SEPARATOR, LIST_MEMBER_KEY_VALUE_SPLITTER, TraceStateImpl;
var init_tracestate_impl = __esmMin((() => {
	init_tracestate_validators();
	MAX_TRACE_STATE_ITEMS = 32;
	MAX_TRACE_STATE_LEN = 512;
	LIST_MEMBERS_SEPARATOR = ",";
	LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
	TraceStateImpl = class TraceStateImpl {
		constructor(rawTraceState) {
			this._internalState = /* @__PURE__ */ new Map();
			if (rawTraceState) this._parse(rawTraceState);
		}
		set(key, value) {
			const traceState = this._clone();
			if (traceState._internalState.has(key)) traceState._internalState.delete(key);
			traceState._internalState.set(key, value);
			return traceState;
		}
		unset(key) {
			const traceState = this._clone();
			traceState._internalState.delete(key);
			return traceState;
		}
		get(key) {
			return this._internalState.get(key);
		}
		serialize() {
			return Array.from(this._internalState.keys()).reduceRight((agg, key) => {
				agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
				return agg;
			}, []).join(LIST_MEMBERS_SEPARATOR);
		}
		_parse(rawTraceState) {
			if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
			this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reduceRight((agg, part) => {
				const listMember = part.trim();
				const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
				if (i !== -1) {
					const key = listMember.slice(0, i);
					const value = listMember.slice(i + 1, part.length);
					if (validateKey(key) && validateValue(value)) agg.set(key, value);
				}
				return agg;
			}, /* @__PURE__ */ new Map());
			if (this._internalState.size > MAX_TRACE_STATE_ITEMS) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
		}
		_keys() {
			return Array.from(this._internalState.keys()).reverse();
		}
		_clone() {
			const traceState = new TraceStateImpl();
			traceState._internalState = new Map(this._internalState);
			return traceState;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace/internal/utils.js
/**
* @since 1.1.0
*/
function createTraceState(rawTraceState) {
	return new TraceStateImpl(rawTraceState);
}
var init_utils = __esmMin((() => {
	init_tracestate_impl();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/context-api.js
var context;
var init_context_api = __esmMin((() => {
	init_context();
	context = ContextAPI.getInstance();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/diag-api.js
var diag;
var init_diag_api = __esmMin((() => {
	init_diag();
	diag = DiagAPI.instance();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/metrics/NoopMeterProvider.js
var NoopMeterProvider, NOOP_METER_PROVIDER;
var init_NoopMeterProvider = __esmMin((() => {
	init_NoopMeter();
	NoopMeterProvider = class {
		getMeter(_name, _version, _options) {
			return NOOP_METER;
		}
	};
	NOOP_METER_PROVIDER = new NoopMeterProvider();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/api/metrics.js
var API_NAME$2, MetricsAPI;
var init_metrics = __esmMin((() => {
	init_NoopMeterProvider();
	init_global_utils();
	init_diag();
	API_NAME$2 = "metrics";
	MetricsAPI = class MetricsAPI {
		/** Empty private constructor prevents end users from constructing a new instance of the API */
		constructor() {}
		/** Get the singleton instance of the Metrics API */
		static getInstance() {
			if (!this._instance) this._instance = new MetricsAPI();
			return this._instance;
		}
		/**
		* Set the current global meter provider.
		* Returns true if the meter provider was successfully registered, else false.
		*/
		setGlobalMeterProvider(provider) {
			return registerGlobal(API_NAME$2, provider, DiagAPI.instance());
		}
		/**
		* Returns the global meter provider.
		*/
		getMeterProvider() {
			return getGlobal(API_NAME$2) || NOOP_METER_PROVIDER;
		}
		/**
		* Returns a meter from the global meter provider.
		*/
		getMeter(name, version, options) {
			return this.getMeterProvider().getMeter(name, version, options);
		}
		/** Remove the global meter provider */
		disable() {
			unregisterGlobal(API_NAME$2, DiagAPI.instance());
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/metrics-api.js
var metrics;
var init_metrics_api = __esmMin((() => {
	init_metrics();
	metrics = MetricsAPI.getInstance();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/propagation/NoopTextMapPropagator.js
var NoopTextMapPropagator;
var init_NoopTextMapPropagator = __esmMin((() => {
	NoopTextMapPropagator = class {
		/** Noop inject function does nothing */
		inject(_context, _carrier) {}
		/** Noop extract function does nothing and returns the input context */
		extract(context, _carrier) {
			return context;
		}
		fields() {
			return [];
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/baggage/context-helpers.js
/**
* Retrieve the current baggage from the given context
*
* @param {Context} Context that manage all context values
* @returns {Baggage} Extracted baggage from the context
*/
function getBaggage(context) {
	return context.getValue(BAGGAGE_KEY) || void 0;
}
/**
* Retrieve the current baggage from the active/current context
*
* @returns {Baggage} Extracted baggage from the context
*/
function getActiveBaggage() {
	return getBaggage(ContextAPI.getInstance().active());
}
/**
* Store a baggage in the given context
*
* @param {Context} Context that manage all context values
* @param {Baggage} baggage that will be set in the actual context
*/
function setBaggage(context, baggage) {
	return context.setValue(BAGGAGE_KEY, baggage);
}
/**
* Delete the baggage stored in the given context
*
* @param {Context} Context that manage all context values
*/
function deleteBaggage(context) {
	return context.deleteValue(BAGGAGE_KEY);
}
var BAGGAGE_KEY;
var init_context_helpers = __esmMin((() => {
	init_context();
	init_context$1();
	BAGGAGE_KEY = createContextKey("OpenTelemetry Baggage Key");
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/api/propagation.js
var API_NAME$1, NOOP_TEXT_MAP_PROPAGATOR, PropagationAPI;
var init_propagation = __esmMin((() => {
	init_global_utils();
	init_NoopTextMapPropagator();
	init_TextMapPropagator();
	init_context_helpers();
	init_utils$1();
	init_diag();
	API_NAME$1 = "propagation";
	NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
	PropagationAPI = class PropagationAPI {
		/** Empty private constructor prevents end users from constructing a new instance of the API */
		constructor() {
			this.createBaggage = createBaggage;
			this.getBaggage = getBaggage;
			this.getActiveBaggage = getActiveBaggage;
			this.setBaggage = setBaggage;
			this.deleteBaggage = deleteBaggage;
		}
		/** Get the singleton instance of the Propagator API */
		static getInstance() {
			if (!this._instance) this._instance = new PropagationAPI();
			return this._instance;
		}
		/**
		* Set the current propagator.
		*
		* @returns true if the propagator was successfully registered, else false
		*/
		setGlobalPropagator(propagator) {
			return registerGlobal(API_NAME$1, propagator, DiagAPI.instance());
		}
		/**
		* Inject context into a carrier to be propagated inter-process
		*
		* @param context Context carrying tracing data to inject
		* @param carrier carrier to inject context into
		* @param setter Function used to set values on the carrier
		*/
		inject(context, carrier, setter = defaultTextMapSetter) {
			return this._getGlobalPropagator().inject(context, carrier, setter);
		}
		/**
		* Extract context from a carrier
		*
		* @param context Context which the newly created context will inherit from
		* @param carrier Carrier to extract context from
		* @param getter Function used to extract keys from a carrier
		*/
		extract(context, carrier, getter = defaultTextMapGetter) {
			return this._getGlobalPropagator().extract(context, carrier, getter);
		}
		/**
		* Return a list of all fields which may be used by the propagator.
		*/
		fields() {
			return this._getGlobalPropagator().fields();
		}
		/** Remove the global propagator */
		disable() {
			unregisterGlobal(API_NAME$1, DiagAPI.instance());
		}
		_getGlobalPropagator() {
			return getGlobal(API_NAME$1) || NOOP_TEXT_MAP_PROPAGATOR;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/propagation-api.js
var propagation;
var init_propagation_api = __esmMin((() => {
	init_propagation();
	propagation = PropagationAPI.getInstance();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/api/trace.js
var API_NAME, TraceAPI;
var init_trace = __esmMin((() => {
	init_global_utils();
	init_ProxyTracerProvider();
	init_spancontext_utils();
	init_context_utils();
	init_diag();
	API_NAME = "trace";
	TraceAPI = class TraceAPI {
		/** Empty private constructor prevents end users from constructing a new instance of the API */
		constructor() {
			this._proxyTracerProvider = new ProxyTracerProvider();
			this.wrapSpanContext = wrapSpanContext;
			this.isSpanContextValid = isSpanContextValid;
			this.deleteSpan = deleteSpan;
			this.getSpan = getSpan;
			this.getActiveSpan = getActiveSpan;
			this.getSpanContext = getSpanContext;
			this.setSpan = setSpan;
			this.setSpanContext = setSpanContext;
		}
		/** Get the singleton instance of the Trace API */
		static getInstance() {
			if (!this._instance) this._instance = new TraceAPI();
			return this._instance;
		}
		/**
		* Set the current global tracer.
		*
		* @returns true if the tracer provider was successfully registered, else false
		*/
		setGlobalTracerProvider(provider) {
			const success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
			if (success) this._proxyTracerProvider.setDelegate(provider);
			return success;
		}
		/**
		* Returns the global tracer provider.
		*/
		getTracerProvider() {
			return getGlobal(API_NAME) || this._proxyTracerProvider;
		}
		/**
		* Returns a tracer from the global tracer provider.
		*/
		getTracer(name, version) {
			return this.getTracerProvider().getTracer(name, version);
		}
		/** Remove the global tracer provider */
		disable() {
			unregisterGlobal(API_NAME, DiagAPI.instance());
			this._proxyTracerProvider = new ProxyTracerProvider();
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/trace-api.js
var trace;
var init_trace_api = __esmMin((() => {
	init_trace();
	trace = TraceAPI.getInstance();
}));
//#endregion
//#region node_modules/.pnpm/@opentelemetry+api@1.9.1/node_modules/@opentelemetry/api/build/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	DiagConsoleLogger: () => DiagConsoleLogger,
	DiagLogLevel: () => DiagLogLevel,
	INVALID_SPANID: () => INVALID_SPANID,
	INVALID_SPAN_CONTEXT: () => INVALID_SPAN_CONTEXT,
	INVALID_TRACEID: () => INVALID_TRACEID,
	ProxyTracer: () => ProxyTracer,
	ProxyTracerProvider: () => ProxyTracerProvider,
	ROOT_CONTEXT: () => ROOT_CONTEXT,
	SamplingDecision: () => SamplingDecision,
	SpanKind: () => SpanKind,
	SpanStatusCode: () => SpanStatusCode,
	TraceFlags: () => TraceFlags,
	ValueType: () => ValueType,
	baggageEntryMetadataFromString: () => baggageEntryMetadataFromString,
	context: () => context,
	createContextKey: () => createContextKey,
	createNoopMeter: () => createNoopMeter,
	createTraceState: () => createTraceState,
	default: () => esm_default,
	defaultTextMapGetter: () => defaultTextMapGetter,
	defaultTextMapSetter: () => defaultTextMapSetter,
	diag: () => diag,
	isSpanContextValid: () => isSpanContextValid,
	isValidSpanId: () => isValidSpanId,
	isValidTraceId: () => isValidTraceId,
	metrics: () => metrics,
	propagation: () => propagation,
	trace: () => trace
});
var esm_default;
var init_esm = __esmMin((() => {
	init_utils$1();
	init_context$1();
	init_consoleLogger();
	init_types();
	init_NoopMeter();
	init_Metric();
	init_TextMapPropagator();
	init_ProxyTracer();
	init_ProxyTracerProvider();
	init_SamplingResult();
	init_span_kind();
	init_status();
	init_trace_flags();
	init_utils();
	init_spancontext_utils();
	init_invalid_span_constants();
	init_context_api();
	init_diag_api();
	init_metrics_api();
	init_propagation_api();
	init_trace_api();
	esm_default = {
		context,
		diag,
		metrics,
		propagation,
		trace
	};
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/otel.js
var require_otel = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.instrumentLanceDbMetrics = instrumentLanceDbMetrics;
	const api_1 = (init_esm(), __toCommonJS(esm_exports));
	const native_1 = require_native();
	let instrumented = false;
	/**
	* Register LanceDB metrics as OpenTelemetry observable instruments.
	*
	* Installs a process-global metrics recorder and creates one observable
	* instrument per LanceDB metric (currently object store request counts, bytes,
	* latency, errors, and throttles) on the given (or global) `MeterProvider`. The
	* configured `MetricReader` then collects them on its own schedule.
	*
	* Counters and gauges map directly to observable counters/gauges. Because
	* OpenTelemetry has no asynchronous histogram instrument, each histogram is
	* exported Prometheus-style as cumulative `le` bucket counts (`<name>_bucket`,
	* with an `le` attribute) plus `<name>_count` and `<name>_sum`.
	*
	* Requires `@opentelemetry/api` (a dependency) and, to actually export, an
	* OpenTelemetry SDK such as `@opentelemetry/sdk-metrics`.
	*
	* @param meterProvider The provider to register instruments on. Defaults to the
	*   global provider from `@opentelemetry/api`.
	* @returns `true` if the recorder is installed and instruments are registered.
	*   `false` if a different `metrics` recorder is already installed in this
	*   process (only one global recorder is permitted), in which case a warning is
	*   emitted and no instruments are created. Calling this more than once is safe;
	*   instruments are created only on the first successful call.
	*/
	function instrumentLanceDbMetrics(meterProvider) {
		if (!(0, native_1.registerLancedbMetricsRecorder)()) {
			console.warn("Could not install the LanceDB metrics recorder: another `metrics` recorder is already installed in this process. LanceDB metrics will not be exported via OpenTelemetry.");
			return false;
		}
		if (instrumented) return true;
		const meter = (meterProvider ?? api_1.metrics.getMeterProvider()).getMeter("lancedb");
		const scalarCallback = (metricName) => (result) => {
			for (const point of (0, native_1.snapshotLancedbMetrics)()) if (point.name === metricName && point.value != null) result.observe(point.value, point.attributes);
		};
		const bucketCallback = (metricName) => (result) => {
			for (const point of (0, native_1.snapshotLancedbMetrics)()) {
				if (point.name !== metricName || point.buckets == null) continue;
				for (const bucket of point.buckets) {
					const attributes = {
						...point.attributes,
						le: bucket.le
					};
					result.observe(bucket.cumulativeCount, attributes);
				}
			}
		};
		const fieldCallback = (metricName, field) => (result) => {
			for (const point of (0, native_1.snapshotLancedbMetrics)()) {
				if (point.name !== metricName) continue;
				const value = point[field];
				if (value != null) result.observe(value, point.attributes);
			}
		};
		for (const desc of (0, native_1.lancedbMetricsCatalog)()) {
			const unit = desc.unit ?? "";
			if (desc.kind === "counter") meter.createObservableCounter(desc.name, {
				unit,
				description: desc.description
			}).addCallback(scalarCallback(desc.name));
			else if (desc.kind === "gauge") meter.createObservableGauge(desc.name, {
				unit,
				description: desc.description
			}).addCallback(scalarCallback(desc.name));
			else if (desc.kind === "histogram") {
				meter.createObservableCounter(`${desc.name}_bucket`, { description: `${desc.description} (cumulative buckets)` }).addCallback(bucketCallback(desc.name));
				meter.createObservableCounter(`${desc.name}_count`, { description: `${desc.description} (count)` }).addCallback(fieldCallback(desc.name, "count"));
				meter.createObservableCounter(`${desc.name}_sum`, {
					unit,
					description: `${desc.description} (sum)`
				}).addCallback(fieldCallback(desc.name, "sum"));
			}
		}
		instrumented = true;
		return true;
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/indices.js
var require_indices = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Index = void 0;
	const native_1 = require_native();
	exports.Index = class Index {
		inner;
		constructor(inner) {
			this.inner = inner;
		}
		/**
		* Create an IvfPq index
		*
		* This index stores a compressed (quantized) copy of every vector.  These vectors
		* are grouped into partitions of similar vectors.  Each partition keeps track of
		* a centroid which is the average value of all vectors in the group.
		*
		* During a query the centroids are compared with the query vector to find the closest
		* partitions.  The compressed vectors in these partitions are then searched to find
		* the closest vectors.
		*
		* The compression scheme is called product quantization.  Each vector is divided into
		* subvectors and then each subvector is quantized into a small number of bits.  the
		* parameters `num_bits` and `num_subvectors` control this process, providing a tradeoff
		* between index size (and thus search speed) and index accuracy.
		*
		* The partitioning process is called IVF and the `num_partitions` parameter controls how
		* many groups to create.
		*
		* Note that training an IVF PQ index on a large dataset is a slow operation and
		* currently is also a memory intensive operation.
		*/
		static ivfPq(options) {
			return new Index(native_1.Index.ivfPq(options?.distanceType, options?.numPartitions, options?.numSubVectors, options?.numBits, options?.maxIterations, options?.sampleRate));
		}
		/**
		* Create an IvfRq index
		*
		* IVF-RQ (RabitQ Quantization) compresses vectors using RabitQ quantization
		* and organizes them into IVF partitions.
		*
		* The compression scheme is called RabitQ quantization. Each dimension is quantized into a small number of bits.
		* The parameters `num_bits` and `num_partitions` control this process, providing a tradeoff
		* between index size (and thus search speed) and index accuracy.
		*
		* The partitioning process is called IVF and the `num_partitions` parameter controls how
		* many groups to create.
		*
		* Note that training an IVF RQ index on a large dataset is a slow operation and
		* currently is also a memory intensive operation.
		*/
		static ivfRq(options) {
			return new Index(native_1.Index.ivfRq(options?.distanceType, options?.numPartitions, options?.numBits, options?.maxIterations, options?.sampleRate));
		}
		/**
		* Create an IvfFlat index
		*
		* This index groups vectors into partitions of similar vectors.  Each partition keeps track of
		* a centroid which is the average value of all vectors in the group.
		*
		* During a query the centroids are compared with the query vector to find the closest
		* partitions.  The vectors in these partitions are then searched to find
		* the closest vectors.
		*
		* The partitioning process is called IVF and the `num_partitions` parameter controls how
		* many groups to create.
		*
		* Note that training an IVF FLAT index on a large dataset is a slow operation and
		* currently is also a memory intensive operation.
		*/
		static ivfFlat(options) {
			return new Index(native_1.Index.ivfFlat(options?.distanceType, options?.numPartitions, options?.maxIterations, options?.sampleRate));
		}
		/**
		* Create a btree index
		*
		* A btree index is an index on a scalar columns.  The index stores a copy of the column
		* in sorted order.  A header entry is created for each block of rows (currently the
		* block size is fixed at 4096).  These header entries are stored in a separate
		* cacheable structure (a btree).  To search for data the header is used to determine
		* which blocks need to be read from disk.
		*
		* For example, a btree index in a table with 1Bi rows requires sizeof(Scalar) * 256Ki
		* bytes of memory and will generally need to read sizeof(Scalar) * 4096 bytes to find
		* the correct row ids.
		*
		* This index is good for scalar columns with mostly distinct values and does best when
		* the query is highly selective.
		*
		* The btree index does not currently have any parameters though parameters such as the
		* block size may be added in the future.
		*/
		static btree() {
			return new Index(native_1.Index.btree());
		}
		/**
		* Create a bitmap index.
		*
		* A `Bitmap` index stores a bitmap for each distinct value in the column for every row.
		*
		* This index works best for low-cardinality columns, where the number of unique values
		* is small (i.e., less than a few hundreds).
		*/
		static bitmap() {
			return new Index(native_1.Index.bitmap());
		}
		/**
		* Create a label list index.
		*
		* LabelList index is a scalar index that can be used on `List<T>` columns to
		* support queries with `array_contains_all` and `array_contains_any`
		* using an underlying bitmap index.
		*/
		static labelList() {
			return new Index(native_1.Index.labelList());
		}
		/**
		* Create an FM-Index.
		*
		* An FM-Index is a scalar index on string or binary columns that accelerates
		* substring search, i.e. `contains(col, 'needle')`. Unlike the tokenized
		* full-text-search index, it matches arbitrary substrings of the raw bytes.
		*/
		static fm() {
			return new Index(native_1.Index.fm());
		}
		/**
		* Create a full text search index
		*
		* A full text search index is an index on a string column, so that you can conduct full
		* text searches on the column.
		*
		* The results of a full text search are ordered by relevance measured by BM25.
		*
		* You can combine filters with full text search.
		*/
		static fts(options) {
			return new Index(native_1.Index.fts(options?.withPosition, options?.baseTokenizer, options?.language, options?.maxTokenLength, options?.lowercase, options?.stem, options?.removeStopWords, options?.customStopWords, options?.asciiFolding, options?.ngramMinLength, options?.ngramMaxLength, options?.prefixOnly, options?.blockSize));
		}
		/**
		*
		* Create a hnswPq index
		*
		* HNSW-PQ stands for Hierarchical Navigable Small World - Product Quantization.
		* It is a variant of the HNSW algorithm that uses product quantization to compress
		* the vectors.
		*
		*/
		static hnswPq(options) {
			return new Index(native_1.Index.hnswPq(options?.distanceType, options?.numPartitions, options?.numSubVectors, options?.maxIterations, options?.sampleRate, options?.m, options?.efConstruction));
		}
		/**
		*
		* Create a hnswSq index
		*
		* HNSW-SQ stands for Hierarchical Navigable Small World - Scalar Quantization.
		* It is a variant of the HNSW algorithm that uses scalar quantization to compress
		* the vectors.
		*
		*/
		static hnswSq(options) {
			return new Index(native_1.Index.hnswSq(options?.distanceType, options?.numPartitions, options?.maxIterations, options?.sampleRate, options?.m, options?.efConstruction));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/header.js
var require_header = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OAuthHeaderProvider = exports.StaticHeaderProvider = exports.HeaderProvider = void 0;
	/**
	* Header providers for LanceDB remote connections.
	*
	* This module provides a flexible header management framework for LanceDB remote
	* connections, allowing users to implement custom header strategies for
	* authentication, request tracking, custom metadata, or any other header-based
	* requirements.
	*
	* @module header
	*/
	/**
	* Abstract base class for providing custom headers for each request.
	*
	* Users can implement this interface to provide dynamic headers for various purposes
	* such as authentication (OAuth tokens, API keys), request tracking (correlation IDs),
	* custom metadata, or any other header-based requirements. The provider is called
	* before each request to ensure fresh header values are always used.
	*
	* @example
	* Simple JWT token provider:
	* ```typescript
	* class JWTProvider extends HeaderProvider {
	*   constructor(private token: string) {
	*     super();
	*   }
	*
	*   getHeaders(): Record<string, string> {
	*     return { authorization: `Bearer ${this.token}` };
	*   }
	* }
	* ```
	*
	* @example
	* Provider with request tracking:
	* ```typescript
	* class RequestTrackingProvider extends HeaderProvider {
	*   constructor(private sessionId: string) {
	*     super();
	*   }
	*
	*   getHeaders(): Record<string, string> {
	*     return {
	*       "X-Session-Id": this.sessionId,
	*       "X-Request-Id": `req-${Date.now()}`
	*     };
	*   }
	* }
	* ```
	*/
	var HeaderProvider = class {};
	exports.HeaderProvider = HeaderProvider;
	/**
	* Example implementation: A simple header provider that returns static headers.
	*
	* This is an example implementation showing how to create a HeaderProvider
	* for cases where headers don't change during the session.
	*
	* @example
	* ```typescript
	* const provider = new StaticHeaderProvider({
	*   authorization: "Bearer my-token",
	*   "X-Custom-Header": "custom-value"
	* });
	* const headers = provider.getHeaders();
	* // Returns: {authorization: 'Bearer my-token', 'X-Custom-Header': 'custom-value'}
	* ```
	*/
	var StaticHeaderProvider = class extends HeaderProvider {
		_headers;
		/**
		* Initialize with static headers.
		* @param headers - Headers to return for every request.
		*/
		constructor(headers) {
			super();
			this._headers = { ...headers };
		}
		/**
		* Return the static headers.
		* @returns Copy of the static headers.
		*/
		getHeaders() {
			return { ...this._headers };
		}
	};
	exports.StaticHeaderProvider = StaticHeaderProvider;
	/**
	* Example implementation: OAuth token provider with automatic refresh.
	*
	* This is an example implementation showing how to manage OAuth tokens
	* with automatic refresh when they expire.
	*
	* @example
	* ```typescript
	* async function fetchToken(): Promise<TokenResponse> {
	*   const response = await fetch("https://oauth.example.com/token", {
	*     method: "POST",
	*     body: JSON.stringify({
	*       grant_type: "client_credentials",
	*       client_id: "your-client-id",
	*       client_secret: "your-client-secret"
	*     }),
	*     headers: { "Content-Type": "application/json" }
	*   });
	*   const data = await response.json();
	*   return {
	*     accessToken: data.access_token,
	*     expiresIn: data.expires_in
	*   };
	* }
	*
	* const provider = new OAuthHeaderProvider(fetchToken);
	* const headers = provider.getHeaders();
	* // Returns: {"authorization": "Bearer <your-token>"}
	* ```
	*/
	var OAuthHeaderProvider = class extends HeaderProvider {
		_tokenFetcher;
		_refreshBufferSeconds;
		_currentToken = null;
		_tokenExpiresAt = null;
		_refreshPromise = null;
		/**
		* Initialize the OAuth provider.
		* @param tokenFetcher - Function to fetch new tokens. Should return object with 'accessToken' and optionally 'expiresIn'.
		* @param refreshBufferSeconds - Seconds before expiry to refresh token. Default 300 (5 minutes).
		*/
		constructor(tokenFetcher, refreshBufferSeconds = 300) {
			super();
			this._tokenFetcher = tokenFetcher;
			this._refreshBufferSeconds = refreshBufferSeconds;
		}
		/**
		* Check if token needs refresh.
		*/
		_needsRefresh() {
			if (this._currentToken === null) return true;
			if (this._tokenExpiresAt === null) return false;
			return Date.now() / 1e3 >= this._tokenExpiresAt - this._refreshBufferSeconds;
		}
		/**
		* Refresh the token if it's expired or close to expiring.
		*/
		async _refreshTokenIfNeeded() {
			if (!this._needsRefresh()) return;
			if (this._refreshPromise) {
				await this._refreshPromise;
				return;
			}
			this._refreshPromise = (async () => {
				try {
					const tokenData = await this._tokenFetcher();
					this._currentToken = tokenData.accessToken;
					if (!this._currentToken) throw new Error("Token fetcher did not return 'accessToken'");
					if (tokenData.expiresIn) this._tokenExpiresAt = Date.now() / 1e3 + tokenData.expiresIn;
					else this._tokenExpiresAt = null;
				} finally {
					this._refreshPromise = null;
				}
			})();
			await this._refreshPromise;
		}
		/**
		* Get OAuth headers, refreshing token if needed.
		* Note: This is synchronous for now as the Rust implementation expects sync.
		* In a real implementation, this would need to handle async properly.
		* @returns Headers with Bearer token authorization.
		* @throws If unable to fetch or refresh token.
		*/
		getHeaders() {
			if (!this._currentToken && !this._refreshPromise) throw new Error("Token not initialized. Call refreshToken() first or use async initialization.");
			if (!this._currentToken) throw new Error("Failed to obtain OAuth token");
			return { authorization: `Bearer ${this._currentToken}` };
		}
		/**
		* Manually refresh the token.
		* Call this before using getHeaders() to ensure token is available.
		*/
		async refreshToken() {
			this._currentToken = null;
			await this._refreshTokenIfNeeded();
		}
	};
	exports.OAuthHeaderProvider = OAuthHeaderProvider;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/oauth.js
var require_oauth = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OAuthFlowType = void 0;
	/**
	* OAuth authentication flow types.
	*/
	var OAuthFlowType;
	(function(OAuthFlowType) {
		/** Client Credentials grant (service-to-service / M2M). */
		OAuthFlowType["ClientCredentials"] = "client_credentials";
		/** Azure Managed Identity via IMDS. */
		OAuthFlowType["AzureManagedIdentity"] = "azure_managed_identity";
	})(OAuthFlowType || (exports.OAuthFlowType = OAuthFlowType = {}));
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/embedding/embedding_function.js
var require_embedding_function = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TextEmbeddingFunction = exports.EmbeddingFunction = void 0;
	require_Reflect();
	const arrow_1 = require_arrow();
	const sanitize_1 = require_sanitize();
	const registry_1 = require_registry();
	/**
	* An embedding function that automatically creates vector representation for a given column.
	*
	* It's important subclasses pass the **original** options to the super constructor
	* and then pass those options to `resolveVariables` to resolve any variables before
	* using them.
	*
	* @example
	* ```ts
	* class MyEmbeddingFunction extends EmbeddingFunction {
	*   constructor(options: {model: string, timeout: number}) {
	*     super(optionsRaw);
	*     const options = this.resolveVariables(optionsRaw);
	*     this.model = options.model;
	*     this.timeout = options.timeout;
	*   }
	* }
	* ```
	*/
	var EmbeddingFunction = class {
		/**
		* @ignore
		*  This is only used for associating the options type with the class for type checking
		*/
		TOptions;
		#config;
		/**
		* Get the original arguments to the constructor, to serialize them so they
		* can be used to recreate the embedding function later.
		*/
		toJSON() {
			return JSON.parse(JSON.stringify(this.#config));
		}
		constructor() {
			this.#config = {};
		}
		/**
		* Provide a list of keys in the function options that should be treated as
		* sensitive. If users pass raw values for these keys, they will be rejected.
		*/
		getSensitiveKeys() {
			return [];
		}
		/**
		* Apply variables to the config.
		*/
		resolveVariables(config) {
			this.#config = config;
			const registry = (0, registry_1.getRegistry)();
			const newConfig = { ...config };
			for (const [key_, value] of Object.entries(newConfig)) {
				if (this.getSensitiveKeys().includes(key_) && !value.startsWith("$var:")) throw new Error(`The key "${key_}" is sensitive and cannot be set directly. Please use the $var: syntax to set it.`);
				const key = key_;
				if (typeof value === "string" && value.startsWith("$var:")) {
					const [name, defaultValue] = value.slice(5).split(":", 2);
					const variableValue = registry.getVar(name);
					if (!variableValue) {
						if (defaultValue) newConfig[key] = defaultValue;
						else throw new Error(`Variable "${name}" not found`);
					} else newConfig[key] = variableValue;
				}
			}
			return newConfig;
		}
		/**
		* sourceField is used in combination with `LanceSchema` to provide a declarative data model
		*
		* @param optionsOrDatatype - The options for the field or the datatype
		*
		* @see {@link LanceSchema}
		*/
		sourceField(optionsOrDatatype) {
			let datatype = "datatype" in optionsOrDatatype ? optionsOrDatatype.datatype : optionsOrDatatype;
			if (!datatype) throw new Error("Datatype is required");
			datatype = (0, sanitize_1.sanitizeType)(datatype);
			const metadata = /* @__PURE__ */ new Map();
			metadata.set("source_column_for", this);
			return [datatype, metadata];
		}
		/**
		* vectorField is used in combination with `LanceSchema` to provide a declarative data model
		*
		* @param optionsOrDatatype - The options for the field
		*
		* @see {@link LanceSchema}
		*/
		vectorField(optionsOrDatatype) {
			let dtype;
			let vectorType;
			let dims = this.ndims();
			if (optionsOrDatatype === void 0) dtype = new arrow_1.Float32();
			else if (!("datatype" in optionsOrDatatype)) dtype = (0, sanitize_1.sanitizeType)(optionsOrDatatype);
			else {
				dims = dims ?? optionsOrDatatype?.dims;
				dtype = (0, sanitize_1.sanitizeType)(optionsOrDatatype?.datatype);
			}
			if (dtype !== void 0) {
				if ((0, arrow_1.isFixedSizeList)(dtype)) vectorType = dtype;
				else if ((0, arrow_1.isFloat)(dtype)) {
					if (dims === void 0) throw new Error("ndims is required for vector field");
					vectorType = (0, arrow_1.newVectorType)(dims, dtype);
				} else throw new Error("Expected FixedSizeList or Float as datatype for vector field");
			} else {
				if (dims === void 0) throw new Error("ndims is required for vector field");
				vectorType = new arrow_1.FixedSizeList(dims, new arrow_1.Field("item", new arrow_1.Float32(), true));
			}
			const metadata = /* @__PURE__ */ new Map();
			metadata.set("vector_column_for", this);
			return [vectorType, metadata];
		}
		/** The number of dimensions of the embeddings */
		ndims() {}
		/**
		Compute the embeddings for a single query
		*/
		async computeQueryEmbeddings(data) {
			return this.computeSourceEmbeddings([data]).then((embeddings) => embeddings[0]);
		}
	};
	exports.EmbeddingFunction = EmbeddingFunction;
	/**
	* an abstract class for implementing embedding functions that take text as input
	*/
	var TextEmbeddingFunction = class extends EmbeddingFunction {
		async computeQueryEmbeddings(data) {
			return this.generateEmbeddings([data]).then((data) => data[0]);
		}
		embeddingDataType() {
			return new arrow_1.Float32();
		}
		sourceField() {
			return super.sourceField(new arrow_1.Utf8());
		}
		computeSourceEmbeddings(data) {
			return this.generateEmbeddings(data);
		}
	};
	exports.TextEmbeddingFunction = TextEmbeddingFunction;
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/embedding/openai.js
var require_openai = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OpenAIEmbeddingFunction = void 0;
	const arrow_1 = require_arrow();
	const embedding_function_1 = require_embedding_function();
	const registry_1 = require_registry();
	var OpenAIEmbeddingFunction = class extends embedding_function_1.EmbeddingFunction {
		#openai;
		#modelName;
		constructor(optionsRaw = { model: "text-embedding-ada-002" }) {
			super();
			const options = this.resolveVariables(optionsRaw);
			const openAIKey = options?.apiKey ?? process.env.OPENAI_API_KEY;
			if (!openAIKey) throw new Error("OpenAI API key is required");
			const modelName = options?.model ?? "text-embedding-ada-002";
			/**
			* @type {import("openai").default}
			*/
			let Openai;
			try {
				Openai = __require("openai");
			} catch {
				throw new Error("please install openai@^4.24.1 using npm install openai");
			}
			const configuration = { apiKey: openAIKey };
			this.#openai = new Openai(configuration);
			this.#modelName = modelName;
		}
		getSensitiveKeys() {
			return ["apiKey"];
		}
		ndims() {
			switch (this.#modelName) {
				case "text-embedding-ada-002": return 1536;
				case "text-embedding-3-large": return 3072;
				case "text-embedding-3-small": return 1536;
				default: throw new Error(`Unknown model: ${this.#modelName}`);
			}
		}
		embeddingDataType() {
			return new arrow_1.Float32();
		}
		async computeSourceEmbeddings(data) {
			const response = await this.#openai.embeddings.create({
				model: this.#modelName,
				input: data
			});
			const embeddings = [];
			for (let i = 0; i < response.data.length; i++) embeddings.push(response.data[i].embedding);
			return embeddings;
		}
		async computeQueryEmbeddings(data) {
			if (typeof data !== "string") throw new Error("Data must be a string");
			return (await this.#openai.embeddings.create({
				model: this.#modelName,
				input: data
			})).data[0].embedding;
		}
	};
	exports.OpenAIEmbeddingFunction = OpenAIEmbeddingFunction;
	(0, registry_1.registerBuiltIn)("openai", OpenAIEmbeddingFunction);
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/embedding/transformers.js
var require_transformers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TransformersEmbeddingFunction = void 0;
	const arrow_1 = require_arrow();
	const embedding_function_1 = require_embedding_function();
	const registry_1 = require_registry();
	var TransformersEmbeddingFunction = class extends embedding_function_1.EmbeddingFunction {
		#model;
		#tokenizer;
		#modelName;
		#initialized = false;
		#tokenizerOptions;
		#ndims;
		constructor(optionsRaw = { model: "Xenova/all-MiniLM-L6-v2" }) {
			super();
			const options = this.resolveVariables(optionsRaw);
			const modelName = options?.model ?? "Xenova/all-MiniLM-L6-v2";
			this.#tokenizerOptions = {
				padding: true,
				...options.tokenizerOptions
			};
			this.#ndims = options.ndims;
			this.#modelName = modelName;
		}
		async init() {
			let transformers;
			try {
				transformers = await eval("import(\"@huggingface/transformers\")");
			} catch (e) {
				throw new Error(`error loading @huggingface/transformers\nReason: ${e}`);
			}
			try {
				this.#model = await transformers.AutoModel.from_pretrained(this.#modelName, { dtype: "fp32" });
			} catch (e) {
				throw new Error(`error loading model ${this.#modelName}. Make sure you are using a wasm compatible model.\nReason: ${e}`);
			}
			try {
				this.#tokenizer = await transformers.AutoTokenizer.from_pretrained(this.#modelName);
			} catch (e) {
				throw new Error(`error loading tokenizer for ${this.#modelName}. Make sure you are using a wasm compatible model:\nReason: ${e}`);
			}
			this.#initialized = true;
		}
		ndims() {
			if (this.#ndims) return this.#ndims;
			else {
				const ndims = this.#model.config.hidden_size;
				if (!ndims) throw new Error("hidden_size not found in model config, you may need to manually specify the embedding dimensions. ");
				return ndims;
			}
		}
		embeddingDataType() {
			return new arrow_1.Float32();
		}
		async computeSourceEmbeddings(data) {
			if (!this.#initialized) return Promise.reject(/* @__PURE__ */ new Error("something went wrong: embedding function not initialized. Please call init()"));
			const tokenizer = this.#tokenizer;
			const model = this.#model;
			const inputs = await tokenizer(data, this.#tokenizerOptions);
			let tokens = await model.forward(inputs);
			tokens = tokens[Object.keys(tokens)[0]];
			const [nItems, nTokens] = tokens.dims;
			tokens = tensorDiv(tokens.sum(1), nTokens);
			const tokenData = tokens.data;
			const stride = this.ndims();
			const embeddings = [];
			for (let i = 0; i < nItems; i++) {
				const start = i * stride;
				const end = start + stride;
				const slice = tokenData.slice(start, end);
				embeddings.push(Array.from(slice));
			}
			return embeddings;
		}
		async computeQueryEmbeddings(data) {
			return (await this.computeSourceEmbeddings([data]))[0];
		}
	};
	exports.TransformersEmbeddingFunction = TransformersEmbeddingFunction;
	(0, registry_1.registerBuiltIn)("huggingface", TransformersEmbeddingFunction);
	const tensorDiv = (src, divBy) => {
		for (let i = 0; i < src.data.length; ++i) src.data[i] /= divBy;
		return src;
	};
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/embedding/index.js
var require_embedding = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.register = exports.parseEmbeddingMetadata = exports.EmbeddingFunctionRegistry = exports.TextEmbeddingFunction = exports.EmbeddingFunction = void 0;
	exports.getRegistry = getRegistry;
	exports.LanceSchema = LanceSchema;
	const arrow_1 = require_arrow();
	const sanitize_1 = require_sanitize();
	const registry_1 = require_registry();
	var embedding_function_1 = require_embedding_function();
	Object.defineProperty(exports, "EmbeddingFunction", {
		enumerable: true,
		get: function() {
			return embedding_function_1.EmbeddingFunction;
		}
	});
	Object.defineProperty(exports, "TextEmbeddingFunction", {
		enumerable: true,
		get: function() {
			return embedding_function_1.TextEmbeddingFunction;
		}
	});
	var registry_2 = require_registry();
	Object.defineProperty(exports, "EmbeddingFunctionRegistry", {
		enumerable: true,
		get: function() {
			return registry_2.EmbeddingFunctionRegistry;
		}
	});
	Object.defineProperty(exports, "parseEmbeddingMetadata", {
		enumerable: true,
		get: function() {
			return registry_2.parseEmbeddingMetadata;
		}
	});
	Object.defineProperty(exports, "register", {
		enumerable: true,
		get: function() {
			return registry_2.register;
		}
	});
	function initializeBuiltInProviders() {
		const { OpenAIEmbeddingFunction } = require_openai();
		const { TransformersEmbeddingFunction } = require_transformers();
		(0, registry_1.registerBuiltIn)("openai", OpenAIEmbeddingFunction);
		(0, registry_1.registerBuiltIn)("huggingface", TransformersEmbeddingFunction);
	}
	/**
	* Get the global embedding function registry.
	*
	* LanceDB built-in providers are initialized when this public API is first
	* used, so importing the root package does not change automatic search
	* selection for tables without embedding metadata.
	*/
	function getRegistry() {
		initializeBuiltInProviders();
		return (0, registry_1.getRegistry)();
	}
	/**
	* Create a schema with embedding functions.
	*
	* @param fields
	* @returns Schema
	* @example
	* ```ts
	* class MyEmbeddingFunction extends EmbeddingFunction {
	* // ...
	* }
	* const func = new MyEmbeddingFunction();
	* const schema = LanceSchema({
	*   id: new Int32(),
	*   text: func.sourceField(new Utf8()),
	*   vector: func.vectorField(),
	*   // optional: specify the datatype and/or dimensions
	*   vector2: func.vectorField({ datatype: new Float32(), dims: 3}),
	* });
	*
	* const table = await db.createTable("my_table", data, { schema });
	* ```
	*/
	function LanceSchema(fields) {
		const arrowFields = [];
		const embeddingFunctions = /* @__PURE__ */ new Map();
		Object.entries(fields).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				const [dtype, metadata] = value;
				arrowFields.push(new arrow_1.Field(key, (0, sanitize_1.sanitizeType)(dtype), true));
				parseEmbeddingFunctions(embeddingFunctions, key, metadata);
			} else arrowFields.push(new arrow_1.Field(key, (0, sanitize_1.sanitizeType)(value), true));
		});
		const metadata = getRegistry().getTableMetadata(Array.from(embeddingFunctions.values()));
		return new arrow_1.Schema(arrowFields, metadata);
	}
	function parseEmbeddingFunctions(embeddingFunctions, key, metadata) {
		if (metadata.has("source_column_for")) {
			const embedFunction = metadata.get("source_column_for");
			const current = embeddingFunctions.get(embedFunction);
			if (current !== void 0) embeddingFunctions.set(embedFunction, {
				...current,
				sourceColumn: key
			});
			else embeddingFunctions.set(embedFunction, {
				sourceColumn: key,
				function: embedFunction
			});
		} else if (metadata.has("vector_column_for")) {
			const embedFunction = metadata.get("vector_column_for");
			const current = embeddingFunctions.get(embedFunction);
			if (current !== void 0) embeddingFunctions.set(embedFunction, {
				...current,
				vectorColumn: key
			});
			else embeddingFunctions.set(embedFunction, {
				vectorColumn: key,
				function: embedFunction
			});
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/permutation.js
var require_permutation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PermutationBuilder = void 0;
	exports.permutationBuilder = permutationBuilder;
	const native_js_1 = require_native();
	const table_1 = require_table();
	/**
	* A PermutationBuilder for creating data permutations with splits, shuffling, and filtering.
	*
	* This class provides a TypeScript wrapper around the native Rust PermutationBuilder,
	* offering methods to configure data splits, shuffling, and filtering before executing
	* the permutation to create a new table.
	*/
	var PermutationBuilder = class PermutationBuilder {
		inner;
		/**
		* @hidden
		*/
		constructor(inner) {
			this.inner = inner;
		}
		/**
		* Configure the permutation to be persisted.
		*
		* @param connection - The connection to persist the permutation to
		* @param tableName - The name of the table to create
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* builder.persist(connection, "permutation_table");
		* ```
		*/
		persist(connection, tableName) {
			const localConnection = connection;
			const newInner = this.inner.persist(localConnection.inner, tableName);
			return new PermutationBuilder(newInner);
		}
		/**
		* Configure random splits for the permutation.
		*
		* @param options - Configuration for random splitting
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* // Split by ratios
		* builder.splitRandom({ ratios: [0.7, 0.3], seed: 42 });
		*
		* // Split by counts
		* builder.splitRandom({ counts: [1000, 500], seed: 42 });
		*
		* // Split with fixed size
		* builder.splitRandom({ fixed: 100, seed: 42 });
		* ```
		*/
		splitRandom(options) {
			const newInner = this.inner.splitRandom(options);
			return new PermutationBuilder(newInner);
		}
		/**
		* Configure hash-based splits for the permutation.
		*
		* @param options - Configuration for hash-based splitting
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* builder.splitHash({
		*   columns: ["user_id"],
		*   splitWeights: [70, 30],
		*   discardWeight: 0
		* });
		* ```
		*/
		splitHash(options) {
			const newInner = this.inner.splitHash(options);
			return new PermutationBuilder(newInner);
		}
		/**
		* Configure sequential splits for the permutation.
		*
		* @param options - Configuration for sequential splitting
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* // Split by ratios
		* builder.splitSequential({ ratios: [0.8, 0.2] });
		*
		* // Split by counts
		* builder.splitSequential({ counts: [800, 200] });
		*
		* // Split with fixed size
		* builder.splitSequential({ fixed: 1000 });
		* ```
		*/
		splitSequential(options) {
			const newInner = this.inner.splitSequential(options);
			return new PermutationBuilder(newInner);
		}
		/**
		* Configure calculated splits for the permutation.
		*
		* @param options - Configuration for calculated splitting
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* builder.splitCalculated({ calculation: "user_id % 3" });
		* ```
		*/
		splitCalculated(options) {
			const newInner = this.inner.splitCalculated(options);
			return new PermutationBuilder(newInner);
		}
		/**
		* Configure shuffling for the permutation.
		*
		* @param options - Configuration for shuffling
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* // Basic shuffle
		* builder.shuffle({ seed: 42 });
		*
		* // Shuffle with clump size
		* builder.shuffle({ seed: 42, clumpSize: 10 });
		* ```
		*/
		shuffle(options) {
			const newInner = this.inner.shuffle(options);
			return new PermutationBuilder(newInner);
		}
		/**
		* Configure filtering for the permutation.
		*
		* @param filter - SQL filter expression
		* @returns A new PermutationBuilder instance
		* @example
		* ```ts
		* builder.filter("age > 18 AND status = 'active'");
		* ```
		*/
		filter(filter) {
			const newInner = this.inner.filter(filter);
			return new PermutationBuilder(newInner);
		}
		/**
		* Execute the permutation and create the destination table.
		*
		* @returns A Promise that resolves to the new Table instance
		* @example
		* ```ts
		* const permutationTable = await builder.execute();
		* console.log(`Created table: ${permutationTable.name}`);
		* ```
		*/
		async execute() {
			const nativeTable = await this.inner.execute();
			return new table_1.LocalTable(nativeTable);
		}
	};
	exports.PermutationBuilder = PermutationBuilder;
	/**
	* Create a permutation builder for the given table.
	*
	* @param table - The source table to create a permutation from
	* @returns A PermutationBuilder instance
	* @example
	* ```ts
	* const builder = permutationBuilder(sourceTable, "training_data")
	*   .splitRandom({ ratios: [0.8, 0.2], seed: 42 })
	*   .shuffle({ seed: 123 });
	*
	* const trainingTable = await builder.execute();
	* ```
	*/
	function permutationBuilder(table) {
		const localTable = table;
		return new PermutationBuilder((0, native_js_1.permutationBuilder)(localTable.inner));
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/scannable.js
var require_scannable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Scannable = void 0;
	const arrow_1 = require_arrow();
	const native_js_1 = require_native();
	exports.Scannable = class Scannable {
		schema;
		numRows;
		rescannable;
		/** @hidden */
		native;
		constructor(native, schema, numRows, rescannable) {
			this.native = native;
			this.schema = schema;
			this.numRows = numRows;
			this.rescannable = rescannable;
		}
		/** @hidden Access the native handle for passing through to Rust consumers. */
		get inner() {
			return this.native;
		}
		/**
		* Build a Scannable from an explicit schema and a factory that returns a
		* fresh batch iterator on each call.
		*
		* The factory is invoked once per scan. Each iterator yields
		* `RecordBatch`es matching the declared schema. Use this when you need
		* direct control over the pull loop — for example, to wrap a streaming
		* source whose batches are produced lazily.
		*
		* @param schema - The Arrow schema of the produced batches.
		* @param factory - Called at the start of each scan to produce a batch
		*   iterator. Must be idempotent when `rescannable` is true.
		* @param opts - Optional hints. `rescannable` defaults to `true`; set to
		*   `false` if calling `factory()` twice would not reproduce the same data.
		*/
		static async fromFactory(schema, factory, opts = {}) {
			const numRows = opts.numRows ?? null;
			if (numRows != null && !Number.isInteger(numRows)) throw new TypeError("numRows must be an integer");
			const rescannable = opts.rescannable ?? true;
			let iter = null;
			const getNextBatch = async (isStart) => {
				if (isStart) iter = null;
				if (iter === null) iter = normalizeIterator(factory());
				const result = await iter.next();
				if (result.done) {
					iter = null;
					return null;
				}
				return (0, arrow_1.fromRecordBatchToStreamBuffer)(result.value);
			};
			const schemaBuf = await (0, arrow_1.fromTableToBuffer)((0, arrow_1.makeEmptyTable)(schema));
			const native = new native_js_1.NapiScannable(schemaBuf, numRows, rescannable, getNextBatch);
			return new Scannable(native, schema, numRows, rescannable);
		}
		/**
		* Build a Scannable from an in-memory Arrow `Table`. Always rescannable;
		* the table's batches are replayed on each scan.
		*
		* The table's row count is authoritative: `opts.numRows` must either be
		* omitted or equal to `table.numRows`. `opts.rescannable` of `false` is
		* rejected because in-memory Tables are always rescannable.
		*/
		static async fromTable(table, opts = {}) {
			if (opts.numRows != null && opts.numRows !== table.numRows) throw new TypeError(`opts.numRows (${opts.numRows}) does not match table.numRows (${table.numRows}). The table's row count is authoritative; omit numRows or pass the matching value.`);
			if (opts.rescannable === false) throw new TypeError("fromTable does not accept rescannable: false. In-memory Arrow Tables are always rescannable; omit the option or pass true.");
			return Scannable.fromFactory(table.schema, () => table.batches, {
				numRows: table.numRows,
				rescannable: true
			});
		}
		/**
		* Build a Scannable from an iterable of `RecordBatch`es. `rescannable`
		* defaults to `false`. Pass an explicit schema so the consumer can
		* validate before any batch is pulled.
		*
		* `opts.rescannable: true` is honest for replayable iterables (Arrays,
		* Sets, or custom iterables whose `[Symbol.iterator]()` returns a fresh
		* iterator each call). It is rejected for one-shot iterables (generators,
		* async generators, or already-an-iterator inputs) because their
		* `[Symbol.iterator]()` returns the same exhausted object on the second
		* scan. For replayable sources outside this shape, use
		* `fromFactory(schema, () => createIter(), { rescannable: true })`.
		*
		* Note: when `opts.rescannable` is `true`, the constructor calls
		* `[Symbol.iterator]()` once on the input to perform the structural check.
		*/
		static async fromIterable(schema, iter, opts = {}) {
			if (opts.rescannable === true && isOneShotIterable(iter)) throw new TypeError("fromIterable: rescannable: true is not honest for one-shot iterables (generators, async generators, or iterators where [Symbol.iterator]() returns the same object). The source would be exhausted after the first scan. Use fromFactory(schema, () => createIter(), { rescannable: true }) for sources where each call mints a fresh iterator.");
			return Scannable.fromFactory(schema, () => iter, {
				numRows: opts.numRows,
				rescannable: opts.rescannable ?? false
			});
		}
		/**
		* Build a Scannable from an Arrow `RecordBatchReader`. A reader can only
		* be consumed once; `rescannable` defaults to `false`.
		*
		* The reader must already be opened (via `.open()`) so its `.schema` is
		* populated. `RecordBatchReader.from(...)` returns an unopened reader.
		*
		* `opts.rescannable: true` is rejected because `RecordBatchReader` is a
		* self-iterator (its `[Symbol.iterator]()` returns itself), and this
		* constructor does not call `reader.reset()` between scans, so a second
		* scan would always see an exhausted reader. For genuinely replayable
		* sources, use
		* `fromFactory(schema, () => openReader(), { rescannable: true })`,
		* which mints a fresh reader on each scan.
		*/
		static async fromRecordBatchReader(reader, opts = {}) {
			if (opts.rescannable === true) throw new TypeError("fromRecordBatchReader does not accept rescannable: true. RecordBatchReader is a self-iterator (its [Symbol.iterator]() returns itself) and would be exhausted after the first scan. Use fromFactory(schema, () => openReader(), { rescannable: true }) for sources where each call mints a fresh reader.");
			return Scannable.fromFactory(reader.schema, () => reader, {
				numRows: opts.numRows,
				rescannable: false
			});
		}
	};
	function normalizeIterator(source) {
		if (source == null) throw new TypeError("Scannable factory returned null/undefined");
		if (typeof source[Symbol.asyncIterator] === "function") return source[Symbol.asyncIterator]();
		if (typeof source[Symbol.iterator] === "function") return source[Symbol.iterator]();
		if (typeof source.next === "function") return source;
		throw new TypeError("Scannable factory returned a non-iterable value");
	}
	function isOneShotIterable(source) {
		if (source == null) return false;
		const ref = source;
		if (typeof source[Symbol.asyncIterator] === "function") return source[Symbol.asyncIterator]() === ref;
		if (typeof source[Symbol.iterator] === "function") return source[Symbol.iterator]() === ref;
		if (typeof source.next === "function") return true;
		return false;
	}
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/rerankers/rrf.js
var require_rrf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RRFReranker = void 0;
	const arrow_1 = require_arrow();
	const native_1 = require_native();
	exports.RRFReranker = class RRFReranker {
		inner;
		/** @ignore */
		constructor(inner) {
			this.inner = inner;
		}
		static async create(k = 60) {
			return new RRFReranker(await native_1.RrfReranker.tryNew(new Float32Array([k])));
		}
		async rerankHybrid(query, vecResults, ftsResults) {
			const buffer = await this.inner.rerankHybrid(query, await (0, arrow_1.fromRecordBatchToBuffer)(vecResults), await (0, arrow_1.fromRecordBatchToBuffer)(ftsResults));
			return await (0, arrow_1.fromBufferToRecordBatch)(buffer);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/rerankers/index.js
var require_rerankers = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_rrf(), exports);
}));
//#endregion
//#region node_modules/.pnpm/@lancedb+lancedb@0.38.0_@types+node@26.5.1_apache-arrow@18.1.0/node_modules/@lancedb/lancedb/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.packBits = exports.rerankers = exports.Scannable = exports.PermutationBuilder = exports.permutationBuilder = exports.embedding = exports.MergeInsertBuilder = exports.OAuthFlowType = exports.OAuthHeaderProvider = exports.StaticHeaderProvider = exports.HeaderProvider = exports.Branches = exports.Table = exports.Index = exports.Occur = exports.Operator = exports.FullTextQueryType = exports.BooleanQuery = exports.MultiMatchQuery = exports.BoostQuery = exports.PhraseQuery = exports.MatchQuery = exports.RecordBatchIterator = exports.TakeQuery = exports.VectorQuery = exports.QueryBase = exports.Query = exports.AutoQuery = exports.Session = exports.Job = exports.Connection = exports.VectorColumnOptions = exports.MakeArrowTableOptions = exports.makeArrowTable = exports.BranchContents = exports.TagContents = exports.Tags = exports.instrumentLanceDbMetrics = exports.NativeJsHeaderProvider = exports.MaterializedView = void 0;
	exports.tokenize = tokenize;
	exports.connect = connect;
	exports.connectNamespace = connectNamespace;
	const connection_1 = require_connection();
	const native_js_1 = require_native();
	var materialized_view_1 = require_materialized_view();
	Object.defineProperty(exports, "MaterializedView", {
		enumerable: true,
		get: function() {
			return materialized_view_1.MaterializedView;
		}
	});
	var native_js_2 = require_native();
	Object.defineProperty(exports, "NativeJsHeaderProvider", {
		enumerable: true,
		get: function() {
			return native_js_2.JsHeaderProvider;
		}
	});
	var otel_1 = require_otel();
	Object.defineProperty(exports, "instrumentLanceDbMetrics", {
		enumerable: true,
		get: function() {
			return otel_1.instrumentLanceDbMetrics;
		}
	});
	var native_js_3 = require_native();
	Object.defineProperty(exports, "Tags", {
		enumerable: true,
		get: function() {
			return native_js_3.Tags;
		}
	});
	Object.defineProperty(exports, "TagContents", {
		enumerable: true,
		get: function() {
			return native_js_3.TagContents;
		}
	});
	Object.defineProperty(exports, "BranchContents", {
		enumerable: true,
		get: function() {
			return native_js_3.BranchContents;
		}
	});
	var arrow_1 = require_arrow();
	Object.defineProperty(exports, "makeArrowTable", {
		enumerable: true,
		get: function() {
			return arrow_1.makeArrowTable;
		}
	});
	Object.defineProperty(exports, "MakeArrowTableOptions", {
		enumerable: true,
		get: function() {
			return arrow_1.MakeArrowTableOptions;
		}
	});
	Object.defineProperty(exports, "VectorColumnOptions", {
		enumerable: true,
		get: function() {
			return arrow_1.VectorColumnOptions;
		}
	});
	var connection_2 = require_connection();
	Object.defineProperty(exports, "Connection", {
		enumerable: true,
		get: function() {
			return connection_2.Connection;
		}
	});
	var native_js_4 = require_native();
	Object.defineProperty(exports, "Job", {
		enumerable: true,
		get: function() {
			return native_js_4.Job;
		}
	});
	Object.defineProperty(exports, "Session", {
		enumerable: true,
		get: function() {
			return native_js_4.Session;
		}
	});
	var query_1 = require_query();
	Object.defineProperty(exports, "AutoQuery", {
		enumerable: true,
		get: function() {
			return query_1.AutoQuery;
		}
	});
	Object.defineProperty(exports, "Query", {
		enumerable: true,
		get: function() {
			return query_1.Query;
		}
	});
	Object.defineProperty(exports, "QueryBase", {
		enumerable: true,
		get: function() {
			return query_1.QueryBase;
		}
	});
	Object.defineProperty(exports, "VectorQuery", {
		enumerable: true,
		get: function() {
			return query_1.VectorQuery;
		}
	});
	Object.defineProperty(exports, "TakeQuery", {
		enumerable: true,
		get: function() {
			return query_1.TakeQuery;
		}
	});
	Object.defineProperty(exports, "RecordBatchIterator", {
		enumerable: true,
		get: function() {
			return query_1.RecordBatchIterator;
		}
	});
	Object.defineProperty(exports, "MatchQuery", {
		enumerable: true,
		get: function() {
			return query_1.MatchQuery;
		}
	});
	Object.defineProperty(exports, "PhraseQuery", {
		enumerable: true,
		get: function() {
			return query_1.PhraseQuery;
		}
	});
	Object.defineProperty(exports, "BoostQuery", {
		enumerable: true,
		get: function() {
			return query_1.BoostQuery;
		}
	});
	Object.defineProperty(exports, "MultiMatchQuery", {
		enumerable: true,
		get: function() {
			return query_1.MultiMatchQuery;
		}
	});
	Object.defineProperty(exports, "BooleanQuery", {
		enumerable: true,
		get: function() {
			return query_1.BooleanQuery;
		}
	});
	Object.defineProperty(exports, "FullTextQueryType", {
		enumerable: true,
		get: function() {
			return query_1.FullTextQueryType;
		}
	});
	Object.defineProperty(exports, "Operator", {
		enumerable: true,
		get: function() {
			return query_1.Operator;
		}
	});
	Object.defineProperty(exports, "Occur", {
		enumerable: true,
		get: function() {
			return query_1.Occur;
		}
	});
	var indices_1 = require_indices();
	Object.defineProperty(exports, "Index", {
		enumerable: true,
		get: function() {
			return indices_1.Index;
		}
	});
	var table_1 = require_table();
	Object.defineProperty(exports, "Table", {
		enumerable: true,
		get: function() {
			return table_1.Table;
		}
	});
	Object.defineProperty(exports, "Branches", {
		enumerable: true,
		get: function() {
			return table_1.Branches;
		}
	});
	var header_1 = require_header();
	Object.defineProperty(exports, "HeaderProvider", {
		enumerable: true,
		get: function() {
			return header_1.HeaderProvider;
		}
	});
	Object.defineProperty(exports, "StaticHeaderProvider", {
		enumerable: true,
		get: function() {
			return header_1.StaticHeaderProvider;
		}
	});
	Object.defineProperty(exports, "OAuthHeaderProvider", {
		enumerable: true,
		get: function() {
			return header_1.OAuthHeaderProvider;
		}
	});
	var oauth_1 = require_oauth();
	Object.defineProperty(exports, "OAuthFlowType", {
		enumerable: true,
		get: function() {
			return oauth_1.OAuthFlowType;
		}
	});
	var merge_1 = require_merge();
	Object.defineProperty(exports, "MergeInsertBuilder", {
		enumerable: true,
		get: function() {
			return merge_1.MergeInsertBuilder;
		}
	});
	exports.embedding = require_embedding();
	var permutation_1 = require_permutation();
	Object.defineProperty(exports, "permutationBuilder", {
		enumerable: true,
		get: function() {
			return permutation_1.permutationBuilder;
		}
	});
	Object.defineProperty(exports, "PermutationBuilder", {
		enumerable: true,
		get: function() {
			return permutation_1.PermutationBuilder;
		}
	});
	var scannable_1 = require_scannable();
	Object.defineProperty(exports, "Scannable", {
		enumerable: true,
		get: function() {
			return scannable_1.Scannable;
		}
	});
	exports.rerankers = require_rerankers();
	var util_1 = require_util();
	Object.defineProperty(exports, "packBits", {
		enumerable: true,
		get: function() {
			return util_1.packBits;
		}
	});
	/**
	* Tokenize a full-text search query using an explicit tokenizer.
	*
	* This does not require a table or FTS index. The tokenizer options match
	* {@link Index.fts}.
	*/
	async function tokenize(query, options) {
		return await (0, native_js_1.tokenize)(query, options?.baseTokenizer, options?.language, options?.maxTokenLength, options?.lowercase, options?.stem, options?.removeStopWords, options?.customStopWords, options?.asciiFolding, options?.ngramMinLength, options?.ngramMaxLength, options?.prefixOnly);
	}
	async function connect(uriOrOptions, optionsOrSession, sessionOrHeaderProvider, headerProvider) {
		let uri;
		let finalOptions = {};
		let finalHeaderProvider;
		if (typeof uriOrOptions !== "string") {
			const { uri: uri_, ...opts } = uriOrOptions;
			uri = uri_;
			finalOptions = opts;
		} else {
			uri = uriOrOptions;
			if (optionsOrSession && "inner" in optionsOrSession) finalOptions = {};
			else finalOptions = optionsOrSession || {};
			if (sessionOrHeaderProvider && (typeof sessionOrHeaderProvider === "function" || "getHeaders" in sessionOrHeaderProvider)) finalHeaderProvider = sessionOrHeaderProvider;
			else finalHeaderProvider = headerProvider;
		}
		if (!uri) throw new Error("uri is required");
		finalOptions = finalOptions ?? {};
		finalOptions.storageOptions = (0, connection_1.cleanseStorageOptions)(finalOptions.storageOptions);
		let nativeProvider;
		if (finalHeaderProvider) {
			if (typeof finalHeaderProvider === "function") nativeProvider = new native_js_1.JsHeaderProvider(async () => finalHeaderProvider());
			else if (finalHeaderProvider && typeof finalHeaderProvider.getHeaders === "function") nativeProvider = new native_js_1.JsHeaderProvider(async () => finalHeaderProvider.getHeaders());
		}
		const nativeConn = await native_js_1.Connection.new(uri, finalOptions, nativeProvider);
		return new connection_1.LocalConnection(nativeConn);
	}
	function dirConfigToProperties(config) {
		const { manifestEnabled, extraProperties, ...rest } = config;
		const properties = {
			...extraProperties ?? {},
			...rest
		};
		if (manifestEnabled !== void 0) properties.manifest_enabled = String(manifestEnabled);
		return properties;
	}
	function restConfigToProperties(config) {
		const { headers, extraProperties, ...rest } = config;
		const properties = {
			...extraProperties ?? {},
			...rest
		};
		if (headers) for (const [name, value] of Object.entries(headers)) properties[`headers.${name}`] = value;
		return properties;
	}
	async function connectNamespace(implName, configOrProperties, options) {
		let properties;
		if (implName === "dir") properties = dirConfigToProperties(configOrProperties);
		else if (implName === "rest") properties = restConfigToProperties(configOrProperties);
		else properties = configOrProperties;
		const finalOptions = options ?? {};
		finalOptions.storageOptions = (0, connection_1.cleanseStorageOptions)(finalOptions.storageOptions);
		const nativeConn = await native_js_1.Connection.newWithNamespace(implName, properties, finalOptions);
		return new connection_1.LocalConnection(nativeConn);
	}
}));
//#endregion
export default require_dist();
export {};
