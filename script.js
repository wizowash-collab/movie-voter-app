const loadBtn = document.getElementById("loadMovies");
const movieGrid = document.getElementById("movieGrid");
const winnerDiv = document.getElementById("winner");
const exportBtn = document.getElementById("exportBtn");

const moodSelect = document.getElementById("mood");
const languageSelect = document.getElementById("language");
const genreSelect = document.getElementById("genre");

const movieData = [
  {
    title: "Paddington 2",
    mood: "feel-good",
    language: "English",
    genre: "Comedy",
    runtime: "1h 43m",
    rating: "7.8",
    poster: "https://m.media-amazon.com/images/M/MV5BMjI4NzYxNzYyNl5BMl5BanBnXkFtZTgwNzYxNzYzNDM@._V1_SX300.jpg",
    streaming: "Netflix (subscription), Prime Video (rent $3.79)"
  },
  {
    title: "Hidden Figures",
    mood: "inspiring",
    language: "English",
    genre: "Drama",
    runtime: "2h 7m",
    rating: "7.9",
    poster: "https://m.media-amazon.com/images/M/MV5BMjQxMzYxNjY2NF5BMl5BanBnXkFtZTgwNjQxNjM0MDI@._V1_SX300.jpg",
    streaming: "Disney+ (subscription), Prime Video (rent $3.99)"
  },
  {
    title: "Spirited Away",
    mood: "magical",
    language: "Japanese",
    genre: "Animation",
    runtime: "2h 5m",
    rating: "8.6",
    poster: "https://m.media-amazon.com/images/M/MV5BNjQzZTc2NzAtYjYxZi00ZTYxLTg4YjMtYjYxYzYxYjYxYzYxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    streaming: "HBO Max (subscription), Prime Video (rent/buy)"
  },
  {
    title: "Coco",
    mood: "magical",
    language: "Spanish",
    genre: "Animation",
    runtime: "1h 45m",
    rating: "8.4",
    poster: "https://m.media-amazon.com/images/M/MV5BMjQxMzYxNjY2NF5BMl5BanBnXkFtZTgwNjQxNjM0MDI@._V1_SX300.jpg",
    streaming: "Disney+ (subscription), Prime Video (rent/buy)"
  },
  {
    title: "The Intouchables",
    mood: "feel-good",
    language: "French",
    genre: "Drama",
    runtime: "1h 52m",
    rating: "8.5",
    poster: "https://m.media-amazon.com/images/M/MV5BMjI4NzYxNzYyNl5BMl5BanBnXkFtZTgwNzYxNzYzNDM@._V1_SX300.jpg",
    streaming: "Prime Video (free with trial), Apple TV, Tubi (free)"
  },
  {
    title: "The Secret Life of Walter Mitty",
    mood: "inspiring",
    language: "English",
    genre: "Adventure",
    runtime: "1h 54m",
    rating: "7.3",
    poster: "https://m.media-amazon.com/images/M/MV5BMjI4NzYxNzYyNl5BMl5BanBnXkFtZTgwNzYxNzYzNDM@._V1_SX300.jpg",
    streaming: "Hulu (subscription), Prime Video (rent/buy)"
  }
];

let votes = {};

loadBtn.addEventListener("click", () => {
  const selectedMood = moodSelect.value;
  const selectedLanguage = languageSelect.value;
  const selectedGenre = genreSelect.value;

  movieGrid.innerHTML = "";
  winnerDiv.textContent = "";
  votes = {};

  const filteredMovies = movieData.filter(movie =>
    movie.mood === selectedMood &&
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

  // Start 5-minute timer
  setTimeout(() => {
    const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
    winnerDiv.textContent = winner
      ? `🏆 Most Points: ${winner[0]}`
      : "No votes cast.";
  }, 5 * 60 * 1000);
});

window.castVote = function(title, points) {
  if (votes[title] !== undefined) {
    votes[title] += points;
  }
};

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