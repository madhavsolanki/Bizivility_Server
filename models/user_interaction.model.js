  import mongoose from "mongoose";

  const userBusinessInteractionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    isLiked: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false }
  }, { timestamps: true });

  const UserBusinessInteraction = mongoose.model("UserBusinessInteraction", userBusinessInteractionSchema);
  export default UserBusinessInteraction;
