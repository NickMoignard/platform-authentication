export class AuthError extends Error {}

export class UserNotFoundError extends AuthError {
  constructor() {
    super('User not found');
  }
}

export class IncorrectPasswordError extends AuthError {
  constructor() {
    super('Password is incorrect');
  }
}
