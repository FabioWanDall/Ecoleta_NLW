import express from 'express';

// Type folder dependence --> npm install @types/express

//Rota: URL
//Recurso: entidade (users)

//Request params: /:id
//Query params: ?search:ana
//Request Body: 

const app = express();
app.use(express.json());

const users = [
    'Hello word',
    'Fabio Wan-Dall',
    'Panama',
    'ana Cristica'
];

// GET, POST, PUT, DELETE
app.get('/users', (request, response) => {
    console.log('listagem de usuários');
    const search = String(request.query.search);

    console.log(search);
    const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

    return response.json(filteredUsers);
});

app.get('/users/:id', (request, response) => {
    console.log('listagem de usuários único');
    const id = Number(request.params.id);
    return response.json(users[id]);
});

app.post('/users', (request, response) => {
    const data = request.body;
    console.log(data);
    return response.json(data);
});

app.listen(3333);
