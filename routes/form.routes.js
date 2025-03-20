import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import { createForm, deleteForm, getAllForms, getSingleForm, updateForm } from '../controllers/listing.controller.js';

const router = express.Router();


// Routes - Admin Access Only
router.post("/:userId/:planId", authenticateUser, createForm);
router.put("/:formId", authenticateUser, updateForm);
router.get("/", authenticateUser, getAllForms);
router.get("/:formId", authenticateUser, getSingleForm);
router.delete("/:formId", authenticateUser, deleteForm);

export default router;