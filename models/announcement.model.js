import mongoose from "mongoose";

const annoucementSchema = new mongoose.Schema({

  listing:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form'
  },

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  actionType:{
    type: String,
    enum: ['announcement', 'book_now', 'buy_tickets', 'contact_us', 'get_offer', 'get_quote', 'join_now', 'learn_more', 'print_coupon', 'reserve_now', "schedule_appointment"],
    required: true
  },

  title:{
    type: String,
    required: true
  },

  description:{
    type: String,
    required: true
  },


},{timestamps: true});

const Announcement = mongoose.model('Announcement', annoucementSchema);

export default Announcement;