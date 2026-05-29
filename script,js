function getCleanUrl(spacedUrl) {
    return spacedUrl.replace(/\s/g, "");
}

const weatherUrlSpaced = "h t t p s : / / w t t r . i n / ? f o r m a t = j 1";

function checkMath(text) {
    let clean = text.replace(/[^0-9+\-*/(). ]/g, "").trim();
    if (clean.length >= 3 && /[0-9]/.test(clean)) {
        try {
            let result = Function(`return (${clean})`)();
            if (typeof result === "number" && !isNaN(result)) return result;
        } catch(e) { return null; }
    }
    return null;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        let input = document.getElementById("search_bar");
        let query = input.value.trim();
        if (query === "") return;
        input.value = ""; 
        startLocalAI(query);
    }
}

function triggerAction(actionText) {
    startLocalAI(actionText);
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function scrollScreen() {
    let screen = document.getElementById("system_screen");
    screen.scrollTop = screen.scrollHeight;
}

async function fetchWeather() {
    try {
        const cleanWeatherUrl = getCleanUrl(weatherUrlSpaced);
        const response = await fetch(cleanWeatherUrl);
        const data = await response.json();
        
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const desc = current.lang_ru ? current.lang_ru.value : current.weatherDesc[0].value;
        return `🌤 Погода в твоём городе:<br>🌡 Температура: <b>${temp}°C</b><br>📝 На улице: <b>${desc}</b>`;
    } catch (error) {
        return "❌ Не удалось загрузить погоду. Проверь сеть.";
    }
}

async function startLocalAI(query) {
    let screen = document.getElementById("system_screen");
    let text = query.toLowerCase().trim();
    
    if (text === "очистить") {
        screen.innerHTML = "<div class='msg sys-msg'>[СИСТЕМА]: История чата очищена.</div>";
        return;
    }
    
    screen.innerHTML += `<div class="msg user-msg"><b>Вы:</b> ${query}</div>`;
    
    let loadingDiv = document.createElement("div");
    loadingDiv.className = "msg ai-msg";
    loadingDiv.style.color = "#00FF7F";
    loadingDiv.innerHTML = "🧠 <i>Миртекс обрабатывает запрос...</i>";
    screen.appendChild(loadingDiv);
    scrollScreen();

    // 1. Калькулятор
    let mathResult = checkMath(text);
    if (mathResult !== null) {
        await delay(400);
        if (loadingDiv) loadingDiv.remove();
        screen.innerHTML += `<div class="msg ai-msg">🧮 Ответ равен: <b>${mathResult}</b></div>`;
        scrollScreen();
        return;
    }

    // 2. Время
    let isTime = ["время", "час", "сколько время"].some(word => text.includes(word));
    if (isTime) {
        await delay(400);
        if (loadingDiv) loadingDiv.remove();
        let now = new Date();
        screen.innerHTML += `<div class="msg ai-msg">⏰ Время на часах: <b>${now.toLocaleTimeString()}</b></div>`;
        scrollScreen();
        return;
    } 

    // 3. ПОГОДА
    let isWeather = ["погода", "погоду", "на улице"].some(word => text.includes(word));
    if (isWeather) {
        const weatherReport = await fetchWeather();
        if (loadingDiv) loadingDiv.remove();
        screen.innerHTML += `<div class="msg ai-msg">${weatherReport}</div>`;
        scrollScreen();
        return;
    }

    // 🔥 4. УНИВЕРСАЛЬНАЯ НЕЙРО-БАЗА ЗНАНИЙ С АВТО-ИСПРАВЛЕНИЕМ ОШИБОК
    let aiResult = "";

    try {
        const response = await fetch("database.json");
        const database = await response.json();
        
        let foundTopic = "";
        for (let key in database) {
            if (text.includes(key)) {
                foundTopic = key;
                break;
            }
        }

        if (foundTopic !== "") {
            const topicData = database[foundTopic];
            const correctWord = topicData.correct_name;
            const mainInfo = topicData.info;

            if (text.includes(correctWord) || (correctWord === "зеленая" && text.includes("зелёная")) || (correctWord === "соленый" && text.includes("солёный"))) {
                aiResult = `🤖 Да, всё верно! Ведь ${mainInfo}`;
            } else {
                aiResult = `Нет, вообще-то ${foundTopic} — ${correctWord}, и вот почему: ${mainInfo}`;
            }
        }
    } catch (error) {
        console.error(error);
        aiResult = "❌ Ошибка чтения базы данных database.json";
    }

    // 5. Если темы нет в базе, проверяем стандартные приколюхи (баги и рецепты)
    if (aiResult === "") {
        if (text.includes("ошибка") || text.includes("баг") || text.includes("сломалось")) {
            aiResult = "🛠️ Так, без паники! Проверь, все ли скобки закрыты и правильные ли кавычки стоят на Гитхабе. Твой Миртекс быстро раскатает этот баг! 💻";
        }
        else if (["рецепт", "приготовить", "кушать", "еда", "пицца", "блин"].some(word => text.includes(word))) {
            if (text.includes("пицца") || text.includes("пиццы")) {
                aiResult = "🍕 Рецепт mini-пиццы: возьми батон, намажь кетчупом, положи колбасу, сыр и запеки в микроволновке на 1 минуту!";
            } else {
                aiResult = "🥞 Рецепт блинчиков: смешай 1 яйцо, 1 стакан молока и 1 стакан муки. Добавь сахара и жарь на сковородке кружочки!";
            }
        }
    }

    // 6. Разговорный сленг (если вообще ничего из прошлого не совпало)
    if (aiResult === "") {
        if (!window.chatHistory) { window.chatHistory = []; }
        window.chatHistory.push(text);
        
        let helloCount = window.chatHistory.filter(t => ["привет", "хай", "ку", "салам", "здарова", "йо"].some(word => t.includes(word))).length;
        let isHello = ["привет", "хай", "ку", "салам", "здарова", "йо"].some(word => text.includes(word));
        let isStatus = ["как дела", "как жизнь", "че как", "как ты", "настроение", "как сам"].some(word => text.includes(word));

        if (isStatus) {
            aiResult = getRandomElement([
                "Да вообще отлично, провода кайфуют! Как твои успехи? 🚀",
                "Все чики-пуки, сижу на чилле, играю в Майнкрафт. Сам как? 😎",
                "Настроение пушка! Готов разносить этот день в пух и прах. 🔥"
            ]);
        } else if (isHello) {
            if (helloCount > 1) {
                aiResult = getRandomElement([
                    "Да мы ж уже перетирали за это, здоровались! 😂",
                    "Память отшибло? Привет еще раз! 👋"
                ]);
            } else {
                aiResult = getRandomElement([
                    "Йоу! На связи. Че кого, как сам? 😎",
                    "Привет-привет! Какие новости, во что рубишься на каникулах?"
                ]);
            }
        } else {
            aiResult = getRandomElement([
                "Реально базаришь. Расскажи подробнее! 🔥",
                "Жиза! У меня микросхемы от такого плавятся. 😎",
                "Тема годная, одобряю полностью. Что дальше?"
            ]);
        }
    }

    // 🔥 ИСПРАВЛЕНО: Теперь анимация «думает» чётко исчезает ВСЕГДА!
    await delay(500);
    if (loadingDiv) loadingDiv.remove();

    screen.innerHTML += `<div class="msg ai-msg">🤖 ${aiResult}</div>`;
    scrollScreen();
}
