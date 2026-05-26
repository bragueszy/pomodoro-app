/*CHECK-IN DIÁRIO*/
var selectedMood = null;
var nota = document.getElementById('nota');
var card = document.getElementById('card');
var moodButtons = document.getElementsByClassName('mood-btn');

/* SELEÇÃO/DESSELEÇÃO DE EMOJI*/
for (var i = 0; i < moodButtons.length; i++) {
    moodButtons[i].onclick = function (event) {
        event.stopPropagation();


        for (var j = 0; j < moodButtons.length; j++) {
            moodButtons[j].classList.remove('selected');
        }

        if (selectedMood === this.getAttribute('data-mood')) {
            selectedMood = null;
        } else {
            selectedMood = this.getAttribute('data-mood');
            this.classList.add('selected');
        }

        nota.style.display = 'none';
    };
}

/*CLIQUE FORA DO CARD */
document.body.onclick = function (event) {
    if (!card.contains(event.target)) {
        selectedMood = null;
        for (var i = 0; i < moodButtons.length; i++) {
            moodButtons[i].classList.remove('selected');
        }
    }
};

/*SUBMIT*/
document.getElementById('submitBtn').onclick = function () {
    if (!selectedMood) {
        nota.style.display = 'block';
        return;
    }

    var today = new Date().toISOString().split('T')[0];
    localStorage.setItem('dailyCheckin', JSON.stringify({mood: selectedMood, date: today}));

    window.location.href = 'ferramentas.html';
};
