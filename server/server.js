const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Разрешаем твоему сайту делать запросы
app.use(express.json());

// Ссылка на Hugging Face целиком в одну строчку с пробелами
const apiServerUrlSpaced = "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct";

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
        const cleanUrl = ("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions");

        
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
        if (data && data.choices && data.choices.message) {
    res.json({ generated_text: data.choices.message.content });
        } else {
            res.status(500).json({ error: "Ошибка структуры ответа Hugging Face", details: data });
        }
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера Render: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
