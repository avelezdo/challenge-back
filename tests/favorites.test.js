const supertest = require('supertest');
const { app, server } = require('../index');
const { favorite } = require('./helpers.js');

const api = supertest(app);

test('adding favorites', async () => {
	await api
		.post('/api/favorites')
		.send(favorite)
		.expect(201)
		.expect('Content-Type', /application\/json/);
});

test('favorites returned as json', async () => {
	await api
		.get('/api/favorites')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('added one valid favorite', async () => {
	await api.post('/api/favorites').send(favorite).expect(201);

	const response = await api.get('/api/favorites');
	expect(response.body.favorites).toHaveLength(1);
	const ids = response.body.favorites.map((f) => f.id.value);
	expect(ids).toContain('-1');
});

test('added one valid favorite and retrieve it by its id', async () => {
	await api.post('/api/favorites').send(favorite).expect(201);

	const response = await api.get('/api/favorites/-1');
	expect(response.body.id.value).toBe('-1');
});

test('delete one favorite', async () => {
	await api.post('/api/favorites').send(favorite).expect(201);

	await api.delete('/api/favorites/-1').expect(204);

	const response = await api.get('/api/favorites');
	expect(response.body).toHaveLength(0);
});

test('delete one favorite with bad id', async () => {
	await api.post('/api/favorites').send(favorite).expect(201);

	await api.delete('/api/favorites/-2').expect(400);
});

test('new empty favorite', async () => {
	const favorite = {};

	await api
		.post('/api/favorites')
		.send(favorite)
		.expect(400)
		.expect('Content-Type', /application\/json/);
});

beforeEach(async () => {
	await api.delete('/api/favorites');
});

afterAll(() => {
	server.close();
});
