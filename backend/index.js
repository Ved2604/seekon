import express from 'express';
import dotenv from 'dotenv';
import connect from './db/database.js';  
import { loginUser } from './controllers/login.controller.js';
import { signupUser } from './controllers/signin.contoller.js';
import { logoutUser } from './controllers/logout.controller.js'; 
import { getUserByUsername } from './controllers/getuser.controller.js';
import cors from 'cors'



// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to the database
connect();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors())
// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
}); 


app.post('/api/auth/login', loginUser);
app.post('/api/auth/signup', signupUser);
app.post('/api/auth/logout', logoutUser);

app.get('/api/user/:username', getUserByUsername);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
