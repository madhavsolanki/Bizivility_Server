import express from 'express';
import authenticateUser from '../middlewares/authenticateUser.middleware.js';
import { createEvent, deleteEvent, getAllEvents } from '../controllers/event.controller.js';
import { uploadEventImage } from '../config/multer.js';


const router = express.Router();

router.post("/:planId", authenticateUser, uploadEventImage.single("eventImage"), createEvent); 

// Get all events
router.get("/", getAllEvents);

// Delete an event (only the event creator can delete it)
router.delete("/:eventId", authenticateUser, deleteEvent);

export default router;
