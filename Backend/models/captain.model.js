import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 character long"],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 character long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  refreshToken: {
    type: String,
  },
  socketId: {
    type: String
  },
  status: {
    type: String,
    enum: ['active','inactive'],
    default: "active"
  },
  vehicle: {
    color: {
        type: String,
        required: true,
        minlength: [3,"Color must be at least 3 character long"],
    },
    plate: {
        type: String,
        required: true,
        minlength: [3,"Plate must be at least 3 character long"], 
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least one"],
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'motorcycle','auto']
    }
  },
  location: {
    latitude: {
        type: Number,   
    },
    longitude: {
        type: Number
    }
  }
});

captainSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})

captainSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

captainSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: "captain"

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

captainSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: "captain"
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const Captain = mongoose.model("Captain",captainSchema);

export default Captain;