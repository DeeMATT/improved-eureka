const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

//app imports
import { registerSubdomainForLolaFinance, registerDomainForLolaFinance } from "./digitalocean/index"
import registerDomainInWhogohost from "./whogohost";



app.get('/', async (req, res) => {
  return res.json({
    'data': 'welcome to lola serve'
  });
})

app.post('/whogohost/purchase/domain', async (req, res) => {

  let result = await registerDomainInWhogohost(req.body);

  if (result.success) {
    return res.json(result)
  }

  return res.status(500).json(result);
});

app.post('/domain', async (req, res) => {
  const {domain, templateUrl} = req.body;

  let result = await registerDomainForLolaFinance(domain, templateUrl);

  if (result.success) {
    return res.json(result)
  }

  return res.status(500).json(result);
});

app.post('/subdomain', async (req, res) => {
  const { name } = req.body;

  let result = await registerSubdomainForLolaFinance(name);

  if (result.success) {
    return res.json(result)
  }

  return res.status(500).json(result);
});




app.listen(port, () => {
  console.log(`Lola Serve Is Running On Port ${port}`)
})

