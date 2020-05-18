const express = require('express');
const nunjuck = require('nunjucks');
const Routes = require('./routes');
const methodOverride = require('method-override');

const app = express();

app.use(express.urlencoded({ extended: true})); // Configuração para receber arquivos json

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(Routes);

app.set("view engine", "njk");

nunjuck.configure("views", {
    express: app,
    autoescape: false,
    noCache: true,
});



app.listen(3333, () => {
    console.log('server is runing');
});