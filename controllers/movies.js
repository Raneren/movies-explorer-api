const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const PermissionError = require('../errors/permission-error');

// Получить все фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch(next);
};

// Создать фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

// Удалить фильм
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(`Карточка с id: ${req.params.userId} не найдена`))
    // eslint-disable-next-line consistent-return
    .then((movie) => {
      if (JSON.stringify(movie.owner) === JSON.stringify(req.user._id)) {
        return Movie.deleteOne(movie);
      }
      next(new PermissionError('Вы не можете удалить фильм, созданный другим пользователем'));
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
