const listaPontuacoesAltas = document.getElementById("listaPontuacoesAltas");
const pontuacoesAltas = JSON.parse(localStorage.getItem("highScores")) || [];

listaPontuacoesAltas.innerHTML = pontuacoesAltas
  .map(pontuacao => {
    return `<li class="pontuacao-alta">${pontuacao.name} - ${pontuacao.score}</li>`;
  })
  .join("");
