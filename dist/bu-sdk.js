/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.BrightUnion = void 0;\nvar covers_1 = __importDefault(__webpack_require__(/*! ./service/covers */ \"./src/service/covers.ts\"));\nexports.BrightUnion = {\n    covers: {\n        getCoversCount: covers_1.default,\n    },\n    staking: {}\n};\nexports[\"default\"] = exports.BrightUnion;\n\n\n//# sourceURL=webpack://@brightunion/sdk/./src/index.ts?");

/***/ }),

/***/ "./src/service/covers.ts":
/*!*******************************!*\
  !*** ./src/service/covers.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports._buyCoverDecode = exports._buyCover = exports._getQuote = exports.getCovers = exports._getDistributorAddress = exports.getCoversCount = void 0;\nfunction getCoversCount(_distributorName, _owner, _isActive) {\n    console.log('getCoversCount');\n}\nexports.getCoversCount = getCoversCount;\nfunction _getDistributorAddress() {\n    return;\n}\nexports._getDistributorAddress = _getDistributorAddress;\n;\nfunction getCovers() {\n    return;\n}\nexports.getCovers = getCovers;\n;\nfunction _getQuote() {\n    return;\n}\nexports._getQuote = _getQuote;\n;\nfunction _buyCover() {\n    return;\n}\nexports._buyCover = _buyCover;\n;\nfunction _buyCoverDecode() {\n    return;\n}\nexports._buyCoverDecode = _buyCoverDecode;\n;\nexports[\"default\"] = {\n    getCovers: getCovers,\n    getCoversCount: getCoversCount\n};\n\n\n//# sourceURL=webpack://@brightunion/sdk/./src/service/covers.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;