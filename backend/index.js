require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');


const databaseconnection = require('./connection');
const userrouter = require('./routers/user')
const adminrouter = require('./routers/admin')
const salemangerrouter = require('./routers/salemanagr');
const labourrouter = require("./routers/labour");
const hrrouter = require('./routers/hr')
const { checkAuth, restricto } = require('./middleware/Authorization');
const { authenticateJWT } = require('./service/authication');



const app = express();


const PORT = process.env.PORT || 9000;


app.set('trust proxy', 1); 

app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'none',  
        httpOnly: true,    
        maxAge: 24 * 60 * 60 * 1000  
    }
}));

const allowedOrigins = [process.env.CLIENT_ORIGIN, 'https://frontend-gd50.onrender.com'];
app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(checkAuth)
// app.use(authenticateJWT)


databaseconnection(process.env.MONGODB_URL)


app.use('/user' , userrouter);
app.use('/admin' ,adminrouter);
app.use('/salemanager', salemangerrouter);
app.use('/labour', labourrouter);
app.use('/hr' ,hrrouter )



app.listen(PORT , () => console.log("server started"))
