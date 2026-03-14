
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import connectDB from './config/db.js'; // Import the DB connection
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import appVersionRoutes from './routes/appVersionRoutes.js';
import { versionCheckMiddleware } from './middlewares/versionCheckMiddleware.js';

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Connect to the MongoDB database
connectDB();


// Middleware setup (e.g., body parsers, etc.)
// Enable CORS
app.use(cors({
    origin: '*', // In production, specify your frontend domain
    credentials: true
}));

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Version check middleware (applied to all routes except app-version endpoints)
app.use(versionCheckMiddleware);

// API routes (must come before static files)
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/app-version', appVersionRoutes);

// Serve React build in production
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
const publicPath = path.join(__dirname, '..', 'public');

// Check if React build exists
const frontendExists = fs.existsSync(frontendPath);
const publicExists = fs.existsSync(publicPath);

// Debug logging
console.log('=== Frontend Configuration ===');
console.log('isProduction:', isProduction);
console.log('frontendPath:', frontendPath);
console.log('frontendExists:', frontendExists);
console.log('publicPath:', publicPath);
console.log('publicExists:', publicExists);
if (publicExists) {
    console.log('Public files:', fs.readdirSync(publicPath));
}

// Serve static files and React app
// Priority: React build > Public HTML files (as fallback)
if (frontendExists) {
    console.log('Serving React build from:', frontendPath);
    
    // Serve static files from React build (CSS, JS, images, etc.)
    app.use(express.static(frontendPath, {
        maxAge: '1y',
        etag: false
    }));
    
    // Serve React app for all non-API routes (SPA routing)
    // This must be the LAST route handler
    app.get('*', (req, res) => {
        // Skip API routes - they should have been handled above
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API endpoint not found' });
        }
        
        // Send React app index.html for all other routes
        const indexPath = path.join(frontendPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).json({ message: 'React app not found. Please build the frontend.' });
        }
    });
} else if (publicExists) {
    // Fallback: serve public HTML files (works in both dev and production)
    console.log('Serving public HTML files from:', publicPath, '(React build not found)');
    
    // Serve static files from public directory
    app.use(express.static(publicPath, {
        maxAge: '1d',
        etag: false
    }));
    
    // Serve index.html for root
    app.get('/', (req, res) => {
        const indexPath = path.join(publicPath, 'index.html');
        console.log('Serving index.html from:', indexPath);
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('index.html not found');
        }
    });
    
    // Serve home.html for /home and /home.html
    app.get('/home', (req, res) => {
        const homePath = path.join(publicPath, 'home.html');
        console.log('Serving home.html from:', homePath);
        if (fs.existsSync(homePath)) {
            res.sendFile(homePath);
        } else {
            res.status(404).send('home.html not found');
        }
    });
    
    app.get('/home.html', (req, res) => {
        const homePath = path.join(publicPath, 'home.html');
        console.log('Serving home.html from:', homePath);
        if (fs.existsSync(homePath)) {
            res.sendFile(homePath);
        } else {
            res.status(404).send('home.html not found');
        }
    });
    
    // Serve login page (if exists in public)
    app.get('/login', (req, res) => {
        const loginPath = path.join(publicPath, 'index.html');
        if (fs.existsSync(loginPath)) {
            res.sendFile(loginPath);
        } else {
            res.status(404).send('Login page not found');
        }
    });
    
    // Catch all other routes - serve index.html for SPA-like behavior
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API endpoint not found' });
        }
        
        // Try to serve the requested file, or fallback to index.html
        const requestedPath = path.join(publicPath, req.path);
        if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
            res.sendFile(requestedPath);
        } else {
            // Fallback to index.html for SPA routing
            const indexPath = path.join(publicPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.status(404).send('Page not found');
            }
        }
    });
} else {
    console.log('No frontend build found. API only mode.');
    
    // If no frontend build exists, return 404 for non-API routes
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API endpoint not found' });
        }
        res.status(404).json({ 
            message: 'Frontend not built. Please build React app first.',
            hint: 'Run: cd frontend && npm run build'
        });
    });
}

// Set the port for the server to listen
const PORT = process.env.PORT || 5554;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
