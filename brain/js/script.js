/* -------------------------
    MovieStream Website ...
---------------------------*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMovieWebsite();
});

function initializeMovieWebsite() {
    // Add event listeners to movie cards
    const movieCards = document.querySelectorAll('.movie-card');
    const playButtons = document.querySelectorAll('.play-btn');
    
    // Handle movie card interactions
    movieCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the play button
            if (!e.target.closest('.play-btn')) {
                showMovieDetails(index + 1);
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Handle play button clicks
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            playMovie(index + 1);
        });
    });
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add navigation functionality here if needed
            console.log('Navigate to:', this.textContent);
        });
    });
    
    // Add search functionality simulation
    setupSearchFeature();
    
    // Add loading animation completed
    document.body.classList.add('loaded');
}

function showMovieDetails(movieId) {
    const movieData = getMovieData(movieId);
    
    // Create modal or show details
    console.log('Showing details for movie:', movieData.title);
    
    // Simple alert for demo - in real app would show a modal
    alert(`Movie: ${movieData.title}\nGenre: ${movieData.genre}\nRating: ${movieData.rating}\n\nClick the play button to watch!`);
}

function playMovie(movieId) {
    const movieData = getMovieData(movieId);
    
    console.log('Playing movie:', movieData.title);
    
    // Simulate movie playing
    alert(`Now playing: ${movieData.title}\n\nIn a real app, this would start the video player.`);
    
    // Add visual feedback
    const movieCard = document.querySelector(`[data-movie="${movieId}"]`);
    if (movieCard) {
        movieCard.style.border = '2px solid #4ecdc4';
        setTimeout(() => {
            movieCard.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }, 2000);
    }
}

function getMovieData(movieId) {
    const movies = {
        1: {
            title: 'Thunder Strike',
            genre: 'Action • Adventure',
            rating: '8.5/10',
            year: '2024',
            description: 'An epic action-adventure filled with thrilling scenes and stunning visuals.'
        },
        2: {
            title: 'Lost Kingdom',
            genre: 'Fantasy • Adventure',
            rating: '9.2/10',
            year: '2024',
            description: 'A magical journey through mystical lands and ancient secrets.'
        },
        3: {
            title: 'Shadow Hunter',
            genre: 'Thriller • Action',
            rating: '8.8/10',
            year: '2024',
            description: 'A gripping thriller with intense action and unexpected twists.'
        },
        4: {
            title: 'Cyber Genesis',
            genre: 'Sci-Fi • Action',
            rating: '9.0/10',
            year: '2024',
            description: 'A futuristic sci-fi adventure exploring the digital frontier.'
        }
    };
    
    return movies[movieId] || movies[1];
}

function setupSearchFeature() {
    // Simulate search functionality
    const searchFeature = {
        movies: ['Thunder Strike', 'Lost Kingdom', 'Shadow Hunter', 'Cyber Genesis'],
        search: function(query) {
            return this.movies.filter(movie => 
                movie.toLowerCase().includes(query.toLowerCase())
            );
        }
    };
    
    // Add to global scope for console testing
    window.movieSearch = searchFeature;
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close any modals (future feature)
    if (e.key === 'Escape') {
        console.log('ESC pressed - would close modal if open');
    }
    
    // Number keys to select movies
    if (e.key >= '1' && e.key <= '4') {
        const movieId = parseInt(e.key);
        showMovieDetails(movieId);
    }
    
    // Space to play first movie (demo)
    if (e.key === ' ') {
        e.preventDefault();
        playMovie(1);
    }
});

// Add smooth loading animation
window.addEventListener('load', function() {
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Initialize CSS animations
const style = document.createElement('style');
style.textContent = `
    .movie-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .loaded .movie-card {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);