const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  durationr: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (image) => validator.isURL(image, { protocols: ['http', 'https'], require_tld: true, require_protocol: true }),
      message: 'Неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (trailerLink) => validator.isURL(trailerLink, { protocols: ['http', 'https'], require_tld: true, require_protocol: true }),
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (thumbnail) => validator.isURL(thumbnail, { protocols: ['http', 'https'], require_tld: true, require_protocol: true }),
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  movieId: {
    movieId: {
      type: mongoose.Schema.Types.ObjectId, // изменить на MoviesExplorer
      required: true,
      ref: 'movieId',
    },
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
