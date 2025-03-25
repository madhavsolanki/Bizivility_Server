import express from "express";
import authenticateUser from "../middlewares/authenticateUser.middleware.js";
import {
  createAdCampaign,
  deleteAdCampaign,
  getAllAdCapmiagns,
} from "../controllers/ad_campaign.controller.js";

const router = express.Router();

router.post("/:planId", authenticateUser, createAdCampaign);

router.get("/", authenticateUser, getAllAdCapmiagns);

router.delete(
  "/:planId/campaign/:campaignId",
  authenticateUser,
  deleteAdCampaign
);

export default router;
