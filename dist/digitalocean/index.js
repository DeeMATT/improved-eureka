"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSSLForDomain = exports.registerDomainForLolaFinance = exports.generateSSLForSubdomain = exports.registerSubdomainForLolaFinance = undefined;

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

    console.log("Ocean domain", response);

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

    await sshClient.connect({
      host: process.env.FRONTEND_SERVER_IP,
      port: 22,
      username: process.env.FRONTEND_SERVER_USER,
      password: process.env.FRONTEND_SERVER_PASSWORD
    });

    var absolutePath = _path2.default.resolve("./digitalocean/setupSubDomainReverseProxyWithSSL.sh");
    console.log('path', absolutePath);

    await sshClient.putFile(absolutePath, "/opt/setupSubDomainReverseProxyWithSSL.sh");

    await sshClient.execCommand("chmod +x /opt/setupSubDomainReverseProxyWithSSL.sh");

    var commandResponse = await sshClient.execCommand("/opt/setupSubDomainReverseProxyWithSSL.sh " + fullyQualifiedSubdomain);

    console.log('ssl', commandResponse.stdout);

    if (commandResponse.stderr) {
      console.error(commandResponse.stderr);
    }

    return { success: true, reason: "successfully setup ssl for subdomain " + fullyQualifiedSubdomain };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

var registerDomainForLolaFinance = exports.registerDomainForLolaFinance = async function registerDomainForLolaFinance(domain, redirectUrl) {
  try {
    var frontendServerIp = process.env.FRONTEND_SERVER_IP;

    var response = await digitalOceanClient.domains.create({ name: domain });

    console.log("Domain", response);

    var recordResponse = await digitalOceanClient.domains.createRecord(domain, { name: '@', type: 'A', ttl: 3600, data: frontendServerIp });

    console.log("Domain record", recordResponse);

    var sslResponse = await generateSSLForDomain(domain, redirectUrl);

    console.log('ssl res', sslResponse);

    return { success: true, reason: domain + " was successfully created" };
  } catch (err) {
    console.error(err);
    return { success: false, reason: err.message };
  }
};

var generateSSLForDomain = exports.generateSSLForDomain = async function generateSSLForDomain(fullyQualifiedSubdomain, redirectUrl) {
  try {

    await sshClient.connect({
      host: process.env.FRONTEND_SERVER_IP,
      port: 22,
      username: process.env.FRONTEND_SERVER_USER,
      password: process.env.FRONTEND_SERVER_PASSWORD
    });

    var absolutePath = _path2.default.resolve("./digitalocean/setupDomainReverseProxyWithSSL.sh");
    console.log('path', absolutePath);

    await sshClient.putFile(absolutePath, "/opt/setupDomainReverseProxyWithSSL.sh");

    await sshClient.execCommand("chmod +x /opt/setupDomainReverseProxyWithSSL.sh");

    var commandResponse = await sshClient.execCommand("/opt/setupDomainReverseProxyWithSSL.sh " + fullyQualifiedSubdomain + " " + redirectUrl);

    console.log('ssl', commandResponse.stdout);

    if (commandResponse.stderr) {
      console.error(commandResponse.stderr);
    }

    return { success: true, reason: "successfully setup ssl for domain " + fullyQualifiedSubdomain };
  } catch (err) {
    console.error(err);
    throw err;
  }
};