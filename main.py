<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Universal Chat Panel</title>
    <style>
        body { 
            background-color: #1a1a1a; 
            color: #ffffff; 
            font-family: "Courier New", monospace; 
            text-align: center; 
            padding: 15px;
            margin: 0;
        }
        h1 { 
            color: #00FF7F; 
            font-size: 22px; 
            font-weight: bold;
            margin-bottom: 20px;
        }
        .container {
            width: 100%;
            max-width: 850px;
            margin: 0 auto;
            box-sizing: border-box;
        }
        #system_screen { 
            width: 100%; 
            height: 300px; 
            background-color: #2b2b2b; 
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 12px;
            box-sizing: border-box;
            overflow-y: auto;
            text-align: left;
            white-space: pre-wrap;
            font-size: 13px;
            margin-bottom: 15px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
        }
        #search_bar { 
            width: 100%; 
            height: 50px; 
            background-color: #333333;
            color: #ffffff;
            font-size: 15px; 
            border: 1px solid #555555;
            border-radius: 5px; 
            padding: 0 12px; 
            box-sizing: border-box;
            margin-bottom: 15px;
        }
        #search_bar:focus {
            outline: 1px solid #00FF7F;
        }
        .frame { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-top: 15px; 
        }
        button { 
            height: 50px; 
            font-size: 12px; 
            font-weight: bold; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            color: #ffffff;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .btn-purple { background-color: #9370DB; }
        .btn-gold { background-color: #FFD700; color: #000000; }
        .btn-green { background-color: #32CD32; }
        .btn-gray { background-color: #555555; }
        
        button:hover {
            opacity: 0.9;
        }
        
        @media (max-width: 480px) {
            body {
                background-color: #111111;
            }
            h1 { 
                font-size: 18px; 
                color: #00FFFF;
            }
            #system_screen { 
                height: 250px; 
                font-size: 12px;
            }
            button {
                height: 55px;
                font-size: 11px;
            }
        }
    </style>
</head>
<body>

<div class="container">
    <h1>🟢 ЧАТ-ПАНЕЛЬ С ИИ ПОМОЩНИКОМ</h1>
    
    <input type="text" id="search_bar" placeholder=" 🤖 Напиши вопрос для ИИ..." onkeypress="handleKeyPress(event)">
    
    <div id="system_screen">💾 СИСТЕМА ЗАПУЩЕНА В РЕЖИМЕ ЛОКАЛЬНОГО ПОМОЩНИКА
🧠 ИИ ГОТОВ ОБЩАТЬСЯ ПРЯМО ТУТ

</div>
    
    <div class="frame">
        <button class="btn-purple" onclick="triggerAction('привет')">📝 ПРИВЕТСТВИЕ</button>
        <button class="btn-gold" onclick="triggerAction('время')">⏰ УЗНАТЬ ВРЕМЯ</button>
        <button class="btn-green" onclick="triggerAction('рецепт')">🥞 РЕЦЕПТЫ</button>
        <button class="btn-gray" onclick="triggerAction('выход')">🔴 ВЫКЛЮЧИТЬ</button>
    </div>
</div>

<script>
function handleKeyPress(event) {
    if (event.key === "Enter") {
        let input = document.getElementById("search_bar");
        let query = input.value.trim();
        if (query === "") return;
        
        input.value = ""; 
        askLocalAI(query);
    }
}

// Теперь при нажатии на кнопки текст пишется и ИИ сразу отвечает
function triggerAction(actionText) {
    askLocalAI(actionText);
}

function getRandomElement(array) {
    let index = Math.floor(Math.random() * array.length);
    return array[index];
}

function askLocalAI(query) {
    let screen = document.getElementById("system_screen");
    let text = query.toLowerCase().trim();
    
    screen.innerHTML += `Вы: ${query}\n`;

    if (text === "выход") {
        screen.innerHTML += "🔴 [ИИ]: Закрываю окно системы...\n";
        setTimeout(() => { window.close(); }, 1000);
        scrollScreen();
        return;
    }

    let isTime = ["время", "час", "сколько время"].some(word => text.includes(word));
    let isChat = ["привет", "как дела", "приветик", "кто ты", "давай поболтаем"].some(word => text.includes(word));
    let isRecipe = ["рецепт", "приготовить", "кушать", "еда"].some(word => text.includes(word));

    if (isTime) {
        let now = new Date();
        let timeStr = now.toLocaleTimeString();
        let answers = [
            `⏰ [ИИ]: Сейчас на часах: ${timeStr}`,
            `⏰ [ИИ]: Точное время прямо сейчас: ${timeStr}`,
            `⏰ [ИИ]: По моим часам уже: ${timeStr}`
        ];
        screen.innerHTML += getRandomElement(answers) + "\n";
    }
    else if (isChat) {
        let answers = [
            "🤖 [ИИ]: Привет! Я твой умный локальный агент. Рад пообщаться на каникулах! Как твой день?",
            "🤖 [ИИ]: Приветик! Я на связи. Чем занимаешься в этот жаркий денек?",
            "🤖 [ИИ]: Хей! Я готов болтать. Как твои дела?"
        ];
        screen.innerHTML += getRandomElement(answers) + "\n";
    }
    else if (isRecipe) {
        let answers = [
            "🥞 [ИИ]: Рецепт блинчиков: смешай 1 яйцо, 1 стакан молока и 1 стакан муки. Добавь сахара и жарь кружочки!",
            "🍕 [ИИ]: Рецепт мини-пиццы: возьми батон, намажь кетчупом, положи колбасу, сыр и запеки в микроволновке на 1 минуту!",
            "🍹 [ИИ]: Рецепт коктейля: налей в стакан сок, добавь немного газировки и брось кусочек льда. Освежает в жару!"
        ];
        screen.innerHTML += getRandomElement(answers) + "\n";
    }
    else {
        let unknownAnswers = [
            `❌ [ИИ]: Хм, команду '${query}' я не распознал. Попробуй спросить про время или рецепт!`,
            `❌ [ИИ]: Я пока не знаю, что ответить на '${query}'. Напиши что-то вроде 'привет' или 'рецепт'.`,
            `❌ [ИИ]: Команда '${query}' неизвестна. Попробуй нажать на кнопки внизу!`
        ];
        screen.innerHTML += getRandomElement(unknownAnswers) + "\n";
    }

    screen.innerHTML += "═".repeat(50) + "\n";
    scrollScreen();
}

function scrollScreen() {
    let screen = document.getElementById("system_screen");
    screen.scrollTop = screen.scrollHeight;
}
</script>

</body>
</html>
