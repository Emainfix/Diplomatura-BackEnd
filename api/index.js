const express = require('express');
const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: "API funcionando en Vercel" });
});

module.exports = (req, res) => {
    app(req, res);
};
