const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Trang chu')
})

app.get('/tours', (req, res) => {
  res.send('Danh sach tour')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
