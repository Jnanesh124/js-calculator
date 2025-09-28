
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Telegram Bot Token - You'll need to get this from @BotFather
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7999034847:AAEBOHzENqFZm1KqXWTjUHx7WlSaBFrRXJI';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Storage configuration for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'attached_assets/uploaded_movies';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'movie_poster_' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

// Movies data storage
let moviesData = [];

// Load existing movies data
function loadMoviesData() {
    try {
        if (fs.existsSync('movies_data.json')) {
            const data = fs.readFileSync('movies_data.json', 'utf8');
            moviesData = JSON.parse(data);
        }
    } catch (error) {
        console.log('No existing movies data found, starting fresh');
        moviesData = [];
    }
}

// Save movies data
function saveMoviesData() {
    fs.writeFileSync('movies_data.json', JSON.stringify(moviesData, null, 2));
}

// Initialize movies data
loadMoviesData();

// Telegram Bot Commands
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
🎬 Welcome to MovieStream Bot!

Commands:
/addmovie - Add a new movie (follow the prompts)
/listmovies - View all movies
/help - Show this help message

To add a movie, use /addmovie and I'll guide you through the process!
    `);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
🎬 MovieStream Bot Commands:

/start - Welcome message
/addmovie - Add a new movie
/listmovies - View all uploaded movies
/help - Show this help

To add a movie:
1. Type /addmovie
2. Send movie title
3. Send movie genre
4. Send movie rating (e.g., 8.5)
5. Send movie poster image
6. Send movie description

Your movie will be automatically added to the website!
    `);
});

bot.onText(/\/listmovies/, (msg) => {
    const chatId = msg.chat.id;
    
    if (moviesData.length === 0) {
        bot.sendMessage(chatId, '📽️ No movies uploaded yet. Use /addmovie to add your first movie!');
        return;
    }
    
    let moviesList = '🎬 Uploaded Movies:\n\n';
    moviesData.forEach((movie, index) => {
        moviesList += `${index + 1}. ${movie.title}\n`;
        moviesList += `   Genre: ${movie.genre}\n`;
        moviesList += `   Rating: ⭐ ${movie.rating}/10\n\n`;
    });
    
    bot.sendMessage(chatId, moviesList);
});

// Movie upload process
const userSessions = {};

bot.onText(/\/addmovie/, (msg) => {
    const chatId = msg.chat.id;
    userSessions[chatId] = { step: 'title' };
    bot.sendMessage(chatId, '🎬 Let\'s add a new movie!\n\nPlease send the movie title:');
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const session = userSessions[chatId];
    
    if (!session) return;
    
    if (msg.text && msg.text.startsWith('/')) return;
    
    switch (session.step) {
        case 'title':
            session.title = msg.text;
            session.step = 'genre';
            bot.sendMessage(chatId, `✅ Title: "${msg.text}"\n\nNow send the genre (e.g., "Action • Adventure"):`);
            break;
            
        case 'genre':
            session.genre = msg.text;
            session.step = 'rating';
            bot.sendMessage(chatId, `✅ Genre: "${msg.text}"\n\nNow send the rating (e.g., 8.5):`);
            break;
            
        case 'rating':
            const rating = parseFloat(msg.text);
            if (isNaN(rating) || rating < 0 || rating > 10) {
                bot.sendMessage(chatId, '❌ Please enter a valid rating between 0 and 10:');
                return;
            }
            session.rating = rating;
            session.step = 'poster';
            bot.sendMessage(chatId, `✅ Rating: ${rating}/10\n\nNow send the movie poster image:`);
            break;
            
        case 'description':
            session.description = msg.text;
            
            // Create movie object
            const newMovie = {
                id: moviesData.length + 1,
                title: session.title,
                genre: session.genre,
                rating: session.rating,
                description: session.description,
                poster: session.poster,
                year: new Date().getFullYear(),
                addedAt: new Date().toISOString()
            };
            
            // Add to movies data
            moviesData.push(newMovie);
            saveMoviesData();
            
            // Update website
            updateWebsite();
            
            bot.sendMessage(chatId, `🎉 Movie added successfully!\n\n🎬 "${newMovie.title}"\n📁 ${newMovie.genre}\n⭐ ${newMovie.rating}/10\n\nYour movie is now live on the website!`);
            
            // Clear session
            delete userSessions[chatId];
            break;
    }
});

bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const session = userSessions[chatId];
    
    if (!session || session.step !== 'poster') return;
    
    // Get the highest resolution photo
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    
    bot.getFile(fileId).then((file) => {
        const fileUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
        const fileName = `movie_poster_${Date.now()}_${Math.round(Math.random() * 1E9)}.jpg`;
        const filePath = path.join('attached_assets/uploaded_movies', fileName);
        
        // Download and save the image
        const https = require('https');
        const fileStream = fs.createWriteStream(filePath);
        
        https.get(fileUrl, (response) => {
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                session.poster = `attached_assets/uploaded_movies/${fileName}`;
                session.step = 'description';
                bot.sendMessage(chatId, `✅ Poster uploaded!\n\nFinally, send a brief description of the movie:`);
            });
        });
    }).catch((error) => {
        bot.sendMessage(chatId, '❌ Error uploading poster. Please try again.');
        console.error('Error downloading photo:', error);
    });
});

// Function to update the website with new movies
function updateWebsite() {
    // Read current HTML
    let html = fs.readFileSync('index.html', 'utf8');
    
    // Generate movie cards HTML
    let moviesHtml = '';
    moviesData.forEach((movie, index) => {
        moviesHtml += `
            <div class="movie-card" data-movie="${movie.id}">
                <div class="movie-poster">
                    <img src="${movie.poster}" alt="${movie.title}" />
                    <div class="movie-overlay">
                        <button class="play-btn">▶ Play</button>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-description">${movie.genre} • ${movie.year}</p>
                    <p class="movie-rating">⭐ ${movie.rating}/10</p>
                </div>
            </div>`;
    });
    
    // Replace the movies grid section
    const gridStart = html.indexOf('<section class="movies-grid">');
    const gridEnd = html.indexOf('</section>', gridStart) + '</section>'.length;
    
    if (gridStart !== -1 && gridEnd !== -1) {
        const newGridSection = `<section class="movies-grid">${moviesHtml}\n        </section>`;
        html = html.substring(0, gridStart) + newGridSection + html.substring(gridEnd);
        
        // Write updated HTML
        fs.writeFileSync('index.html', html);
        console.log('Website updated with new movies');
    }
    
    // Update JavaScript with new movie data
    updateMovieScript();
}

function updateMovieScript() {
    const scriptPath = 'brain/js/script.js';
    let script = fs.readFileSync(scriptPath, 'utf8');
    
    // Create movies object for JavaScript
    const jsMoviesObj = {};
    moviesData.forEach(movie => {
        jsMoviesObj[movie.id] = {
            title: movie.title,
            genre: movie.genre,
            rating: `${movie.rating}/10`,
            year: movie.year.toString(),
            description: movie.description
        };
    });
    
    // Replace the movies object in the script
    const moviesStart = script.indexOf('const movies = {');
    const moviesEnd = script.indexOf('};', moviesStart) + 2;
    
    if (moviesStart !== -1) {
        const newMoviesObj = `const movies = ${JSON.stringify(jsMoviesObj, null, 8)}`;
        script = script.substring(0, moviesStart) + newMoviesObj + script.substring(moviesEnd);
        fs.writeFileSync(scriptPath, script);
    }
}

// API endpoints
app.get('/api/movies', (req, res) => {
    res.json(moviesData);
});

app.post('/api/movies', upload.single('poster'), (req, res) => {
    const { title, genre, rating, description } = req.body;
    const poster = req.file ? req.file.path : null;
    
    if (!title || !genre || !rating || !poster) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newMovie = {
        id: moviesData.length + 1,
        title,
        genre,
        rating: parseFloat(rating),
        description,
        poster,
        year: new Date().getFullYear(),
        addedAt: new Date().toISOString()
    };
    
    moviesData.push(newMovie);
    saveMoviesData();
    updateWebsite();
    
    res.json({ success: true, movie: newMovie });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🎬 MovieStream Bot Server running on port ${port}`);
    console.log(`📱 Telegram Bot is active`);
    console.log(`🌐 Website running on port 5000`);
});
