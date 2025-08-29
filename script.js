const API_KEY = "your_omdb_api_key"; // Replace with your OMDb API key
const loadBtn = document.getElementById("loadMovies");
const movieGrid = document.getElementById("movieGrid");
const winnerDiv = document.getElementById("winner");
const exportBtn = document.getElementById("exportBtn");

const sampleMovies = [
  "Paddington 2",
  "Hidden Figures",
  "Spirited Away",
  "Coco",
  "The Intouchables",
  "The Secret Life of Walter Mitty"
];

let votes = {};

loadBtn.addEventListener("click", async () => {
  movieGrid.innerHTML = "";
  winnerDiv.textContent = "";
  votes = {};

  for (let title of sampleMovies) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
      const data = await res.json();

      if (!data || data.Response === "False") {
        console.warn(`Movie not found: ${title}`);
        continue;
      }

      const poster = data.Poster && data.Poster !== "N/A" ? data.Poster : "assets/placeholder.jpg";
      const language = data.Language && data.Language !== "N/A" ? data.Language : "Not available";
      const runtime = data.Runtime && data.Runtime !== "N/A" ? data.Runtime : "Not available";
      const rating = data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "Not rated";
      const genre = data.Genre && data.Genre !== "N/A" ? data.Genre : "Not available";
      const titleText = data.Title || title;

      const card = document.createElement("div");
      card.className = "movie-card";

      card.innerHTML = `
        <img src="${poster}" alt="${titleText}" />
        <h3>${titleText}</h3>
        <p>${genre}</p>
        <p>🌐 ${language}, ⏱️ ${runtime}</p>
        <p>⭐ ${rating}</p>
        <div class="vote-buttons">
          <button onclick="castVote('${titleText}', 5)">👍</button>
          <button onclick="castVote('${titleText}', 2)">😐</button>
          <button onclick="castVote('${titleText}', 1)">👎</button>
        </div>
      `;

      movieGrid.appendChild(card);
      votes[titleText] = 0;
    } catch (error) {
      console.error(`Error loading movie: ${title}`, error);
    }
  }

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