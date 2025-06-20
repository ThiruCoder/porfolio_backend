import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { DatabaseConnection } from './Project_Reload/DatabaseConnection.js'
import { authRouter } from './Project_Reload/Authentication/AuthRouter.js'
import cookieParser from 'cookie-parser'
// import { router } from './Project_Reload/pdfOrFile/DocumentRoute.js'
// import { router } from './Project_Reload/handlePdf/docsUpload.js'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { libRoute } from './Project_Reload/LibraryPoint/libraryRoute.js'
import { resumeRouter } from './Project_Reload/ProjectsRouting/ResumeRouting/router.js'
import { projectRouter } from './Project_Reload/ProjectsRouting/ProjectRoutes/Router_Publisher.js'
import { sendMailRouter } from './Project_Reload/Mail_Routing/publisher_Router.js'

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// Frontend Urls
const frontendUrls = [
    'https://portfolio-frontend-92nm.onrender.com',
    'http://localhost:3000',
    'https://portfolio-thirucoders-projects.vercel.app'
]

app.use(express.json());
app.use(cookieParser());
app.use(cors());
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || frontendUrls.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }));

DatabaseConnection();

app.use('/project', projectRouter);
app.use('/auth', authRouter);
app.use('/postLib', libRoute);
app.use('/resume', resumeRouter);
app.use('/send', sendMailRouter);



app.get('/', (req, res) => {
    res.send('Backend is running...')
})

app.listen(port, () => {
    console.log(`The port is running on http://localhost:${port}`);
})