"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// lib/server.ts
var app_1 = __importDefault(require("./app"));
var PORT = 3000;
app_1.default.listen(PORT, function () { return console.log("Example app listening on port " + PORT + "!"); });
