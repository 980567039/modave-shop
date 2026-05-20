import Mongoose from "mongoose";

const { Schema } = Mongoose;

const userSchema = new Schema({
    customUserId: {
        type: String,
        unique: true
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "manager", "sales", "marketing", "inventoryManager", "subscriber"], // Define roles based on your application's needs
        default: "user",
    },
    username: {
        type: String,
        // unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    uniqueID: {
        type: String,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String, 
    },
    contactNumber: {
        type: String, 
        default: '',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isContactVerified: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"], // Define user statuses
        default: "active",
    },
    capabilities: {
        type: Array,
        default: [],
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    
},
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.customUserId) {
        try {
            const lastUser = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });

            if (lastUser && lastUser.customUserId) {
                const lastUserId = parseInt(lastUser.customUserId.slice(-9)) || 0; // Extract the last 9 digits and convert to number
                const newUserId = `USR${(lastUserId + 1).toString().padStart(9, '0')}`; // Increment the number and pad with leading zeros
                this.customUserId = newUserId;
                // this.username = newUserId;
            } else {
                this.customUserId = 'USR00000000001'; // If no existing user or customUserId, set a default value
                // this.username = 'USR0001';
            }
        } catch (error) {
            console.error('Error finding last user:', error);
        }
    }
    next();
});

const User = Mongoose.models.User || Mongoose.model('User', userSchema);

export default User;