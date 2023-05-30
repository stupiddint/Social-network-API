/** 1. Register user 2. login with gmail 3. login with jwt 4. get user details 5. update user 6. delete user */
import { Router } from "express";

import * as controller from '../controllers/userController.js'

const router = Router();


router.route('/register').post(controller.register);
router.route('/allusers').get(controller.getAllUsers)
router.route('/login').post(controller.login);

export default router;

/**
 * {
  "username": "navs",
  "email": "nvb@gamil.com",
  "password": "8888"
}
 */