export interface CheckoutInfo {
    cost: string,
    tipPercent: string,
    paymentMethod: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    cardNumber: string,
    expiry: string,
    cvc: string,
    addressLine1: string,
    addressLine2?: string,
    city: string,
    state: string,
    zip: string,
    country: string
}