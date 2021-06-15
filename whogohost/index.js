import axios from "axios";

const registerDomainInWhogohost = async (reqData) => {
    const { token, authEmail, domainName,
        domainSuffix, registrationPeriod, nameServer1, 
        nameServer2, nameServer3, adminFirstName, 
        adminLastName, adminCompanyName, adminAddress, 
        adminCity, adminState, adminCountry, 
        adminPostCode, adminPhone, adminEmail } = reqData;

    const form = {
        token, authemail: authEmail, action:'RegisterDomain', 
        sld: domainName, tld: domainSuffix, regperiod: registrationPeriod,
        nameserver1: nameServer1, nameserver2: nameServer2, nameserver3: nameServer3, 
        adminfirstName: adminFirstName, adminlastName: adminLastName, admincompanyname: adminCompanyName,
        adminaddress1: adminAddress, admincity: adminCity, adminstate: adminState,
        admincountry: adminCountry, adminpostcode: adminPostCode, adminphonenumber: adminPhone,
        adminemail: adminEmail
    };

    try {
        const response = await axios.post('https://www.whogohost.com/host/domainsResellerAPI/api.php', form);
        return { success: true, reason: 'Domain was successfully created', data: response.data };
      } catch (err) {
        console.error(err);
        return { success: false, reason: err.response.data.message || err.message, }
      }
};

export default registerDomainInWhogohost;
