
//  https://mongoosejs.com/docs/4.x/docs/validation.html

// var emailValidator = [validate({message: "Email Address should be between 5 and 64 characters"},'len', 5, 64), validate({message: "Email Address is not correct"},'isEmail')];

// var XXXX = new Schema({
// email : {type: String, required: true, validate: emailValidator} }); 

// var UserSchema = new mongoose.Schema (
//     {
//         username: {
//             type: String,
//             minlength: [2, 'Username must be at least 2 characters.'],
//             maxlength: [20, 'Username must be less than 20 characters.'],
//             required: [true, 'Your username cannot be blank.'],
//             trim: true,
//             unique: true, // username must be unique
//             dropDups: true,
//         }, // end username field
//     },
//     {
//         timestamps: true,
//     },
// );

// var userSchema = new Schema({
//     phone: {
//       type: String,
//       validate: {
//         validator: function(v) {
//           return /\d{3}-\d{3}-\d{4}/.test(v);
//         },
//         message: '{VALUE} is not a valid phone number!'
//       },
//       required: [true, 'User phone number required']
//     }
//   });