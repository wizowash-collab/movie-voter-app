const API_KEY = "2f0cfc7a"; // Replace with your OMDb API key
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
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
    const data = await res.json();

    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = data.Poster !== "N/A" ? data.Poster : "assets/placeholder.jpg";
    card.innerHTML = `
      <img src="${poster}" alt="${data.Title}" />
      <h3>${data.Title}</h3>
      <p>${data.Genre}</p>
      <p>🌐 ${data.Language}, ⏱️ ${data.Runtime}</p>
      <p>⭐ ${data.imdbRating}</p>
      <div class="vote-buttons">
        <button onclick="castVote('${data.Title}', 5)">👍</button>
        <button onclick="castVote('${data.Title}', 2)">😐</button>
        <button onclick="castVote('${data.Title}', 1)">👎</button>
      </div>
    `;

    movieGrid.appendChild(card);
    votes[data.Title] = 0;
  }

  // Start 5-minute timer
  setTimeout(() => {
    const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
    winnerDiv.textContent = `🏆 Most Points: ${winner[0]}`;
  }, 5 * 60 * 1000);
});

window.castVote = function(title, points) {
  votes[title] += points;
};

exportBtn.addEventListener("click", () => {
  const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
  const text = `Movie Night Pick: ${winner[0]}\n\nShortlist:\n` +
    Object.entries(votes).map(([title, score]) => `${title}: ${score} pts`).join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "movie-night.txt";
  a.click();
  URL.revokeObjectURL(url);
});