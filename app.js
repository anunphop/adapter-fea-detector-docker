const express = require('express')
const cors = require('cors')
var bodyParser = require('body-parser')
const server = express();
const corsOptions = {
    exposedHeaders: 'Authorization',
};
server.use(cors(corsOptions))
server.use(bodyParser.json({limit: '50mb', type: 'application/json', extended: true}))
server.use(bodyParser.urlencoded({extended: true}))
server.use(express.json())
require('./routes')(server)
server.listen(8080, () => {
    console.log('Api Server at port 8080.')
})