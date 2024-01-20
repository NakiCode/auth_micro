import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";

const errorMessages = {
  required: "The {PATH} is required",
  minLength: "The {PATH} must be at least {MINLENGTH} characters",
  unique: "This {PATH} already exists",
  emailFormat: "The email format is not valid",
  phoneFormat: "The phone number format is not valid",
  passwordFormat: "The password format is not valid",
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
      unique: [true, errorMessages.unique],
      required: [true, errorMessages.required],
      validate: [validator.isMobilePhone, errorMessages.phoneFormat]
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
      default: generateCode(8),
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
    address: {
      type: String,
      trim: true
    },
    location: {
      type: [Number]
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
      trim: true
    },
    emailCode: {
      type: String,
      trim: true
    },
    phoneCodeExpiresAt: {
      type: Date
    },
    emailCodeExpiresAt: {
      type: Date
    },
    signature: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      trim: true,
      uppercase: true,
      enum: ["ADMIN", "USER", "ANONYMOUS"],
      default: "USER"
    },
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
userSchema.methods.isExpires = function (currentDateTime, givenDateTime) {
  return date.isDateTimeExpires(currentDateTime, givenDateTime);
};

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export const tbl_User = mongoose.model("tbl_User", userSchema);