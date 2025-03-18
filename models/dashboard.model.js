import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Weekly Data (Last 7 Days)
  weeklyData: {
    userViews: {
      monday: { type: Number, default: 0 },
      tuesday: { type: Number, default: 0 },
      wednesday: { type: Number, default: 0 },
      thursday: { type: Number, default: 0 },
      friday: { type: Number, default: 0 },
      saturday: { type: Number, default: 0 },
      sunday: { type: Number, default: 0 },
    },
    customerLeads: {
      monday: { type: Number, default: 0 },
      tuesday: { type: Number, default: 0 },
      wednesday: { type: Number, default: 0 },
      thursday: { type: Number, default: 0 },
      friday: { type: Number, default: 0 },
      saturday: { type: Number, default: 0 },
      sunday: { type: Number, default: 0 },
    },
    customerReviews: {
      monday: { type: Number, default: 0 },
      tuesday: { type: Number, default: 0 },
      wednesday: { type: Number, default: 0 },
      thursday: { type: Number, default: 0 },
      friday: { type: Number, default: 0 },
      saturday: { type: Number, default: 0 },
      sunday: { type: Number, default: 0 },
    }
  },

  // Yearly Data (Month-wise)
  yearlyData: {
    userViews: {
      january: { type: Number, default: 0 },
      february: { type: Number, default: 0 },
      march: { type: Number, default: 0 },
      april: { type: Number, default: 0 },
      may: { type: Number, default: 0 },
      june: { type: Number, default: 0 },
      july: { type: Number, default: 0 },
      august: { type: Number, default: 0 },
      september: { type: Number, default: 0 },
      october: { type: Number, default: 0 },
      november: { type: Number, default: 0 },
      december: { type: Number, default: 0 },
    },
    customerLeads: {
      january: { type: Number, default: 0 },
      february: { type: Number, default: 0 },
      march: { type: Number, default: 0 },
      april: { type: Number, default: 0 },
      may: { type: Number, default: 0 },
      june: { type: Number, default: 0 },
      july: { type: Number, default: 0 },
      august: { type: Number, default: 0 },
      september: { type: Number, default: 0 },
      october: { type: Number, default: 0 },
      november: { type: Number, default: 0 },
      december: { type: Number, default: 0 },
    },
    customerReviews: {
      january: { type: Number, default: 0 },
      february: { type: Number, default: 0 },
      march: { type: Number, default: 0 },
      april: { type: Number, default: 0 },
      may: { type: Number, default: 0 },
      june: { type: Number, default: 0 },
      july: { type: Number, default: 0 },
      august: { type: Number, default: 0 },
      september: { type: Number, default: 0 },
      october: { type: Number, default: 0 },
      november: { type: Number, default: 0 },
      december: { type: Number, default: 0 },
    }
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const Dashboard = mongoose.model("Dashboard", DashboardSchema);

export default Dashboard;
