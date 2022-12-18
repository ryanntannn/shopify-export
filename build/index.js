"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var calls_1 = require("./calls/calls");
var delay_1 = require("./utils/delay");
var store_data_1 = require("./utils/store-data");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var response, firstOrders, orders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, calls_1.getOrders)(5)];
                case 1:
                    response = _a.sent();
                    firstOrders = response.data.data.orders;
                    return [4 /*yield*/, recursivelyGetOrders(firstOrders.pageInfo.endCursor, __spreadArray([], firstOrders.edges, true))];
                case 2:
                    orders = _a.sent();
                    (0, store_data_1.storeData)(orders, 'output.json');
                    console.log('[Orders] Orders retrived:' + orders.length);
                    return [2 /*return*/];
            }
        });
    });
}
function recursivelyGetOrders(endCursor, prev) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var response, orders, cost;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, calls_1.getOrders)(5, endCursor)];
                case 1:
                    response = _d.sent();
                    console.log('[Orders] retrieving orders: ' + endCursor);
                    console.log(JSON.stringify(response.data, null, 4));
                    orders = response.data.data.orders;
                    if (!orders.pageInfo.hasNextPage) {
                        return [2 /*return*/, __spreadArray(__spreadArray([], prev, true), orders.edges, true)];
                    }
                    cost = parseInt((_c = (_b = (_a = response.data.extensions.cost) === null || _a === void 0 ? void 0 : _a.throttleStatus) === null || _b === void 0 ? void 0 : _b.currentlyAvailable) !== null && _c !== void 0 ? _c : '1000');
                    if (!(cost < 422)) return [3 /*break*/, 3];
                    console.log('[Orders] Cooldown reached! waiting for 6.5 seconds, throttle: ' + cost);
                    return [4 /*yield*/, (0, delay_1.delay)(6500)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [4 /*yield*/, recursivelyGetOrders(orders.pageInfo.endCursor, __spreadArray(__spreadArray([], prev, true), orders.edges, true))];
                case 4: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
main().finally(function () { return console.log('terminated'); });
