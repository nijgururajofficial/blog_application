const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { setUser } = require("../services/auth");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    salt: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    profileImageURL: {
      type: String,
      default: "/images/defaultpf.png",
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email: email });

    if (!user) throw new Error("User Not Found!");
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (hashedPassword != userProvidedHash)
      throw new Error("Incorrect Password");

    const token = setUser(user);

    return token;
  }
);

const User = model("user", userSchema);

module.exports = User;
