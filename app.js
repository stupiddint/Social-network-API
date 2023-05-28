import express from "express";
import connect from "./database/mongodbConnection.js";

const port = process.env.PORT || 5000;
// middlewares
const app = express()
app.disable('x-powered-by')



// http get request
app.get('/', (req, res) => {
    res.send(`social networking website started.`)
})

/** start server only when we have valid connection */
connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`app running at http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}).catch(err => console.log(`Invalid databse connection ${err}`))

