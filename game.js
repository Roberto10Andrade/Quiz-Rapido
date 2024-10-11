const pergunta = document.getElementById('question');
const escolhas = Array.from(document.getElementsByClassName('choice-text'));
const textoProgresso = document.getElementById('progressText');
const textoPontuacao = document.getElementById('score');
const barraProgressoCheia = document.getElementById('progressBarFull');
const carregando = document.getElementById('loader');
const jogo = document.getElementById('game');
let perguntaAtual = {};
let aceitandoRespostas = false;
let pontuacao = 0;
let contadorPerguntas = 0;
let perguntasDisponiveis = [];

// Conjunto de perguntas em português
const fetchPerguntas = () => {
    return fetch(
        'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple&lang=pt'
    )
        .then((res) => res.json())
        .then((perguntasCarregadas) => {
            return perguntasCarregadas.results.map((perguntaCarregada) => {
                const perguntaFormatada = {
                    question: perguntaCarregada.question,
                };

                const escolhasResposta = [...perguntaCarregada.incorrect_answers];
                perguntaFormatada.answer = Math.floor(Math.random() * 4) + 1;
                escolhasResposta.splice(
                    perguntaFormatada.answer - 1,
                    0,
                    perguntaCarregada.correct_answer
                );

                escolhasResposta.forEach((escolha, indice) => {
                    perguntaFormatada['choice' + (indice + 1)] = escolha;
                });

                return perguntaFormatada;
            });
        });
};

const BONUS_CORRETA = 10;
const MAX_PERGUNTAS = 3;

iniciarJogo = async () => {
    contadorPerguntas = 0;
    pontuacao = 0;

    // Carregar perguntas da API
    perguntasDisponiveis = await fetchPerguntas();
    novaPergunta();
    jogo.classList.remove('hidden');
    carregando.classList.add('hidden');
};

novaPergunta = () => {
    if (perguntasDisponiveis.length === 0 || contadorPerguntas >= MAX_PERGUNTAS) {
        localStorage.setItem('pontuacaoMaisRecente', pontuacao);
        return window.location.assign('/end.html');
    }
    contadorPerguntas++;
    textoProgresso.innerText = `Pergunta ${contadorPerguntas}/${MAX_PERGUNTAS}`;
    barraProgressoCheia.style.width = `${(contadorPerguntas / MAX_PERGUNTAS) * 100}%`;

    const indicePergunta = Math.floor(Math.random() * perguntasDisponiveis.length);
    perguntaAtual = perguntasDisponiveis[indicePergunta];
    pergunta.innerHTML = perguntaAtual.question;

    escolhas.forEach((escolha) => {
        const numero = escolha.dataset['number'];
        escolha.innerHTML = perguntaAtual['choice' + numero];
    });

    perguntasDisponiveis.splice(indicePergunta, 1);
    aceitandoRespostas = true;
};

escolhas.forEach((escolha) => {
    escolha.addEventListener('click', (e) => {
        if (!aceitandoRespostas) return;

        aceitandoRespostas = false;
        const escolhaSelecionada = e.target;
        const respostaSelecionada = escolhaSelecionada.dataset['number'];

        const classeAplicar =
            respostaSelecionada == perguntaAtual.answer ? 'correct' : 'incorrect';

        if (classeAplicar === 'correct') {
            incrementarPontuacao(BONUS_CORRETA);
        }

        escolhaSelecionada.parentElement.classList.add(classeAplicar);

        setTimeout(() => {
            escolhaSelecionada.parentElement.classList.remove(classeAplicar);
            novaPergunta();
        }, 1000);
    });
});

incrementarPontuacao = (num) => {
    pontuacao += num;
    textoPontuacao.innerText = pontuacao;
};

// Inicia o jogo
iniciarJogo();
