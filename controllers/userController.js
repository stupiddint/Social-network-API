// import userModel from "../models/userModel.js";
import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'

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