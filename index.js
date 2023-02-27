const express = require("express");
const app = express();
const port = 3000;
const Router = require('./src/routes/user');
const sosmedBase = require('./src/databases/sosmedConnection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', Router);

const initApp = async () => { 
    console.log("Testing database connection");
    try {
        await sosmedBase.authenticate();
        console.log("Successfully connected!");
        app.listen(port, () =>
            console.log(`App listening on port ${port}!`)
        );
    } catch (error) {
        console.error("Failure database connection : ", error.original);
    }
 }

 initApp()
