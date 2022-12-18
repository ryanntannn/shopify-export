"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeData = void 0;
var fs_1 = require("fs");
var storeData = function (data, path) {
    try {
        (0, fs_1.writeFileSync)(path, JSON.stringify(data));
    }
    catch (err) {
        console.error(err);
    }
};
exports.storeData = storeData;
