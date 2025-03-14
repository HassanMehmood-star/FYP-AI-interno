const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create IndustryPartnerDetail schema
const IndustryPartnerDetailSchema = new Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryPartner',
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  linkedIn:{
    type: String,
    required: false,
  },
  logo: {
    type: String, // URL or base64-encoded logo string
    required: false,
  },
  workArrangement: {
    type: String,
    enum: ['Fully Remote', 'Hybrid', 'On-site Only'],
    required: true,
  },
  tools: {
    type: [String],
    required: true,
  },
  selectedInterns: {
    type: [String],
    required: true,
  },
  companyWebsite: {
    type: String,
    required: true,
  },
  companyLocation: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('IndustryPartnerDetail', IndustryPartnerDetailSchema);
