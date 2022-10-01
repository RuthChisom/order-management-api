const express = require('express');
const {json} = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const connectDB = require('./config/database');
const accountRoute = require('./router/accountRoute');
const productRoute = require('./router/productRoute');

connectDB();

const app = express();
app.use(bodyParser.json({type:['applicaion/json','text/plain']}));
app.use(json());
app.use(cors());  // this fixes No 'Access-Control-Allow-Origin' header issue
app.use('/', accountRoute);
app.use('/products', productRoute);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Order Management App")
})

app.listen(PORT, () => console.log(`Serving on port ${PORT}`));