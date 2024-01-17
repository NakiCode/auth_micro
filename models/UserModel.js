import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";
import generateCode from "../helpers/code/codeGenerate";

const errorMessages = {
  required: "The {PATH} is required",
  minLength: "The {PATH} must be at least {MINLENGTH} characters",
  unique: "This {PATH} already exists",
  emailFormat: "The email format is not valid",
  phoneFormat: "The phone number format is not valid",
  passwordFormat: "The password format is not valid",
};

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    trim: true,
    required: [true, errorMessages.required],
    minLength: [6, errorMessages.minLength.replace("{MINLENGTH}", "6")],
  },
  username: {
    type: String,
    trim: true,
    required: [true, errorMessages.required],
    unique: [true, errorMessages.unique],
    minLength: [6, errorMessages.minLength.replace("{MINLENGTH}", "6")],
  },
  email: {
    type: String,
    trim: true,
    unique: [true, errorMessages.unique],
    required: [true, errorMessages.required],
    validate: [validator.isEmail, errorMessages.emailFormat],
  },
  phone: {
    type: String,
    trim: true,
    unique: [true, errorMessages.unique],
    required: [true, errorMessages.required],
    validate: [validator.isMobilePhone, errorMessages.phoneFormat],
  },
  isPhone: {
   type: Boolean,
    default: false
  },
  isEmail: {
    type: Boolean,
    default: false
  },
  coordinate: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      trim: true
    },
    index: "2dsphere"
  },
  password: {
    type: String,
    trim: true,
    minLength: [6, errorMessages.minLength.replace("{MINLENGTH}", "6")],
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(value);
      },
      message: errorMessages.passwordFormat
    },
    required: [true, errorMessages.required],
    select: false
  },
  code: {
    type: String,
    trim: true,
    default: generateCode(6),
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
  role: {
    type: String,
    trim: true,
    uppercase: true,
    enum: ["ADMIN", "USER", "ANONYMOUS"],
    default: "USER"
  }
}, { timestamps: true });

// Vérifie si le mot de passe correspond
userSchema.methods.checkMatchPassword = async (candidatePassword, password) => {
  try {
    return await bcrypt.compare(candidatePassword, password);
  } catch (error) {
    // Gérer l'erreur ici
    throw error;
  }
};

// Hash le mot de passe avant de le sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    // Gérer l'erreur ici
    next(error);
  }
});

export const tbl_User = mongoose.model("tbl_User", userSchema);