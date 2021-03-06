import path from "path";
import DigitalOcean from "do-wrapper";
const digitalOceanClient = new DigitalOcean(process.env.DIGITALOCEAN_TOKEN);

import { NodeSSH } from "node-ssh";

let sshClient = new NodeSSH();

export const registerSubdomainForLolaFinance = async (subdomain) => {
  try {
    const frontendServerIp = process.env.FRONTEND_SERVER_IP;
    let response = await digitalOceanClient.domains.createRecord("lolafinance.com", { name: subdomain, type: 'A', ttl: 3600, data: frontendServerIp })

    console.log("Ocean domain", response);

    let sslResponse = await generateSSLForSubdomain(`${subdomain}.lolafinance.com`);

    console.log('ssl res',sslResponse);

    if (sslResponse) {

      return { success: true, reason: `${subdomain} was successfully created` }
    }


  }
  catch (err) {
    console.error(err);
    return { success: false, reason: err.message }
  }
}

export const generateSSLForSubdomain = async (fullyQualifiedSubdomain) => {
  try {

    await sshClient.connect({
      host: process.env.FRONTEND_SERVER_IP,
      port: 22,
      username: process.env.FRONTEND_SERVER_USER,
      password: process.env.FRONTEND_SERVER_PASSWORD
    });

    const absolutePath = path.resolve("./digitalocean/setupSubDomainReverseProxyWithSSL.sh");
    console.log('path', absolutePath);

    await sshClient.putFile(absolutePath, "/opt/setupSubDomainReverseProxyWithSSL.sh");

    await sshClient.execCommand("chmod +x /opt/setupSubDomainReverseProxyWithSSL.sh");

    let commandResponse = await sshClient.execCommand(`/opt/setupSubDomainReverseProxyWithSSL.sh ${fullyQualifiedSubdomain}`);

    console.log('ssl', commandResponse.stdout)

    if (commandResponse.stderr) {
      console.error(commandResponse.stderr);
    }

    return { success: true, reason: `successfully setup ssl for subdomain ${fullyQualifiedSubdomain}` }


  } catch (err) {
    console.error(err);
    throw err;
  }

}

export const registerDomainForLolaFinance = async (domain, templateUrl) => {
  try {
    const frontendServerIp = process.env.FRONTEND_SERVER_IP;

    await digitalOceanClient.domains.create({ name: domain, ip_address: frontendServerIp });
    await digitalOceanClient.domains.createRecord(domain, { name: 'app', type: 'A', ttl: 3600, data: frontendServerIp });

    let sslResponse = await generateSSLForDomain(domain, templateUrl);

    return { success: true, reason: `${domain} was successfully created` }

  } catch (err) {
    console.error(err);
    return { success: false, reason: err.message }
  }
}

export const generateSSLForDomain = async (fullyQualifiedSubdomain, templateUrl) => {
  try {

    await sshClient.connect({
      host: process.env.FRONTEND_SERVER_IP,
      port: 22,
      username: process.env.FRONTEND_SERVER_USER,
      password: process.env.FRONTEND_SERVER_PASSWORD
    });

    const absolutePath = path.resolve("./digitalocean/setupDomainReverseProxyWithSSL.sh");
    console.log('path', absolutePath);

    await sshClient.putFile(absolutePath, "/opt/setupDomainReverseProxyWithSSL.sh");

    await sshClient.execCommand("chmod +x /opt/setupDomainReverseProxyWithSSL.sh");

    let commandResponse = await sshClient.execCommand(`/opt/setupDomainReverseProxyWithSSL.sh ${fullyQualifiedSubdomain} ${templateUrl}`);

    console.log('ssl', commandResponse.stdout)

    if (commandResponse.stderr) {
      console.error(commandResponse.stderr);
    }

    return { success: true, reason: `successfully setup ssl for domain ${fullyQualifiedSubdomain}` }

  } catch (err) {
    console.error(err);
    throw err;
  }

}