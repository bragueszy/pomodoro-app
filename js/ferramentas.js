/* MOSTRAR SUGESTÕES ALEATÓRIAS */
(function () {
    var dailyCheckin = JSON.parse(localStorage.getItem('dailyCheckin'));
    if (!dailyCheckin) {
        alert("Não foi feito check-in ainda!");
        window.location.href = "checkin.html";
        return;
    }

    var mood = dailyCheckin.mood;
    var allSuggestions = moodsData[mood];
    var container = document.getElementById("cardContainer");

    function getRandomSuggestions(arr, count) {
        if (!count) count = 3;
        var cloned = [];
        for (var i = 0; i < arr.length; i++) {
            cloned.push(arr[i]);
        }

        var result = [];
        for (var i = 0; i < count; i++) {
            if (cloned.length === 0) break;
            var idx = Math.floor(Math.random() * cloned.length);
            result.push(cloned[idx]);
            cloned.splice(idx, 1);
        }
        return result;
    }

    var suggestions = getRandomSuggestions(allSuggestions, 3);

    for (var i = 0; i < suggestions.length; i++) {
        var s = suggestions[i];

        var card = document.createElement('div');
        card.className = "card shadow";

        var title = document.createElement('div');
        title.className = "card-title";
        title.textContent = s.emoji + " Sugestão";
        card.appendChild(title);

        var text = document.createElement('div');
        text.className = "card-text";
        text.textContent = s.text;
        card.appendChild(text);


        if (s.url) {
            var iframe = document.createElement('iframe');
            iframe.src = s.url.replace("watch?v=", "embed/");
            card.appendChild(iframe);
        }


        if (s.gif) {
            var img = document.createElement('img');
            img.src = s.gif;
            img.style.width = "100%";
            img.style.borderRadius = "15px";
            img.style.marginTop = "10px";
            card.appendChild(img);
        }

        container.appendChild(card);
    }
})();
