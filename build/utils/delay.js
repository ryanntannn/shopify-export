"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
var delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
exports.delay = delay;
