"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
var crypto_1 = require("crypto");
var generateOTP = function (length) {
    if (length === void 0) { length = 6; }
    var otp = crypto_1.default.randomInt(length);
    return otp;
};
exports.generateOTP = generateOTP;
