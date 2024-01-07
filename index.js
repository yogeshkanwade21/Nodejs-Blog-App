const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');

//route
app.get('/', (req, res) => {
    return res.render('home');
})

// server configuration
const server = app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`);
})

server.on('error', (err)=> {
    console.log(`error: ${err.message}`);
});