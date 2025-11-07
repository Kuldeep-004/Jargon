"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_ts_1 = require("../controllers/auth.ts");
var route = express_1.default.Router();
route.post("/signup", auth_ts_1.signUp);
exports.default = route;
