const mongoose = require('mongoose');
const connectDB = async()=>{
    await mongoose.connect(
        'mongodb+srv://namastenode:wkjUAruzqx3chjys@namastenode.04nug.mongodb.net/codemate?retryWrites=true&w=majority'
    );
};
module.exports={
    connectDB,
};

