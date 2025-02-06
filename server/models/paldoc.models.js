import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DoctorSchema = new mongoose.Schema({
    approved: {
        type: Boolean,
        default: false,
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required.'],
    },
    professionalSpecialty: {
        type: String,
        required: [true, 'Professional specialty is required.'],
    }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required.'],
        minLength: [2, "First Name must be at least 2 characters."],
        maxLength: [20, "First Name must not be longer than 20 characters."],
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required.'],
        minLength: [2, "Last Name must be at least 2 characters."],
        maxLength: [20, "Last Name must not be longer than 20 characters."],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: [true, 'This email was used before, please login or use a different email address.'],
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format.'],
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minLength: [3, "Password must be at least 3 characters."],
    },
    phonenumber: {
      type: String,
      default: "",
    },
    age: {
        type: Number,
        required: [true, 'Age is required.'],
    },
    pic: {
        type: String,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    doctor: {
        type: DoctorSchema,
        default: null,
    },
    activeChats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        } catch (error) {
            next(error);
        }
    }
    next();
});

const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Message content is required.'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: [true, 'Appointment date is required.'],
    },
    time: {
        type: String, // Keeping time as a string (e.g., "14:30" or "02:30 PM")
        required: [true, 'Appointment time is required.'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved'],
        default: 'Pending',
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const Message = mongoose.model('Message', MessageSchema);

export { User, Doctor, Appointment, Message };