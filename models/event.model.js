import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

  listing:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form'
    },

  user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

  title:{
    type: String,
    required: true
  },

  location:{
    address:{
      type: String,
      required: true
    },

    latitude:{
      type: Number,
      required: true
    },

    longitude:{
      type: Number,
      required: true
    }
  },

  eventStart: {
    startDate: {
      type: String,
      required: true
    },

    startTime: {
      type: String,
      required: true
    }
  },

  eventEnd: {
    endDate: {
      type: String
    },
    endTime: {
      type: String
    }
  },

  description: {
    type: String,
    required: true
  },

  eventTickets:[ {
    platform: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],

  eventImage: {
    imageUrl:{type:String},
    publicId:{type:String}
  }


}, {timestams:true});

const Event = mongoose.model('Event', eventSchema);

export default Event;