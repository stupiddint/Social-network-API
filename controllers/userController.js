// import userModel from "../models/userModel.js";
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

/** /api/register */
export async function register(req, res) {

    try {
        const { username, email, password } = req.body;
        // check for existing username


        const existUsername = new Promise((resolve, reject) => {
            userModel.findOne({ username }).exec()
                .then((user) => {
                    if (user) {
                        reject({ error: "Please use a unique username" });
                    } else {
                        resolve("Username is unique");
                    }
                })
                .catch(err => {
                    reject(new Error(err))
                })

        })
        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            const exist = userModel.findOne({ email });
            exist.then((email) => {
                if (email) reject({ error: "This email is already linked" });

                resolve("Email is unique");
            })
        })
        // wait for both promises to resolve
        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10).then((hashedPassword) => {
                        const user = new userModel({
                            username,
                            password: hashedPassword,
                            email
                        })
                        // return and save result as response
                        user.save()
                            .then(result => res.status(201).send({ msg: 'User registered successfullly' }))
                            .catch(error => res.status(500).send('hey error is while saving'))

                    }).catch(error => {
                        console.log('error while saving', error)
                        return res.status(500).send({
                            error: "Enable to hashed password"
                        })
                    })
                }
            })
            .catch((error) => {
                return res.status(500).send(error)
            })
    } catch (error) {
        return res.status(500).send(error);
    }
}

/** Retrieve all users */
export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

/** login */
export async function login(req, res) {
    const { username, email, password } = req.body;
    try {
        const user = await userModel.findOne({ $or: [{ username }, { email }] });
        // const user = await userModel.findOne({ username })
        if (!user) {
            res.status(400).send({ message: 'user not found!' })
        }
        // compare the provided password with the hashed password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).send({ message: 'password did not match.' })
        }
        // console.log(process.env.JWT_SECRET)
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "24h" });

        return res.status(200).send({ message: 'login successful!!', token })
    } catch (error) {
        return res.status(500).send('error while checking!!!')
    }
}