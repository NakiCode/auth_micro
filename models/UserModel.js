import bcrypt from "bcrypt";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: [true, "The Fullname is required"],
        minLenght: [6, "The fullname must be at least 6 characters"]
    },
    username: {
        type: String,
        trim: true,
        required: [true, "The Username is required"],
        unique: [true, "This Username already exists"],
        minLenght: [6, "The username must be at least 6 characters"]
    },
    email: {
        type: String,
        trim: true,
        unique: [true, "This Email already exists"],
        required: [true, "The Email address is required"],
        validate: [validator.isEmail, "The email format is not valid"]
    },
    phone: {
        type: String,
        trim: true,
        unique: [true, "The phone number is already exists"],
        required: [true, "The Phone number is required"],
        validate: [validator.isMobilePhone, "The Phone number format is not valid"]
    },
    isPhone: {
        type: Boolean,
        default: false
    },
    isEmail: {
        type: Boolean,
        default: false
    },
    cordinate: {
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
        minLenght: [6, "The password must be at least 6 characters"],
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(value);
            },
            message: "The password format is not valid"
        },
        required: [true, "The password is required"],
        select: false
    },
    code: {
        type: String,
        select: false
    },
    firebaseToken: {
        type: String,
        trim: true,
        select: false
    },
    tokenId: {
        type: String,
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
}, { timestamps: true })

// check if the entry passwrd is match on compare 
userSchema.methods.checkMatchPassword = async function (canditatePassword, password) {
    return await bcrypt.compare(canditatePassword, password)
}
// hash password on save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export const tbl_User = mongoose.model("tbl_User", userSchema);