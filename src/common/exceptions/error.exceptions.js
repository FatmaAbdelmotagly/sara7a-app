export const AppException = ({
  message = "error",
  options = {
    cause: { status: 400 },
  },
} = {}) => {
  throw new Error(message, options);
};

export const conflictException = (message = "Conflict", issues = {}) => {
  return AppException({
    message,
    options: {
      cause: { status: 409, ...issues },
    },
  });
};

export const notFoundException = (message = "not found", issues = {}) => {
  return AppException({
    message,
    options: {
      cause: { status: 404, ...issues },
    },
  });
};

export const UnauthorizedException = (
  message = "Unauthorized",
  issues = {},
) => {
  return AppException({
    message,
    options: {
      cause: { status: 401, ...issues },
    },
  });
};

export const forbiddenException = (message = "forbidden", issues = {}) => {
  return AppException({
    message,
    options: {
      cause: { status: 403, ...issues },
    },
  });
};
export const TooManyRequsetException = (
  message = "TooManyRequset",
  issues = {},
) => {
  return AppException({
    message,
    options: {
      cause: { status: 429, ...issues },
    },
  });
};

export const BadException = (message = "Bad request", issues = {}) => {
  return AppException({
    message,
    options: {
      cause: {
        status: 400,
        issues,
      },
    },
  });
};
