const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  refresh_token_expires_in: {
    type: String,
  },
  id_token: {
    type: String,
  },

  expires_in: {
    type: Number,
  },

  token_type: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
