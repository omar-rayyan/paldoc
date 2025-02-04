import mongoose from 'mongoose';

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
    email: {
        type: Number,
        required: [true, 'Total dish minutes is required.'],
        min: [2, "Total dish minutes must at least be 2."],
        max: [240, "Total dish minutes must not be more than 240."],
    },
    password: {
        type: String,
        required: [true, 'Dish directions is required.'],
        minLength: [3, "Dish directions must be at least 3 characters."],
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;