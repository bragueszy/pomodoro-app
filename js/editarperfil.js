window.onload = function () {


    var inpNome = document.getElementById("botaonome");
    var inpApelido = document.getElementById("botaoapelido");
    var inpIdade = document.getElementById("botaoidade");
    var inpUsername = document.getElementById("botaousername");
    var inpBio = document.getElementById("botaosobreti");
    var btnGuardar = document.getElementById("btnGuardar");


    var avatarsContainer = document.getElementById('avatars');
    var uploadInput = document.getElementById('uploadAvatar');
    var avatarSelecionado = null;

    if (!inpNome || !inpApelido || !inpIdade || !inpUsername || !inpBio || !btnGuardar) {
        return;
    }


    var userLogado = JSON.parse(localStorage.getItem('userLogado'));
    if (!userLogado || !userLogado.username) {
        window.location.href = "login.html";
        return;
    }

    var loginAtual = userLogado.username;


    var utilizadores = JSON.parse(localStorage.getItem('utilizadores')) || [];
    var u = null;

    for (var i = 0; i < utilizadores.length; i++) {
        if (utilizadores[i].login === loginAtual) {
            u = utilizadores[i];
            break;
        }
    }

    if (!u) {
        window.location.href = "login.html";
        return;
    }


    inpNome.value = u.nome;
    inpApelido.value = u.apelido;
    inpIdade.value = u.idade;
    inpUsername.value = u.login;
    inpUsername.readOnly = true;
    inpBio.value = u.bio || "";


    if (avatarsContainer && uploadInput) {

        function selecionarAvatar(avatar) {
            var todos = avatarsContainer.querySelectorAll('.avatar');
            for (var x = 0; x < todos.length; x++) {
                todos[x].className = todos[x].className.replace(" selecionado", "");
            }
            avatar.className += " selecionado";
            avatarSelecionado = avatar.getElementsByTagName("img")[0].src;
        }


        var avatares = avatarsContainer.querySelectorAll('.avatar');
        for (var j = 0; j < avatares.length; j++) {
            avatares[j].onclick = function () {
                selecionarAvatar(this);
            };
        }


        if (u.avatar) {
            avatarSelecionado = u.avatar;

            var imgs = avatarsContainer.getElementsByTagName("img");
            var encontrado = false;

            for (var k = 0; k < imgs.length; k++) {
                if (imgs[k].src === u.avatar) {
                    selecionarAvatar(imgs[k].parentNode);
                    encontrado = true;
                    break;
                }
            }


            if (!encontrado) {
                var novoAvatar = document.createElement("div");
                novoAvatar.className = "avatar uploaded";

                var imgUp = document.createElement("img");
                imgUp.src = u.avatar;
                novoAvatar.appendChild(imgUp);

                var deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-btn";
                deleteBtn.onclick = function (ev) {
                    if (ev && ev.stopPropagation) ev.stopPropagation();
                    avatarsContainer.removeChild(novoAvatar);
                    avatarSelecionado = null;
                    uploadInput.value = "";
                };

                novoAvatar.appendChild(deleteBtn);
                avatarsContainer.appendChild(novoAvatar);

                novoAvatar.onclick = function () {
                    selecionarAvatar(novoAvatar);
                };

                selecionarAvatar(novoAvatar);
            }
        }


        uploadInput.onchange = function () {
            if (avatarsContainer.querySelectorAll('.avatar.uploaded').length > 0) {
                alert("Só pode adicionar 1 avatar carregado!");
                return;
            }

            var file = this.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function (e) {
                var novoAvatar = document.createElement('div');
                novoAvatar.className = 'avatar uploaded';

                var img = document.createElement('img');
                img.src = e.target.result;
                novoAvatar.appendChild(img);

                var deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.onclick = function (ev) {
                    if (ev && ev.stopPropagation) ev.stopPropagation();
                    avatarsContainer.removeChild(novoAvatar);
                    avatarSelecionado = null;
                    uploadInput.value = '';
                };

                novoAvatar.appendChild(deleteBtn);
                avatarsContainer.appendChild(novoAvatar);

                novoAvatar.onclick = function () {
                    selecionarAvatar(novoAvatar);
                };

                selecionarAvatar(novoAvatar);
            };
            reader.readAsDataURL(file);
        };
    }


    btnGuardar.onclick = function () {
        u.nome = inpNome.value;
        u.apelido = inpApelido.value;
        u.idade = inpIdade.value;
        u.bio = inpBio.value;

        if (avatarSelecionado) {
            u.avatar = avatarSelecionado;
        }

        localStorage.setItem('utilizadores', JSON.stringify(utilizadores));
        window.location.href = "perfil.html";
    };
};
