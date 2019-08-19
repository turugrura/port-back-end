const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
    console.log(`Im on a port ${PORT}`)
});