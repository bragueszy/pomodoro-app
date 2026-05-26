
var TEMPO_FOCO = 25 * 60;   // 25 minutos - Para trocar é aqui
var TEMPO_PAUSA = 5 * 60;  // 5 minutos - Para trocar é aqui

var tempoTotal = TEMPO_FOCO;
var tempoRestante = TEMPO_FOCO;
var intervalo = null;
var ativo = false;
var emFoco = true;
var atividade = "";
var pausasNoFoco = 0;
var pontos = parseInt(localStorage.getItem("pontos")) || 0;
var historico = JSON.parse(localStorage.getItem("historicoSessoes")) || [];
var notificacaoAtiva = true;

// ELEMENTOS DO DOM

var timerEl = document.getElementById("timer");
var btnStart = document.getElementById("btnStart");
var btnReset = document.getElementById("btnReset");
var btnNotify = document.getElementById("btnNotify");
var btnClear = document.getElementById("btnClear");

var historicoEl = document.getElementById("historico");
var pontosEl = document.getElementById("pontos");
var som = document.getElementById("som");

var overlay = document.getElementById("overlay");
var popup = document.getElementById("popup");

var btnAtividades = document.getElementsByClassName("btn-atividade");

//CIRCULO DE PROGRESSO TIMER

var circle = document.querySelector(".progress");
var r = 100;
var circ = 2 * Math.PI * r;

circle.style.strokeDasharray = circ;
circle.style.strokeDashoffset = 0;

// FUNÇÕES 

function mostrarPopup(mensagem) {
    popup.textContent = mensagem;
    overlay.style.display = "flex";

    setTimeout(function () {
        overlay.style.display = "none";
    }, 2500);
}

function atualizarTimer() {
    var minutos = Math.floor(tempoRestante / 60);
    var segundos = tempoRestante % 60;

    if (segundos < 10) {
        segundos = "0" + segundos;
    }

    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    timerEl.textContent = minutos + ":" + segundos;
    circle.style.strokeDashoffset = circ * (1 - tempoRestante / tempoTotal);
}

function tocarNotificacao() {
    if (notificacaoAtiva) {
        som.play();
    }
}

// INICIAR & PARAR O TIMER 

function iniciarOuPausar() {

    if (atividade === "") {
        mostrarPopup("Selecione uma atividade antes de iniciar!");
        return;
    }

    if (!ativo) {
        ativo = true;
        btnStart.textContent = "PAUSAR";
        btnStart.className = "btn-app btn-pausar";

        intervalo = setInterval(function () {
            tempoRestante--;
            atualizarTimer();

            if (tempoRestante <= 0) {
                proximoCiclo();
            }
        }, 1000);

    } else {
        clearInterval(intervalo);
        ativo = false;
        btnStart.textContent = "RETOMAR";
        btnStart.className = "btn-app btn-iniciar";

        if (emFoco) {
            pausasNoFoco++;
            mostrarPopup("Timer pausado. Pausar reduz o XP.");
        }
    }
}

// PRÓXIMO CICLO (FOCO/PAUSA)

function proximoCiclo() {
    clearInterval(intervalo);
    ativo = false;
    tocarNotificacao();

    if (emFoco) {
        var pontosGanhos = 25 - (pausasNoFoco * 5);

        if (pontosGanhos < 5) {
            pontosGanhos = 5;
        }

        pontos += pontosGanhos;
        pontosEl.textContent = pontos;
        localStorage.setItem("pontos", pontos);

        historico.push({
            data: new Date().toLocaleString(),
            atividade: atividade,
            tempo: 25,
            pontos: pontosGanhos
        });

        localStorage.setItem("historicoSessoes", JSON.stringify(historico));
        atualizarHistorico();

        mostrarPopup("Fim do foco! +" + pontosGanhos + " xp");

        emFoco = false;
        tempoTotal = TEMPO_PAUSA;
        tempoRestante = TEMPO_PAUSA;
        pausasNoFoco = 0;

        atualizarTimer();
        iniciarOuPausar();

    } else {
        emFoco = true;
        tempoTotal = TEMPO_FOCO;
        tempoRestante = TEMPO_FOCO;

        atualizarTimer();
        btnStart.textContent = "INICIAR";
        btnStart.className = "btn-app btn-iniciar";

        for (var i = 0; i < btnAtividades.length; i++) {
            btnAtividades[i].disabled = false;
            btnAtividades[i].classList.remove("selecionada");
        }

        atividade = "";
        mostrarPopup("Pausa terminada! Prepare-se para o próximo foco.");
    }
}

// REINICIAR O TIMER

function reiniciar() {
    clearInterval(intervalo);
    ativo = false;
    emFoco = true;

    tempoTotal = TEMPO_FOCO;
    tempoRestante = TEMPO_FOCO;

    atualizarTimer();

    btnStart.textContent = "INICIAR";
    btnStart.className = "btn-app btn-iniciar";

    for (var i = 0; i < btnAtividades.length; i++) {
        btnAtividades[i].disabled = false;
        btnAtividades[i].classList.remove("selecionada");
    }

    atividade = "";
}

// HISTÓRICO DE SESSÕES DE FOCO 

function atualizarHistorico() {
    historicoEl.innerHTML = "";

    for (var i = historico.length - 1; i >= 0; i--) {
        var item = historico[i];
        var li = document.createElement("li");

        li.textContent =
            item.data + " • " +
            item.atividade + " • " +
            item.tempo + " min • +" +
            item.pontos + " xp";

        historicoEl.appendChild(li);
    }

    btnClear.style.display = historico.length > 0 ? "block" : "none";
}

// EVENTOS DE CLIQUE

btnStart.onclick = function () {
    iniciarOuPausar();
};

btnReset.onclick = function () {
    reiniciar();
};

btnNotify.onclick = function () {
    notificacaoAtiva = !notificacaoAtiva;

    if (notificacaoAtiva) {
        btnNotify.classList.remove("off");
        mostrarPopup("Notificação ativada");
    } else {
        btnNotify.classList.add("off");
        mostrarPopup("Notificação desativada");
    }
};

btnClear.onclick = function () {
    historico = [];
    localStorage.removeItem("historicoSessoes");
    atualizarHistorico();
    mostrarPopup("Histórico apagado!");
};

// BOTÕES DE ATIVIDADE

for (var i = 0; i < btnAtividades.length; i++) {
    btnAtividades[i].onclick = function () {

        if (ativo) {
            return;
        }

        for (var j = 0; j < btnAtividades.length; j++) {
            btnAtividades[j].classList.remove("selecionada");
        }

        this.classList.add("selecionada");
        atividade = this.getAttribute("data-atividade");
    };
}


pontosEl.textContent = pontos;
atualizarTimer();
atualizarHistorico();


