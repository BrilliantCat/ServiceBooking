export interface Service{
    idService: number;
    nameService: string;
    descriptionService: string;
    priceService: number;
    timeService: number;
}
export interface Client{
    idClient:number;
    nameClient:string;
    emailClient:string;
    phoneClient:string;
    passwordClient:string;
}
export enum BookingStatus{
    Created = 0,
    Confirmed = 1,
    Cancelled = 2
}
export interface Booking{
    idBooking:number;
    idClient:number;
    client? : Client;
    idService:number;
    service?:Service;
    startService: string;
    endService: string;
    status: BookingStatus;
}
export interface CreateBookingDto{
    idClient:number;
    idService:number;
    startService: string;
}
export interface LoginDto{
    phoneClient:string;
    passwordClient:string;
}
