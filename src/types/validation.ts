export interface ValidationError {
  field: string
  message: string
}

export class SignInValidationError extends Error {
  errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    super('Validation failed')
    this.name = 'SignInValidationError'
    this.errors = errors
  }
}
