// Accessing mongoose
const mongoose=require('mongoose');
//Database connection
//mongoose.connect('mongodb+srv://userone:userone@ictakprojectfiles.z0atk.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost:27017/libraryfinal');
//Schema creation
const Schema=mongoose.Schema;
const UserSchema = new Schema({
    name:String,
    phonenumber:String,
    email:String,
    password:String,
    passwordcheck:String
    
       
    
});
//Model creation
var Userdata=mongoose.model('Userdata',UserSchema);
module.exports=Userdata;