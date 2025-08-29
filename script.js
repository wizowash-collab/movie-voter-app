const API_KEY = "2f0cfc7a"; // Replace with your OMDb API key

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
        <p>${genre}</p>
        <p>🌐 ${language}, ⏱️ ${runtime}</p>
        <p>⭐ ${rating}</p>
        <p>📺 Watch on: (streaming info not available for live search)</p>
        <div class="vote-buttons">
          <button onclick="castVote('${data.Title}', 5)">👍</button>
          <button onclick="castVote('${data.Title}', 2)">😐</button>
          <button onclick="castVote('${data.Title}', 1)">👎</button>
        </div>
      `;

      movieGrid.appendChild(card);
      votes[data.Title] = 0;

      setTimeout(() => {
        const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
        winnerDiv.textContent = winner
          ? `🏆 Most Points: ${winner[0]}`
          : "No votes cast.";
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error("Error fetching movie:", error);
      movieGrid.innerHTML = `<p>Something went wrong. Try again later.</p>`;
    }
  });

  exportBtn.addEventListener("click", () => {
    const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
    const text = winner
      ? `Movie Night Pick: ${winner[0]}\n\nShortlist:\n` +
        Object.entries(votes).map(([title, score]) => `${title}: ${score} pts`).join("\n")
      : "No votes were cast.";

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "movie-night.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
}

window.castVote = function(title, points) {
  if (votes[title] !== undefined) {
    votes[title] += points;
  }
};

window.checkPassword = function() {
  const input = document.getElementById("passwordInput").value;
  const error = document.getElementById("loginError");
  if (input === "1234") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("appContent").style.display = "block";
    initializeApp();
  } else {
    error.textContent = "Incorrect password. Try again.";
  }
};