import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import { getAllEnquiries, getEnquiryById, sendEnquiry } from '../controllers/enquiry.controller.js';
import isAdmin from '../middlewares/admin.middleware.js.js';

const router = express.Router();

// User creates an enquiry (listingId is passed in URL)
router.post("/:listingId", authenticateUser, sendEnquiry);

router.get("/", authenticateUser, getAllEnquiries);

router.get("/:id", authenticateUser, getEnquiryById);


export default router;