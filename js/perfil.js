window.addEventListener("DOMContentLoaded", function () {
    var elNome = document.getElementById("nomeUtilizador");
    var elUsername = document.getElementById("username");
    var elBio = document.getElementById("biografia");
    var elAvatar = document.getElementById("avatarPerfil");

    if (!elNome || !elUsername || !elBio || !elAvatar) return;

    var userLogado = null;
    try{
        userLogado = JSON.parse(localStorage.getItem("userLogado"))
    } catch (e) {
        userLogado = null
    }

    if (!userLogado || (!userLogado.username && !userLogado.login)) {
        window.location.href = "login.html"
        return
    }

    var loginAtual = userLogado.login || userLogado.username;
    var utilizadoresLS = JSON.parse(localStorage.getItem("utilizadores")) || [];

    var utilizadoresFixos = [
        { login: 'sara', pass: 'sara123', nome: 'Sara', apelido: 'Martins', avatar: null, bio: '' },
        { login: 'joana25', pass: 'joaninha2026', nome: 'Joana', apelido: '', avatar: null, bio: '' },
        { login: 'admin', pass: 'admin', nome: 'Admin', apelido: '', avatar: null, bio: '' }
    ];

    var utilizadores = utilizadoresFixos.concat (utilizadoresLS);

    var u = null

    for (var i = 0 ; i < utilizadores.length; i++) {
        if (utilizadores[i].login === loginAtual) {
            u = utilizadores[i]
            break;
        }
    }

    var nomeCompleto = u.nome + " " + u.apelido;
    elNome.textContent = nomeCompleto
    elUsername.textContent = "@" + u.login
    elBio.textContent = u.bio

    if (u.avatar) {
        elAvatar.src = u.avatar;
    } else {
        elAvatar.src = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
    }

})
