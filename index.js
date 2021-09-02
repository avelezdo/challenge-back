const express = require('express');
const cors = require('cors');
const logger = require('./loggerMiddleware');
const app = express();
let favorites = {};
app.use(express.json()); //para poder utilizar el body-parser
app.use(logger);
app.use(cors());

app.get('/', (request, response) => {
	response.send('<h3>Services Up & Running');
});

app.get('/api/favorites', (_, response) => {
	response.json(favorites);
});

app.get('/api/favorites/:id', (request, response) => {
	const id = request.params.id; //ojo, siempre se toma el parámetro como string
	const favorite = favorites.favorites.find((f) => f.id.value === id);
	response.json(favorite);
});

app.delete('/api/favorites/:id', (request, response) => {
	const id = request.params.id; //ojo, siempre se toma el parámetro como string
	if (!favorites.favorites.some((f) => f.id.value === id)) {
		return response.status(400).json({
			error: 'Favorite id not found',
		});
	}

	favorites = favorites.favorites.filter((f) => f.id.value !== id);
	response.status(204).json();
});

app.delete('/api/favorites', (request, response) => {
	favorites = [];
	response.status(204).json();
});

app.post('/api/favorites', (request, response) => {
	const _favorites = request.body;
	if (!_favorites || !_favorites.name || _favorites.favorites.some((f) => !f.id)) {
		return response.status(400).json({
			error: 'favorite.id is missing',
		});
	}
	favorites = _favorites;
	response.status(201).json();
});

app.use((request, response) => {
	response.status(404).json({
		error: 'Resource not found',
	});
});

const PORT = process.env.PORT || 3000; //process.env.PORT necesario para el despliegue en Heroku
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
