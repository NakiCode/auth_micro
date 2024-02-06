import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import * as generate from "../helpers/code/generate.js";
import * as timeGenerate from "../helpers/date/time.js";
import * as hashpwd from "../helpers/pwd/hashpwd.js";

const errorMessages = {
  required: "The {PATH} is required",
  minLength: "The {PATH} must be at least {MINLENGTH} characters",
  unique: "This {PATH} already exists",
  emailFormat: "The email format is not valid",
  phoneFormat: "The phone number format is not valid",
  passwordFormat: "The password format is not valid"
};

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: [true, errorMessages.required],
      minlength: [6, errorMessages.minLength.replace("{MINLENGTH}", "6")]
    },
    username: {
      type: String,
      trim: true,
      required: [true, errorMessages.required],
      unique: [true, errorMessages.unique],
      minlength: [6, errorMessages.minLength.replace("{MINLENGTH}", "6")]
    },
    email: {
      type: String,
      trim: true,
      unique: [true, errorMessages.unique],
      required: [true, errorMessages.required],
      validate: [validator.isEmail, errorMessages.emailFormat]
    },
    phone: {
      type: String,
      trim: true,
      unique: [true, errorMessages.unique]
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, errorMessages.minLength.replace("{MINLENGTH}", "6")],
      required: [true, errorMessages.required],
      select: false
    },
    firebaseToken: {
      type: String,
      trim: true
    },
    tokenId: {
      type: String,
      default: generate.generateCode(8),
      select: false
    },
    profil: {
      type: String,
      trim: true
    },
    couverture: {
      type: String,
      trim: true
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        default: 'Point'
      },
      coordinates: {
        type: [Number]
      },
      address: {
        type: String,
        trim: true
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    phoneCode: {
      type: String,
      trim: true,
      default: generate.generateCode(4),
      select: false
    },
    emailCode: {
      type: String,
      trim: true,
      default: generate.generateCode(4),
      select: false
    },
    phoneCodeExpiresAt: {
      type: Date,
      default: timeGenerate.DefaultDateExpires()
    },
    emailCodeExpiresAt: {
      type: Date,
      default: timeGenerate.DefaultDateExpires()
    },
    signature: {
      type: String,
      trim: true,
      default: uuidv4()
    },
    role: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["ADMIN", "USER", "ANONYMOUS"],
      default: "USER"
    }
  },
  { timestamps: true }
);
// Check if the password matches
userSchema.methods.checkMatchPassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};
// Check if the code is valid
userSchema.methods.isMatchCode = function (candidateCode, code) {
  return this[candidateCode] === code ? true : false;
};
// generate a random code to phoneCode
userSchema.methods.generateCodeAndDateTime = function (
  codeField,
  datetimeField
) {
  this[codeField] = generate.generateCode(4);
  this[datetimeField] = timeGenerate.DefaultDateExpires();
};
userSchema.methods.generateCode = function (codeField) {
  this[codeField] = generate.generateCode(8);
};

userSchema.methods.isExpires = function (candidateDate) {
  const { [candidateDate]: candidate } = this;
  if (candidate && candidate instanceof Date) {
    return timeGenerate.isDateTimeExpires(candidate);
  }
  return false; // ou une autre valeur par défaut si la date candidate n'existe pas
};
// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await hashpwd.hashPwd(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

export const tbl_User = mongoose.model("tbl_User", userSchema);
