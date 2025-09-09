const express = require('express');
const db = require('./utils/db-connection');
const userRouter = require('./routes/user');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/user',userRouter);

db.sync().then(()=>{
    app.listen(4000,(err)=>{
        console.log("server is running");
    })
}).catch((err)=>{
    console.log(err);
})
