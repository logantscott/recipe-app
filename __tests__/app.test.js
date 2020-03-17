require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Event = require('../lib/models/Event');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  describe('recipes routes', () => {

    it('creates a recipe', () => {
      return request(app)
        .post('/api/v1/recipes')
        .send({
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            ingredient: 'Salt',
            amount: 1,
            unit: 'pinch'
          }]
        })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            name: 'cookies',
            directions: [
              'preheat oven to 375',
              'mix ingredients',
              'put dough on cookie sheet',
              'bake for 10 minutes'
            ],
            ingredients: [{
              ingredient: 'Salt',
              amount: 1,
              unit: 'pinch',
              _id: expect.any(String)
            }],
            __v: 0
          });
        });
    });

    it('gets all recipes', async() => {
      const recipes = await Recipe.create([
        { name: 'cookies', directions: [] },
        { name: 'cake', directions: [] },
        { name: 'pie', directions: [] }
      ]);

      return request(app)
        .get('/api/v1/recipes')
        .then(res => {
          recipes.forEach(recipe => {
            expect(res.body).toContainEqual({
              _id: recipe._id.toString(),
              name: recipe.name
            });
          });
        });
    });

    it('updates a recipe by id', async() => {
      const recipe = await Recipe.create({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ],
        ingredients: [{
          ingredient: 'Salt',
          amount: 1,
          unit: 'pinch'
        }]
      });

      return request(app)
        .patch(`/api/v1/recipes/${recipe._id}`)
        .send({ name: 'good cookies' })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            name: 'good cookies',
            directions: [
              'preheat oven to 375',
              'mix ingredients',
              'put dough on cookie sheet',
              'bake for 10 minutes'
            ],
            ingredients: [{
              ingredient: 'Salt',
              amount: 1,
              unit: 'pinch',
              _id: expect.any(String)
            }],
            __v: 0
          });
        });
    });

    it('gets a recipe by id', async() => {
      const recipes = await Recipe.create([
        {
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            ingredient: 'Salt',
            amount: 1,
            unit: 'pinch'
          }]
        }
      ]);

      return request(app)
        .get(`/api/v1/recipes/${recipes[0]._id}`)
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            name: 'cookies',
            directions: [
              'preheat oven to 375',
              'mix ingredients',
              'put dough on cookie sheet',
              'bake for 10 minutes'
            ],
            ingredients: [{
              ingredient: 'Salt',
              amount: 1,
              unit: 'pinch',
              _id: expect.any(String)
            }],
            __v: 0
          });
        });
    });

    it('deletes recipe by id', async() => {
      const recipes = await Recipe.create([
        {
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            ingredient: 'Salt',
            amount: 1,
            unit: 'pinch'
          }]
        }
      ]);

      return request(app)
        .delete(`/api/v1/recipes/${recipes[0]._id}`)
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            name: 'cookies',
            directions: [
              'preheat oven to 375',
              'mix ingredients',
              'put dough on cookie sheet',
              'bake for 10 minutes'
            ],
            ingredients: [{
              ingredient: 'Salt',
              amount: 1,
              unit: 'pinch',
              _id: expect.any(String)
            }],
            __v: 0
          });
        });
    });
  });

  describe('events routes', () => {

    it('creates an event', () => {
      return request(app)
        .post('/api/v1/events')
        .send({
          recipeId: 1,
          dateOfEvent: Date.now(),
          notes: [
            'this recipe is good',
            'i substituted sugar for salt'
          ],
          rating: 4.5
        })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            recipeId: 1,
            dateOfEvent: expect.any(String),
            notes: [
              'this recipe is good',
              'i substituted sugar for salt'
            ],
            rating: 4.5,
            __v: 0
          });
        });
    });

    it('gets all events', async() => {
      const events = await Event.create([
        { recipeId: 1, dateOfEvent: Date.now(), notes: [], rating: 1 },
        { recipeId: 2, dateOfEvent: Date.now(), notes: [], rating: 3 },
        { recipeId: 3, dateOfEvent: Date.now(), notes: [], rating: 4 }
      ]);

      return request(app)
        .get('/api/v1/events')
        .then(res => {
          events.forEach(event => {
            expect(res.body).toContainEqual({
              _id: event._id.toString(),
              recipeId: event.recipeId
            });
          });
        });
    });

    it('updates a recipe by id', async() => {
      const event = await Event.create({
        recipeId: 1,
        dateOfEvent: Date.now(),
        notes: [
          'this recipe is good',
          'i substituted sugar for salt'
        ],
        rating: 4.5
      });

      return request(app)
        .patch(`/api/v1/events/${event._id}`)
        .send({ rating: 2 })
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            recipeId: 1,
            dateOfEvent: expect.any(String),
            notes: [
              'this recipe is good',
              'i substituted sugar for salt'
            ],
            rating: 2,
            __v: 0
          });
        });
    });

    it('gets a recipe by id', async() => {
      const events = await Event.create([
        {
          recipeId: 1,
          dateOfEvent: Date.now(),
          notes: [
            'this recipe is good',
            'i substituted sugar for salt'
          ],
          rating: 4.5
        }
      ]);

      return request(app)
        .get(`/api/v1/events/${events[0]._id}`)
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            recipeId: 1,
            dateOfEvent: expect.any(String),
            notes: [
              'this recipe is good',
              'i substituted sugar for salt'
            ],
            rating: 4.5,
            __v: 0
          });
        });
    });

    it('deletes events by id', async() => {
      const events = await Event.create([
        {
          recipeId: 1,
          dateOfEvent: Date.now(),
          notes: [
            'this recipe is good',
            'i substituted sugar for salt'
          ],
          rating: 4.5
        }
      ]);

      return request(app)
        .delete(`/api/v1/events/${events[0]._id}`)
        .then(res => {
          expect(res.body).toEqual({
            _id: expect.any(String),
            recipeId: 1,
            dateOfEvent: expect.any(String),
            notes: [
              'this recipe is good',
              'i substituted sugar for salt'
            ],
            rating: 4.5,
            __v: 0
          });
        });
    });
  });
});
