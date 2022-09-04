const express = require('express');
const {json} = require('express');
const connectDB = require('./config/database');
const accountRoute = require('./router/accountRoute');

connectDB();

const app = express();
app.use(json());
app.use('/', accountRoute);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("Order Management App")
})

app.listen(PORT, () => console.log(`Serving on port ${PORT}`));