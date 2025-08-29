const API_KEY = "your_omdb_api_key"; // Replace with your OMDb API key

let votes = {};
let movieData = [];

function initializeApp() {
  const loadBtn = document.getElementById("loadMovies");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const movieGrid = document.getElementById("movieGrid");
  const winnerDiv = document.getElementById("winner");
  const exportBtn = document.getElementById("exportBtn");

  const languageSelect = document.getElementById("language");
  const genreSelect = document.getElementById("genre");

  movieData = [
    {
      title: "Paddington 2",
      language: "English",
      genre: "Comedy",
      runtime: "1h 43m",
      rating: "7.8",
      poster: "https://m.media-amazon.com/images/M/MV5BMjI4NzYxNzYyNl5BMl5BanBnXkFtZTgwNzYxNzYzNDM@._V1_SX300.jpg",
      streaming: "Netflix (subscription), Prime Video (rent $3.79)"
    },
    {
      title: "Spirited Away",
      language: "Japanese",
      genre: "Animation",
      runtime: "2h 5m",
      rating: "8.6",
      poster: "https://m.media-amazon.com/images/M/MV5BNjQzZTc2NzAtYjYxZi00ZTYxLTg4YjMtYjYxYzYxYjYxYzYxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      streaming: "HBO Max (subscription), Prime Video (rent/buy)"
    }
    // Add more movies as needed
  ];

  loadBtn.addEventListener("click", () => {
    const selectedLanguage = languageSelect.value;
    const selectedGenre = genreSelect.value;

    movieGrid.innerHTML = "";
    winnerDiv.textContent = "";
    votes = {};

    const filteredMovies = movieData.filter(movie =>
      movie.language === selectedLanguage &&
      movie.genre === selectedGenre
    );

    if (filteredMovies.length === 0) {
      movieGrid.innerHTML = `<p>No movies match your filters. Try adjusting your selections.</p>`;
      return;
    }

    filteredMovies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>${movie.genre}</p>
        <p>🌐 ${movie.language}, ⏱️ ${movie.runtime}</p>
        <p>⭐ ${movie.rating}</p>
        <p>📺 Watch on: ${movie.streaming}</p>
        <div class="vote-buttons">
          <button onclick="castVote('${movie.title}', 5)">👍</button>
          <button onclick="castVote('${movie.title}', 2)">😐</button>
          <button onclick="castVote('${movie.title}', 1)">👎</button>
        </div>
      `;

      movieGrid.appendChild(card);
      votes[movie.title] = 0;
    });

    setTimeout(() => {
      const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
      winnerDiv.textContent = winner
        ? `🏆 Most Points: ${winner[0]}`
        : "No votes cast.";
    }, 5 * 60 * 1000);
  });

  searchBtn.addEventListener("click", async () => {
    const title = searchInput.value.trim();
    if (!title) return;

    movieGrid.innerHTML = "";
    winnerDiv.textContent = "";
    votes = {};

    try {
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
      const data = await res.json();

      if (!data || data.Response === "False") {
        movieGrid.innerHTML = `<p>Movie not found. Try another title.</p>`;
        return;
      }

      const poster = data.Poster !== "N/A" ? data.Poster : "assets/placeholder.jpg";
      const genre = data.Genre || "Unknown";
      const language = data.Language || "Unknown";
      const runtime = data.Runtime || "Unknown";
      const rating = data.imdbRating !== "N/A" ? data.imdbRating : "Not rated";

      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <img src="${poster}" alt="${data.Title}" />
        <h3>${data.Title}</h3>
        <