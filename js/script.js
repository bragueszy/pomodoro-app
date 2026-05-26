// ================= SLIDER DE IDADE =================
var idadeSlider = document.getElementById('idade');
var idadeValor = document.getElementById('idadeValor');

if (idadeSlider && idadeValor) {
    idadeValor.textContent = idadeSlider.value;
    idadeSlider.addEventListener('input', function () {
        idadeValor.textContent = idadeSlider.value;
    });
}

// ================= AVATARES =================
var avatarsContainer = document.getElementById('avatars');
var avatarSelecionado = null;
var uploadInput = document.getElementById('uploadAvatar');

if (avatarsContainer && uploadInput) {
    function selecionarAvatar(avatar) {
        var todosAvatares = avatarsContainer.querySelectorAll('.avatar');
        for (var i = 0; i < todosAvatares.length; i++) {
            todosAvatares[i].classList.remove('selecionado');
        }
        avatar.classList.add('selecionado');
        avatarSelecionado = avatar.querySelector('img').src;
    }

    var avataresPredefinidos = avatarsContainer.querySelectorAll('.avatar');
    for (var i = 0; i < avataresPredefinidos.length; i++) {
        avataresPredefinidos[i].addEventListener('click', function () {
            selecionarAvatar(this);
        });
    }

    uploadInput.addEventListener('change', function () {
        if (avatarsContainer.querySelectorAll('.avatar.uploaded').length > 0) {
            alert("Só pode adicionar 1 avatar carregado!");
            return;
        }

        var file = this.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (e) {
            var novoAvatar = document.createElement('div');
            novoAvatar.classList.add('avatar', 'uploaded');

            var img = document.createElement('img');
            img.src = e.target.result;
            novoAvatar.appendChild(img);

            var deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', function (ev) {
                ev.stopPropagation();
                avatarsContainer.removeChild(novoAvatar);
                avatarSelecionado = null;
                uploadInput.value = '';
            });

            novoAvatar.appendChild(deleteBtn);
            avatarsContainer.appendChild(novoAvatar);

            novoAvatar.addEventListener('click', function () {
                selecionarAvatar(this);
            });

            selecionarAvatar(novoAvatar);
        };
        reader.readAsDataURL(file);
    });
}

// ================= BOTÃO SEGUINTE (REGISTO1.HTML) =================
var btnSeguinte = document.getElementById('btnSeguinte');
if (btnSeguinte) {
    btnSeguinte.addEventListener('click', function () {
        var ensinoSelecionado = document.querySelector('input[name="ensino"]:checked');
        ensinoSelecionado = ensinoSelecionado ? ensinoSelecionado.id : null;

        var dadosPessoais = {
            nome: document.getElementById('nome').value,
            apelido: document.getElementById('apelido').value,
            idade: idadeSlider ? idadeSlider.value : null,
            ensino: ensinoSelecionado,
            avatar: avatarSelecionado
        };

        localStorage.setItem('dadosPessoais', JSON.stringify(dadosPessoais));
        window.location.href = 'registo2.html';
    });
}

// ================= BOTÃO CRIAR CONTA (REGISTO2.HTML) =================
var btnCriar = document.getElementById('btnCriar');
if (btnCriar) {
    btnCriar.addEventListener('click', function () {
        var user = document.getElementById('user').value;
        var pass = document.getElementById('pass').value;

        if (!user || !pass) {
            alert('Preencha username e password!');
            return;
        }

        var dadosPessoais = JSON.parse(localStorage.getItem('dadosPessoais'));
        if (!dadosPessoais) {
            alert('Preencha primeiro os dados pessoais!');
            return;
        }

        var utilizadores = JSON.parse(localStorage.getItem('utilizadores')) || [];

        // Verificar se username já existe
        for (var i = 0; i < utilizadores.length; i++) {
            if (utilizadores[i].login === user) {
                alert('Username já existe! Escolha outro.');
                return;
            }
        }

        var novoUtilizador = {
            login: user,
            pass: pass,
            nome: dadosPessoais.nome,
            apelido: dadosPessoais.apelido,
            idade: dadosPessoais.idade,
            ensino: dadosPessoais.ensino,
            avatar: dadosPessoais.avatar || null
        };

        utilizadores.push(novoUtilizador);
        localStorage.setItem('utilizadores', JSON.stringify(utilizadores));

        alert('Conta criada com sucesso!');
        window.location.href = 'login.html';
    });
}

// ================= BOTÃO LOGIN =================
var btnLogar = document.getElementById('btnLogar');
if (btnLogar) {
    btnLogar.addEventListener('click', function () {
        var user = document.getElementById('user').value;
        var pass = document.getElementById('pass').value;

        if (!user || !pass) {
            alert('Preencha username e password!');
            return;
        }

        var utilizadoresFixos = [
            { login: 'sara', pass: 'sara123' },
            { login: 'joana25', pass: 'joaninha2026' },
            { login: 'admin', pass: 'admin' }
        ];
        var utilizadoresLS = JSON.parse(localStorage.getItem('utilizadores')) || [];
        var utilizadores = utilizadoresFixos.concat(utilizadoresLS);

        var encontrado = false;
        for (var i = 0; i < utilizadores.length; i++) {
            if (user === utilizadores[i].login && pass === utilizadores[i].pass) {
                encontrado = true;
                break;
            }
        }

        if (encontrado) {
            alert('Login com sucesso!');
            localStorage.setItem('userLogado', JSON.stringify({ username: user }));
            window.location.href = 'bem-vind@.html';
        } else {
            alert('O username ou password estão incorretos.');
            document.getElementById('user').value = '';
            document.getElementById('pass').value = '';
        }
    });
}
