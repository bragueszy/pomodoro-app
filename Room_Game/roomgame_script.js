// Recupera pontos do localStorage
var pontos = localStorage.getItem("pontos");

// Se não existir, define valor inicial
if (!pontos) {
    pontos = "0"; // valor inicial de teste
} else {
    pontos = parseInt(pontos);
}

// Função que atualiza o card de pontuação e o badge XP
function atualizarPontuacao() {
    var spanPontos = document.getElementById("pontos");
    if (spanPontos) {
        spanPontos.textContent = pontos;
    }

    var spanUserXP = document.getElementById("user-xp");
    if (spanUserXP) {
        spanUserXP.textContent = pontos;
    }
}

// LOAD DA PÁGINA

window.onload = function () {
    atualizarPontuacao();


    if (document.getElementById("btn_wardrobe") ||
        document.getElementById("btn_bed") ||
        document.getElementById("btn_desk") ||
        document.getElementById("btn_computer") ||
        document.getElementById("btn_rug") ||
        document.getElementById("btn_plant")) {
        verificarLoja();
    }

    if (document.getElementById("item-wardrobe") ||
        document.getElementById("item-bed") ||
        document.getElementById("item-desk") ||
        document.getElementById("item-computer") ||
        document.getElementById("item-rug") ||
        document.getElementById("item-plant")) {
        verificarQuarto();
    }
};


// FUNÇÕES DA LOJA

function comprarItem(idBtn, custo, nome) {
    if (pontos >= custo) {
        pontos -= custo;
        localStorage.setItem("pontos", pontos);
        localStorage.setItem("item_" + nome, "comprado");

        atualizarPontuacao();
        atualizarBotao(idBtn);

        if (nome === "secretaria") {
            desbloquearPC();
        }
    } else {
        alert("Não tem pontos disponíveis");
    }
}

// Atualiza o estado dos botões da loja
function verificarLoja() {
    var itens = ["roupeiro", "cama", "secretaria", "computador", "tapete", "planta"];
    var btns = ["btn_wardrobe", "btn_bed", "btn_desk", "btn_computer", "btn_rug", "btn_plant"];

    for (var i = 0; i < itens.length; i++) {
        if (localStorage.getItem("item_" + itens[i]) === "comprado") {
            atualizarBotao(btns[i]);
        }
    }

    if (localStorage.getItem("item_secretaria") === "comprado") {
        desbloquearPC();
    }
}

// Atualiza um botão da loja quando o item comprado
function atualizarBotao(id) {
    var b = document.getElementById(id);
    if (b) {
        b.innerHTML = "Adicionado";
        b.style.backgroundColor = "#165c60";
        b.disabled = true;
    }
}

// Desbloqueia o computador apenas se a secretária estiver comprada
function desbloquearPC() {
    var pc = document.getElementById("btn_computer");
    if (pc && localStorage.getItem("item_computador") !== "comprado") {
        pc.disabled = false;
        pc.innerHTML = "Adicionar";
    }
}


// FUNÇÕES DO QUARTO
function verificarQuarto() {
    var itens = ["roupeiro", "cama", "secretaria", "computador", "tapete", "planta"];
    var imgs = ["item-wardrobe", "item-bed", "item-desk", "item-computer", "item-rug", "item-plant"];

    for (var i = 0; i < itens.length; i++) {
        var img = document.getElementById(imgs[i]);
        if (img) {
            if (localStorage.getItem("item_" + itens[i]) === "comprado") {
                img.style.display = "block";
            } else {
                img.style.display = "none";
            }
        }
    }
}


// DEBUG

console.log("Página atual: " + window.location.pathname);
console.log("XP lido da memória: " + pontos);
