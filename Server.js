import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { DatabaseConnection } from './Project_Reload/DatabaseConnection.js'
import { projectRoute } from './Project_Reload/ProjectsRouting/createRoute.js'
import { authRouter } from './Project_Reload/Authentication/AuthRouter.js'
import cookieParser from 'cookie-parser'
// import { router } from './Project_Reload/pdfOrFile/DocumentRoute.js'
import { router } from './Project_Reload/handlePdf/docsUpload.js'
import { fileURLToPath } from 'url'
import path from 'path'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
}));
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use(express.urlencoded({ extended: true }));

DatabaseConnection();

app.use('/project', projectRoute);
app.use('/auth', authRouter);
app.use('/postpdf', router)

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Backend is running...')
})

app.listen(port, () => {
    console.log(`The port is running on http://localhost:${port}`);
})