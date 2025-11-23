const app = require('./src/app');
const connectDB = require('./src/config/database');
require('dotenv').config();


require('events').EventEmitter.defaultMaxListeners = 15;

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV}`);
});