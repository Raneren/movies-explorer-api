const centralizedErrorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else if (err.code === 11000) {
    res.status(409).send({ message: 'Пользователь с данным email уже зарегистрирован' });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500
        ? `На сервере произошла ошибка ${err.name}`
        : message,
    });
  }
  next();
};

module.exports = centralizedErrorHandler;
