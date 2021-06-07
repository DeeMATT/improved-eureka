"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSSLForSubdomain = exports.registerSubdomainForLolaFinance = undefined;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _doWrapper = require("do-wrapper");

var _doWrapper2 = _interopRequireDefault(_doWrapper);

var _nodeSsh = require("node-ssh");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var digitalOceanClient = new _doWrapper2.default(process.env.DIGITALOCEAN_TOKEN);

var sshClient = new _nodeSsh.NodeSSH();

var registerSubdomainForLolaFinance = exports.registerSubdomainForLolaFinance = async function registerSubdomainForLolaFinance(subdomain) {
  try {
    var frontendServerIp = process.env.FRONTEND_SERVER_IP;
    var response = await digitalOceanClient.domains.createRecord("lolafinance.com", { name: subdomain, type: 'A', ttl: 3600, data: frontendServerIp });

    console.log('Ocean domain', response);
    // if (response) {
    //   console.log(response);
    //   return { success: true, reason: `${subdomain} was successfully created` }
    // }

    var sslResponse = await generateSSLForSubdomain(subdomain + ".lolafinance.com");

    console.log('ssl res', sslResponse);

    if (sslResponse) {

      return { success: true, reason: subdomain + " was successfully created" };
    }
  } catch (err) {
    console.error(err);
    return { success: false, reason: err.message };
  }
};

var generateSSLForSubdomain = exports.generateSSLForSubdomain = async function generateSSLForSubdomain(fullyQualifiedSubdomain) {
  try {

    var sampleProxy = "https://s3.wasabisys.com/lola-webstore/web";

    await sshClient.connect({
      host: process.env.FRONTEND_SERVER_IP,
      port: 22,
      username: process.env.FRONTEND_SERVER_USER,
      password: process.env.FRONTEND_SERVER_PASSWORD
    });

    var absolutePath = _path2.default.resolve("./setupReverseProxyWithSSL.sh");
    console.log('path', absolutePath);

    var feedback = await sshClient.putFile("/home/sommy/project/BaseAfrique/Lola/lola-serve/digitalocean/setupReverseProxyWithSSL.sh", "/opt/setupReverseProxyWithSSL.sh");

    console.log("fff", feedback.stdout);
    console.log("fff err", feedback.stderr);

    var commandResponse = await sshClient.execCommand("#!/bin/bash /opt/setupReverseProxyWithSSL.sh " + fullyQualifiedSubdomain + " " + sampleProxy);

    console.log('ssl', commandResponse.stdout);

    if (commandResponse.stderr) {
      throw new Error(commandResponse.stderr);
      // return { success: false, reason: commandResponse.stderr }
    }

    return { success: true, reason: "successfully setup ssl for subdomain " + fullyQualifiedSubdomain };
  } catch (err) {
    console.error(err);
    throw err;
  }
};