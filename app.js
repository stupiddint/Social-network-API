import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import connect from "./database/mongodbConnection.js";
import router from "./routes/userRoute.js";

dotenv.config();

const port = process.env.PORT || 5000;
/** middlewares */
const app = express()
app.use(bodyParser.json())
// app.use(express.json())
app.disable('x-powered-by')


/** api routes */
app.use('/api', router)

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

