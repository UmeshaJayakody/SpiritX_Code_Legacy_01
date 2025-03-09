import express from 'express';
import { loginUser } from '../Controllers/UserController.js';
import {registerUser} from '../Controllers/UserController.js';
const router = express.Router();

router.post('/login', loginUser);
router.post("/register",registerUser);


export default router;