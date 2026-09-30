require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const UserRoutes = require('./routes/authRoutes');
const CompanyRoutes = require('./routes/companyRoutes');
const JobRoutes = require('./routes/jobRoutes');
const ApplicationRoutes = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorHandler');
const {generalLimiter, authLimiter} = require('./config/rateLimiter');
const morgan = require('morgan');
const {port, env} = require('./config/config');



const app = express();


 // security middlewares   
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter); // apply before all routes

if (env === 'development') {
    app.use(morgan('dev'));
}


app.use('/api/v1/auth', authLimiter, UserRoutes);
app.use('/api/v1/companies', CompanyRoutes);
app.use('/api/v1/jobs', JobRoutes);
app.use('/api/v1/applications', ApplicationRoutes);
app.use(errorHandler);


connectDB().then(() => {
    app.listen(port, () => {
        console.log('Server running on port ' + port);
    });
});


module.exports = app;