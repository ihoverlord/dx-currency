const scrapper = require('./lib/scrapper')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const port = 3000

app.use(cors())
app.use(helmet())
app.get('/', scrapper.data)

app.listen(process.env.PORT || port, () => console.log(`app listening on port ${port}!`))


