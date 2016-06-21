var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: /.+\@.+\..+/
  },
  username: {
    type: String,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    validate: [
      function (password) {
        return password.length >= 6;
      },
      'password should be longer'
    ]
  },
  created: {
    type: Date,
    default: Date.now
  },
  website: {
    type: String,
    set: function (url) {
      if (!url){
        return url;
      } else {
        if(url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
          url = 'htpp://' + url;
        }
        return url;
      }
    }
  },
  role: {
    type: String,
    enum: ['Admin', 'Owner', 'User']
  }

});

// Virtual attributes
UserSchema.virtual('fullName')
  .get(function () {
  return this.firstName + ' ' + this.lastName;
}).set(function (fullName) {
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

// Static Method
UserSchema.statics.findOneByUsername = function (username, callback) {
  this.findOne({username: new RegExp(username, 'i') }, callback);
};

// Method
UserSchema.methods.authenticate = function (password) {
  return this.password = password;
};
// http://mongoosejs.com/docs/middleware.html
UserSchema.post('save', function (next) {
  if(this.isNew) {
    console.log('A new user was created.');
  } else {
    console.log("A user updated is details");
  }
});

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

mongoose.model('User', UserSchema);
