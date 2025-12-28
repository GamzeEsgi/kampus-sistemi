const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', { serverSelectionTimeoutMS: 5000 })
    .then(() => { console.log('CONNECTED'); process.exit(0); })
    .catch(err => { console.log('FAILED:' + err.name + ':' + err.message); process.exit(1); });
