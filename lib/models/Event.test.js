const mongoose = require('mongoose');
const Event = require('./Event');

describe('Event model', () => {
  it('has a required name', () => {
    const event = new Event();
    const { errors } = event.validateSync();

    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

  it('has a recipeId, dateOfEvent, notes, and ratings field', () => {
    const event = new Event({
      recipeId: 1,
      dateOfEvent: Date.now(),
      notes: [
        'this recipe is good',
        'i substituted sugar for salt'
      ],
      rating: 4.5
    });

    expect(event.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      recipeId: 1,
      dateOfEvent: expect.any(String),
      notes: [
        'this recipe is good',
        'i substituted sugar for salt'
      ],
      rating: 4.5
    });
  });
});
