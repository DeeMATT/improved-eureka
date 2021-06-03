const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  return res.json({
    'data': 'welcome to lola serve'
  });
})


app.listen(port, () => {
  console.log(`Lola Serve Is Running`)
})

