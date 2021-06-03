const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

//app imports
import { registerSubdomainForLolaFinance } from "./digitalocean/index"



app.get('/', async (req, res) => {
  return res.json({
    'data': 'welcome to lola serve'
  });
})


app.post('/lolasubdomain', async (req, res) => {
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

