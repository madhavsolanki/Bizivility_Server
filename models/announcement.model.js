import mongoose from "mongoose";

const annoucementSchema = new mongoose.Schema1({

  listing:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },

  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  actionType:[{
    type: String,
    enum: ['announcement', 'book_now', 'buy_tickets', 'contact_us', 'get_offer', 'get_quote', 'join_now', 'learn_more', 'print_coupon', 'reserve_now', "schedule_appointment"],
    required: true
  }],

  chooseIcon:{
    type:String,
    required:true
  },
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  buttonText:{
    type: String,
    required: true
  },
  buttonUrl:{
    type: String,
    required: true
  }


},{timestamps: true});

const Announcement = mongoose.model('Announcement', annoucementSchema);

export default Announcement;