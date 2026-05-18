export function isLuhnValid(card_number: string): boolean {
  const digits = card_number.replace(/\D/g, '')

  if (digits.length < 12 || digits.length > 19) {
    return false
  }

  let sum: number = 0
  let shouldDouble: boolean = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits.charAt(i))

    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }

    sum += d
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}
