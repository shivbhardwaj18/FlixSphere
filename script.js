// --- MOCK DATA & CONFIG ---
const allMedia = [
    { id: 1, title: 'Attack on Titan', genre: 'Anime', rating: 9.1, type: 'series', year: 2013, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Attack+on+Titan', description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.' },
    { id: 2, title: 'Breaking Bad', genre: 'Drama', rating: 9.5, type: 'series', year: 2008, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Breaking+Bad', description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.' },
    { id: 3, title: 'Inception', genre: 'Sci-Fi', rating: 8.8, type: 'movie', year: 2010, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.' },
    { id: 4, title: 'Spirited Away', genre: 'Anime', rating: 8.6, type: 'movie', year: 2001, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Spirited+Away', description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.' },
    { id: 5, title: 'The Dark Knight', genre: 'Action', rating: 9.0, type: 'movie', year: 2008, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=The+Dark+Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.' },
    { id: 6, title: 'Stranger Things', genre: 'Sci-Fi', rating: 8.7, type: 'series', year: 2016, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Stranger+Things', description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.' },
    { id: 7, title: 'Death Note', genre: 'Anime', rating: 8.9, type: 'series', year: 2006, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Death+Note', description: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook that can kill anyone whose name is written in it.' },
    { id: 8, title: 'Pulp Fiction', genre: 'Crime', rating: 8.9, type: 'movie', year: 1994, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Pulp+Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.' },
    { id: 9, title: 'The Office', genre: 'Comedy', rating: 8.9, type: 'series', year: 2005, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=The+Office', description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.' },
    { id: 10, title: 'Parasite', genre: 'Thriller', rating: 8.5, type: 'movie', year: 2019, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Parasite', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
    { id: 11, title: 'Your Name', genre: 'Anime', rating: 8.4, type: 'movie', year: 2016, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Your+Name', description: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?' },
    { id: 12, title: 'Game of Thrones', genre: 'Fantasy', rating: 9.2, type: 'series', year: 2011, poster: 'https://placehold.co/400x600/1a202c/ffffff?text=Game+of+Thrones', description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.' },
];
const genres = ['All', ...new Set(allMedia.map(item => item.genre))];
const ITEMS_PER_PAGE = 6;

// --- APPLICATION STATE ---
let state = {
    currentPage: 'home',
    currentUser: null, // or { email: 'user@example.com' }
    watchlist: [], // array of media IDs
    filters: {
        genre: 'All',
        sortBy: 'rating',
    },
    pagination: {
        currentPage: 1,
    },
    selectedMediaId: null,
};

// --- DOM ELEMENT REFERENCES ---
const headerContainer = document.getElementById('header-container');
const pageContainer = document.getElementById('page-container');
const modalContainer = document.getElementById('modal-container');

// --- RENDER FUNCTIONS ---

// Render Header based on login state
function renderHeader() {
    const user = state.currentUser;
    headerContainer.innerHTML = `
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-red-500 cursor-pointer" data-page="home">FlixSphere</h1>
            <nav class="flex items-center space-x-4 md:space-x-6">
                <button data-page="home" class="hover:text-red-400 transition">Home</button>
                ${user ? '<button data-page="watchlist" class="hover:text-red-400 transition">Watchlist</button>' : ''}
                ${user ? 
                    '<button id="logout-btn" class="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition font-semibold">Logout</button>' :
                    '<button data-page="login" class="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition font-semibold">Login</button>'}
            </nav>
        </div>
    `;
}

// Render Home Page with filters, sorting, and media grid
function renderHomePage() {
    // Apply filters and sorting
    let media = [...allMedia];
    if (state.filters.genre !== 'All') {
        media = media.filter(item => item.genre === state.filters.genre);
    }
    media.sort((a, b) => b[state.filters.sortBy] - a[state.filters.sortBy]);

    // Apply pagination
    const totalPages = Math.ceil(media.length / ITEMS_PER_PAGE);
    const paginatedMedia = media.slice(
        (state.pagination.currentPage - 1) * ITEMS_PER_PAGE,
        state.pagination.currentPage * ITEMS_PER_PAGE
    );

    const mediaGridHTML = paginatedMedia.length > 0 ? paginatedMedia.map(item => `
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer" data-media-id="${item.id}">
            <img src="${item.poster}" alt="${item.title}" class="w-full h-auto object-cover pointer-events-none" />
            <div class="p-4 pointer-events-none">
                <h3 class="font-bold text-lg text-white truncate">${item.title}</h3>
                <div class="flex justify-between items-center mt-2 text-gray-400">
                    <span>${item.year}</span>
                    <span class="flex items-center">
                        <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        ${item.rating}
                    </span>
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="col-span-full text-center text-gray-400 mt-16">
            <h2 class="text-2xl">No results found.</h2>
            <p>Try adjusting your filters.</p>
        </div>
    `;
    
    const paginationHTML = totalPages > 1 ? `
        <div class="col-span-full flex justify-center items-center space-x-2 mt-8">
            <button id="prev-page" class="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600" ${state.pagination.currentPage === 1 ? 'disabled' : ''}>
                Previous
            </button>
            <span class="text-white">${state.pagination.currentPage} / ${totalPages}</span>
            <button id="next-page" class="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600" ${state.pagination.currentPage === totalPages ? 'disabled' : ''}>
                Next
            </button>
        </div>` : '';


    pageContainer.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg">
            <div class="flex items-center space-x-4 mb-4 md:mb-0">
                <label for="genre" class="text-white">Genre:</label>
                <select id="genre-filter" class="bg-gray-700 text-white p-2 rounded-md">
                    ${genres.map(g => `<option value="${g}" ${state.filters.genre === g ? 'selected' : ''}>${g}</option>`).join('')}
                </select>
            </div>
            <div class="flex items-center space-x-4">
                <label for="sort" class="text-white">Sort By:</label>
                <select id="sort-by" class="bg-gray-700 text-white p-2 rounded-md">
                    <option value="rating" ${state.filters.sortBy === 'rating' ? 'selected' : ''}>Rating</option>
                    <option value="year" ${state.filters.sortBy === 'year' ? 'selected' : ''}>Year</option>
                </select>
            </div>
        </div>
        <div id="media-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            ${mediaGridHTML}
            ${paginationHTML}
        </div>
    `;
}

// Render Watchlist Page
function renderWatchlistPage() {
    const watchlistItems = allMedia.filter(item => state.watchlist.includes(item.id));
    const watchlistHTML = watchlistItems.length > 0 ? watchlistItems.map(item => `
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer" data-media-id="${item.id}">
            <img src="${item.poster}" alt="${item.title}" class="w-full h-auto object-cover pointer-events-none" />
            <div class="p-4 pointer-events-none">
                <h3 class="font-bold text-lg text-white truncate">${item.title}</h3>
                <div class="flex justify-between items-center mt-2 text-gray-400">
                    <span>${item.year}</span>
                </div>
            </div>
        </div>
    `).join('') : `
        <div class="text-center text-gray-400 mt-16">
            <h2 class="text-2xl">Your watchlist is empty.</h2>
            <p>Add some movies, series, or anime to see them here.</p>
        </div>
    `;
    pageContainer.innerHTML = `
        <h2 class="text-3xl font-bold text-white mb-8 border-l-4 border-red-500 pl-4">My Watchlist</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            ${watchlistHTML}
        </div>
    `;
}

// Render Login/Sign-up Page
function renderLoginPage(isLogin = true) {
    headerContainer.innerHTML = ''; // Hide header on auth pages
    pageContainer.innerHTML = `
        <div class="min-h-screen flex items-center justify-center -m-8">
            <div class="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 class="text-3xl font-bold text-center text-white mb-6">${isLogin ? 'Login' : 'Sign Up'}</h2>
                <form id="auth-form">
                    ${!isLogin ? `
                        <div class="mb-4">
                            <label class="block text-gray-400 mb-2" for="username">Username</label>
                            <input class="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500" type="text" id="username" placeholder="Choose a username" required />
                        </div>` : ''
                    }
                    <div class="mb-4">
                        <label class="block text-gray-400 mb-2" for="email">Email</label>
                        <input class="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500" type="email" id="email" placeholder="you@example.com" required />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-400 mb-2" for="password">Password</label>
                        <input class="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500" type="password" id="password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition">
                        ${isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <p class="text-center text-gray-400 mt-6">
                    ${isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button id="toggle-auth" class="text-red-500 hover:underline ml-2 font-semibold">
                        ${isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    `;
}

// Render 404 Error Page
function renderErrorPage() {
    pageContainer.innerHTML = `
         <div class="min-h-[70vh] flex flex-col items-center justify-center text-white text-center">
            <h1 class="text-9xl font-bold text-red-500">404</h1>
            <h2 class="text-4xl font-semibold mt-4 mb-2">Page Not Found</h2>
            <p class="text-gray-400 mb-8">Sorry, the page you are looking for does not exist.</p>
            <button data-page="home" class="bg-red-600 px-6 py-3 rounded-md hover:bg-red-700 transition font-semibold">
                Go Back Home
            </button>
        </div>
    `;
}

// Render Modal with item details
function renderModal() {
    const item = allMedia.find(m => m.id === state.selectedMediaId);
    if (!item) {
        modalContainer.classList.add('hidden');
        modalContainer.innerHTML = '';
        return;
    }

    const isAdded = state.watchlist.includes(item.id);
    modalContainer.innerHTML = `
         <div class="bg-gray-800 text-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto modal-content" id="modal-content">
            <div class="p-4 md:p-8 relative">
                <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <div class="md:flex md:space-x-8">
                    <div class="md:w-1/3 flex-shrink-0">
                        <img src="${item.poster}" alt="${item.title}" class="w-full rounded-lg shadow-lg" />
                    </div>
                    <div class="md:w-2/3 mt-6 md:mt-0">
                        <h2 class="text-3xl font-bold mb-2">${item.title} (${item.year})</h2>
                        <div class="flex items-center space-x-4 mb-4 text-gray-300">
                            <span class="px-3 py-1 bg-gray-700 rounded-full text-sm">${item.genre}</span>
                            <span class="flex items-center">
                                <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                <span class="font-bold text-lg">${item.rating}</span> / 10
                            </span>
                        </div>
                        <p class="text-gray-300 mb-6">${item.description}</p>
                        <button id="watchlist-toggle" class="w-full py-3 rounded-lg font-semibold transition ${isAdded ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-red-600 hover:bg-red-700 text-white'}">
                            ${isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    modalContainer.classList.remove('hidden');
}

// --- ROUTER & EVENT HANDLERS ---

// Main router function to render the correct page
function router() {
    // Reset page container for auth page special layout
    pageContainer.className = 'container mx-auto p-4 md:p-8'; 
    
    switch (state.currentPage) {
        case 'home':
            renderHeader();
            renderHomePage();
            break;
        case 'watchlist':
            if (!state.currentUser) {
                state.currentPage = 'login';
                router();
                return;
            }
            renderHeader();
            renderWatchlistPage();
            break;
        case 'login':
            pageContainer.className = ''; // Remove padding for full-screen page
            renderLoginPage(true);
            break;
        default:
            renderHeader();
            renderErrorPage();
    }
}

// Handle all clicks on the document
document.addEventListener('click', (e) => {
    // Navigation
    if (e.target.dataset.page) {
        e.preventDefault();
        state.currentPage = e.target.dataset.page;
        router();
    }
    // Logout
    if (e.target.id === 'logout-btn') {
        state.currentUser = null;
        state.watchlist = [];
        state.currentPage = 'home';
        router();
    }
    // Open Modal
    if (e.target.closest('[data-media-id]')) {
        state.selectedMediaId = parseInt(e.target.closest('[data-media-id]').dataset.mediaId, 10);
        renderModal();
    }
    // Close Modal
    if (e.target.id === 'close-modal' || e.target === modalContainer) {
        state.selectedMediaId = null;
        renderModal();
    }
    // Toggle Login/Sign-up form
    if (e.target.id === 'toggle-auth') {
        const isLogin = pageContainer.querySelector('h2').textContent === 'Login';
        renderLoginPage(!isLogin);
    }
    // Watchlist toggle in Modal
    if (e.target.id === 'watchlist-toggle') {
        if (!state.currentUser) {
            state.selectedMediaId = null;
            renderModal();
            state.currentPage = 'login';
            router();
            return;
        }
        const id = state.selectedMediaId;
        if (state.watchlist.includes(id)) {
            state.watchlist = state.watchlist.filter(i => i !== id);
        } else {
            state.watchlist.push(id);
        }
        renderModal(); // Re-render modal to update button
    }
    // Pagination
    if (e.target.id === 'prev-page') {
        state.pagination.currentPage--;
        renderHomePage();
    }
    if (e.target.id === 'next-page') {
        state.pagination.currentPage++;
        renderHomePage();
    }
});

// Handle filter/sort changes using event delegation
pageContainer.addEventListener('change', (e) => {
    if (e.target.id === 'genre-filter') {
        state.filters.genre = e.target.value;
        state.pagination.currentPage = 1; // Reset to page 1
        renderHomePage();
    }
    if (e.target.id === 'sort-by') {
        state.filters.sortBy = e.target.value;
        state.pagination.currentPage = 1; // Reset to page 1
        renderHomePage();
    }
});

// Handle Auth form submission
pageContainer.addEventListener('submit', (e) => {
    if (e.target.id === 'auth-form') {
        e.preventDefault();
        const email = e.target.querySelector('#email').value;
        // Fake login
        state.currentUser = { email };
        state.currentPage = 'home';
        router();
    }
});

// --- INITIALIZE APP ---
document.addEventListener('DOMContentLoaded', router);