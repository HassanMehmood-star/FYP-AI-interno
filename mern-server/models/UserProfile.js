const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photo: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  education: [{ degree: String, institute: String, year: String }],
  skills: { technical: [String], soft: [String] },
  experience: [{ title: String, duration: String, description: String }],
  interests: [String],
});

module.exports = mongoose.model("Profile", profileSchema);
