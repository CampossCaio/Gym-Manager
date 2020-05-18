const { Router } = require('express');
const instructors = require('./controllers/instructors');
const members = require('./controllers/members');

const routes = new Router();

// Instructors
routes.get('/', (req, res) => {
    return res.redirect('/instructors');
});

routes.get('/instructors', instructors.index);
routes.get('/instructors/create', instructors.create);
routes.post('/instructors', instructors.post);
routes.get('/instructors/:id', instructors.show);
routes.get('/instructors/:id/edit', instructors.edit);
routes.put('/instructors', instructors.update);
routes.delete('/instructors', instructors.delete);


// Members
routes.get('/members', members.index);
routes.get('/members/create', members.create);
routes.post('/members', members.post);
routes.get('/members/:id', members.show);
routes.get('/members/:id/edit', members.edit);
routes.put('/members', members.update);
routes.delete('/members', members.delete);


module.exports = routes;