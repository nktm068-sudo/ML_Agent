const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Разрешаем твоему сайту делать запросы
app.use(express.json());

// Ссылка на Hugging Face целиком в одну строчку с пробелами
const apiServerUrlSpaced = "h t t p s : / / a p i - i n f e r e n c e . h u g g i n g f a c e . c o / m o d e l s / Q w e n / Q w e n 2 . 5 - 7 2 B - I n s t r u c t";

// Твой секретный токен, на сервере его никто не увидит
const HF_KEY = process.env.TOKEN;

// Функция для очистки ссылки от пробелов
function getCleanUrl(spacedUrl) {
    return spacedUrl.replace(/\s/g, "");
}

app.post('/api/chat', async (req, res) => {
    try {
        const { query } = req.body;
        
        // Переключаемся на правильный URL для чат-моделей Qwen
        const cleanUrl = getCleanUrl("h t t p s : / / a p i - i n f e r e n c e . h u g g i n g f a c e . c o / m o d e l s / Q w e n / Q w e n 2 . 5 - 7 2 B - I n s t r u c t / v 1 / c h a t / c o m p l e t i o n s");

        
        const response = await fetch(cleanUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + HF_KEY
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: [
                    { role: "system", content: "Ты — Умный  и Гениальный помощник-программист Миртекс. Отвечай кратко, понятно, и когда видишь открытый апи ключ в коде пиши ТРЕВОГА!ОБНАРУЖЕН ОКТРЫТЫЙ АПИ КЛЮЧ! СРОчНО СПРЯЧЬ ЕГО! и на русском языке." },
                    { role: "user", content: query }
                ],
                max_tokens: 1500
            })
        });

        const data = await response.json();
        
        // Отправляем обратно сайту чистый текст ответа
        if (data && data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ generated_text: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "Ошибка структуры ответа Hugging Face", details: data });
        }
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера Render: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
