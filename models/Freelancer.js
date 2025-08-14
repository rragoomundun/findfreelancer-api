import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import cryptUtil from '../utils/crypt.util.js';

const FreelancerSchema = new Schema(
  {
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
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    image: String,
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
        title: {
          type: String,
          required: true
        },
        organization: {
          type: String,
          required: true
        },
        town: {
          type: String,
          required: true
        },
        countryCode: {
          type: String,
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
        description: {
          type: String,
          required: true
        }
      }
    ],
    educations: [
      {
        school: {
          type: String,
          required: true
        },
        town: {
          type: String,
          required: true
        },
        countryCode: {
          type: String,
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
        description: {
          type: String,
          required: true
        }
      }
    ],
    languages: [
      {
        code: {
          type: String,
          required: true
        },
        level: {
          type: String,
          enum: ['basic', 'conversational', 'fluent', 'native-bilingual'],
          required: true
        }
      }
    ],
    tokens: [
      {
        value: {
          type: String,
          required: true
        },
        expire: {
          type: Date,
          required: true
        },
        type: {
          type: String,
          enum: ['register-confirm', 'password-reset'],
          required: true
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      required: true
    }
  },
  {
    statics: {
      // Generate a new token
      generateToken: (type) => {
        const token = cryptUtil.getToken();

        return {
          decrypted: token,
          encrypted: {
            type,
            value: cryptUtil.getDigestHash(token),
            expire: Date.now() + 1000 * 60 * 60 // Expires in 1 hour
          }
        };
      }
    }
  }
);

// Encrypt password using bcrypt
FreelancerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
FreelancerSchema.methods.getSignedJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
FreelancerSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Freelancer', FreelancerSchema);
