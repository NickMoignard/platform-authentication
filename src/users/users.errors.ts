export class UsersError extends Error {}

export class UsernameAlreadyInUseError extends UsersError {
  constructor() {
    super('Username already in use');
  }
}

export class EmailAlreadyInUseError extends UsersError {
  constructor() {
    super('Email already in use');
  }
}
