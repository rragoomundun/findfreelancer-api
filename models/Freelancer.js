import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const FreelancerSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    required: true
  },
  location: {
    town: String,
    countryCode: String
  },
  hourlyRate: Number,
  title: String,
  presentationText: String,
  skills: [String],
  experiences: [
    {
      title: String,
      organization: String,
      town: String,
      countryCode: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  educations: [
    {
      school: String,
      town: String,
      countryCode: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  languages: [
    {
      code: String,
      level: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native-bilingual']
      }
    }
  ]
});

export default mongoose.model('Freelancer', FreelancerSchema);
