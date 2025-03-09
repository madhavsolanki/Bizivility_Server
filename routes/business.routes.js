import express from 'express';
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import { createBusiness, getBusinesses } from '../controllers/business.controller.js';

const router = express.Router();


router.route('/').post(authenticateUser, createBusiness);
router.route('/').get(authenticateUser, getBusinesses);

export default router;