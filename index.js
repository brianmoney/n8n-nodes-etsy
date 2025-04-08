"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodes = exports.credentials = void 0;

const EtsyApiCredentials = require("./dist/credentials/EtsyApi.credentials");
const EtsyNode = require("./dist/nodes/Etsy/Etsy.node");

exports.credentials = [
    ...require("./dist/credentials/ExampleCredentialsApi.credentials"),
    ...require("./dist/credentials/HttpBinApi.credentials"),
    EtsyApiCredentials,
];

exports.nodes = [
    ...require("./dist/nodes/ExampleNode/ExampleNode.node"),
    ...require("./dist/nodes/HttpBin/HttpBin.node"),
    EtsyNode,
];
