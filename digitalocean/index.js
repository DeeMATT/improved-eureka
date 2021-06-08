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

    const sampleProxy = "https://s3.wasabisys.com/lola-webstore/web/";

    await sshClient.connect({
      host: process.env.FRONTEND_SERVER_IP,
      port: 22,
      username: process.env.FRONTEND_SERVER_USER,
      password: process.env.FRONTEND_SERVER_PASSWORD
    });

    const absolutePath = path.resolve("./digitalocean/setupReverseProxyWithSSL.sh");
    console.log('path', absolutePath);

    await sshClient.putFile(absolutePath, "/opt/setupReverseProxyWithSSL.sh");

    await sshClient.execCommand("chmod +x /opt/setupReverseProxyWithSSL.sh");

    let commandResponse = await sshClient.execCommand(`/opt/setupReverseProxyWithSSL.sh ${fullyQualifiedSubdomain} ${sampleProxy}`);

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