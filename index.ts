import express from 'express';
import annonces_router from './app/routes/annonces';
import fiches_router from './app/routes/fiches';
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/annonces', annonces_router);
app.use('/fiches', fiches_router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});