import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { DatabaseConnection } from './Project_Reload/DatabaseConnection.js'
import { projectRoute } from './Project_Reload/ProjectsRouting/createRoute.js'
import { authRouter } from './Project_Reload/Authentication/AuthRouter.js'
import cookieParser from 'cookie-parser'
// import { router } from './Project_Reload/pdfOrFile/DocumentRoute.js'
// import { router } from './Project_Reload/handlePdf/docsUpload.js'
import { fileURLToPath } from 'url'
import path from 'path'
import { pdfRouter } from './Project_Reload/pdfOrFile/pdfCounter/uploadPdf.js'
import fs from 'fs'
import { libRoute } from './Project_Reload/LibraryPoint/libraryRoute.js'

dotenv.config();
const app = express();



// Frontend Urls
const backendUrl = 'https://portfolio-frontend-92nm.onrender.com'
const backendTrilUrl = 'http://localhost:10000'

app.use(express.json());
app.use(cookieParser())
app.use(cors());
app.use(cors({
    origin: backendUrl || backendTrilUrl // Frontend URL
}));


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/postpdf/getPdf', express.static(
    path.join(__dirname, 'Project_Reload', 'pdfOrFile', 'pdfCounter', 'pdfs')
));


const pdfsDir = path.join(
    __dirname,
    'Project_Reload',
    'pdfOrFile',
    'pdfCounter',
    'pdfs'
);

if (!fs.existsSync(pdfsDir)) {
    console.error('PDF directory not found:', pdfsDir);
    process.exit(1);
}
app.use('/pdfs', express.static(pdfsDir));

app.use(express.urlencoded({ extended: true }));

DatabaseConnection();

app.use('/project', projectRoute);
app.use('/auth', authRouter);
app.use('/postpdf', pdfRouter)
app.use('/postLib', libRoute)

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Backend is running...')
})

app.listen(port, () => {
    console.log(`The port is running on http://localhost:${port}`);
})