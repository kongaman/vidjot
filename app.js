const express = require('express');
const port= 5000;
const app = express();
//Index Route
app.get('/', (req, res) => {
    res.send('INDEX');
});

app.get('/about', (req, res) => {
    res.send('ABOUT');
});



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});