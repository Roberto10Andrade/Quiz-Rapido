const nomeUsuario = document.getElementById('username');
const salvarPontuacaoBtn = document.getElementById('saveScoreBtn');
const pontuacaoFinal = document.getElementById('finalScore');
const pontuacaoMaisRecente = localStorage.getItem('mostRecentScore');

const pontuacoesAltas = JSON.parse(localStorage.getItem('highScores')) || [];

const MAX_PONTUACOES_ALTAS = 5;

// Exibir a pontuação final
pontuacaoFinal.innerText = `Sua pontuação final é: ${pontuacaoMaisRecente}`;

// Habilitar o botão de salvar quando o campo de nome de usuário não estiver vazio
nomeUsuario.addEventListener('keyup', () => {
    salvarPontuacaoBtn.disabled = !nomeUsuario.value;
});

// Função para salvar a pontuação alta
const salvarPontuacaoAlta = (e) => {
    e.preventDefault();

    const pontuacao = {
        score: pontuacaoMaisRecente,
        name: nomeUsuario.value,
    };

    // Adicionar a nova pontuação ao array
    pontuacoesAltas.push(pontuacao);

    // Ordenar as pontuações por score (maior primeiro) e manter as 5 melhores
    pontuacoesAltas.sort((a, b) => b.score - a.score);
    pontuacoesAltas.splice(MAX_PONTUACOES_ALTAS);

    // Salvar novamente no localStorage
    localStorage.setItem('highScores', JSON.stringify(pontuacoesAltas));

    // Redirecionar para a página inicial ou de pontuações altas
    window.location.assign('/highscores.html'); // ou '/' se preferir ir para a página inicial
};

// Adicionando o evento de clique ao botão de salvar
salvarPontuacaoBtn.addEventListener('click', salvarPontuacaoAlta);
