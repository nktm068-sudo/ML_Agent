const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors()); // Разрешаем твоему сайту делать запросы и обходим CORS
app.use(express.json());

app.post('/api/chat', (req, res) => {
    try {
        const { query } = req.body;
        
        // Достаём твой секретный ключ из переменной TOKEN на Render
        const token = process.env.TOKEN;

        // Пакуем коробку с запросом для Hugging Face
        const payload = JSON.stringify({
            model: "Qwen/Qwen2.5-72B-Instruct",
            messages: [
                // 🧠 Настраиваем характер ИИ-программиста
                { role: "system", content: "Ты — Умный и Гениальный помощник-программист Миртекс. Отвечай кратко, понятно, помогай писать код и отвечай на русском языке." },
                { role: "user", content: query }
            ],
            max_tokens: 2048 // Самый максимум символов
        });

        // Точный адрес магазина Hugging Face без пробелов
        const options = {
            hostname: 'api-inference.huggingface.co',
            path: '/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        // Запускаем нашего самого надёжного курьера https, который никогда не ломается
        const hfReq = https.request(options, (hfRes) => {
            let body = '';
            hfRes.on('data', (chunk) => body += chunk);
            hfRes.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    
                    // Отправляем сайту чистый текст ответа от ИИ
                    if (data && data.choices && data.choices[0] && data.choices[0].message) {
                        res.json({ generated_text: data.choices[0].message.content });
                    } else if (data && data.choices && data.choices.message) {
                        res.json({ generated_text: data.choices.message.content });
                    } else {
                        res.status(500).json({ error: "Ошибка структуры ответа", details: data });
                    }
                } catch (e) {
                    res.status(500).json({ error: "Ошибка чтения JSON", body: body });
                }
            });
        });

        hfReq.on('error', (error) => {
            res.status(500).json({ error: "Ошибка сети Hugging Face: " + error.message });
        });

        hfReq.write(payload);
        hfReq.end();

    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера Render: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
