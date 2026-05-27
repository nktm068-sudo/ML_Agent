const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Разрешаем твоему сайту делать запросы
app.use(express.json());

// Ссылка на Hugging Face целиком в одну строчку с пробелами
const apiServerUrlSpaced = "h t t p s : / / a p i - i n f e r e n c e . h u g g i n g f a c e . c o / m o d e l s / Q w e n / Q w e n 2 . 5 - 7 2 B - I n s t r u c t";

// Твой секретный токен, на сервере его никто не увидит
const HF_KEY = "TOKEN"; 

// Функция для очистки ссылки от пробелов
function getCleanUrl(spacedUrl) {
    return spacedUrl.replace(/\s/g, "");
}

app.post('/api/chat', async (req, res) => {
    try {
        const { query } = req.body;
        const cleanUrl = getCleanUrl(apiServerUrlSpaced);
        
        const response = await fetch(cleanUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + HF_KEY
            },
            body: JSON.stringify({
                inputs: "Ты — полезный ИИ-помощник Миртекс. Отвечай кратко на русском языке. Вопрос: " + query
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера Render" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
