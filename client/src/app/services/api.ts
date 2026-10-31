import { Injectable,inject,signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Service, Booking, Client, CreateBookingDto, LoginDto,BookingStatus} from "../models/models";

@Injectable({
    providedIn: 'root'
})
export class ApiService{
    private http = inject(HttpClient);
    private baseUrl = 'https://localhost:7210/api';

    currentUser = signal<Client | null>(this.getSavedUser());

    setCurrentUser(user: Client){
        this.currentUser.set(user);
        localStorage.setItem('user',JSON.stringify(user));
    }
    logout(){ 
        this.currentUser.set(null);
        localStorage.removeItem('user');
    }
    getSavedUser():Client | null{
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    }


    getService(){
        return this.http.get<Service[]>(`${this.baseUrl}/Services`);
    }
    getServiceById(idService:number){
        return this.http.get<Service>(`${this.baseUrl}/Services/${idService}`)
    }
    addService(service:Service){
        return this.http.post<Service>(`${this.baseUrl}/Services`,service);
    }
    deleteService(idService:number){
        return this.http.delete<Service>(`${this.baseUrl}/Services/${idService}`);
    }
    updateService(idService:Number,service:Service){
        return this.http.put<Service>(`${this.baseUrl}/Services/${idService}`,service);
    }




    getClient(){
        return this.http.get<Client[]>(`${this.baseUrl}/Clients`);
    }
    getClientById(idClient:Number){
        return this.http.get<Client>(`${this.baseUrl}/Clients/${idClient}`);
    }
    createClient(client: Partial<Client>){ 
        return this.http.post<Client>(`${this.baseUrl}/Clients`,client);
    }

    loginClient(dto:LoginDto){
        return this.http.post<Client>(`${this.baseUrl}/Clients/login`,dto);
    }
    deleteClient(idClient:Number){
        return this.http.delete<Client>(`${this.baseUrl}/Clients/${idClient}`);
    }
    updateClient(idClient:Number,client:Client){
        return this.http.put<Client>(`${this.baseUrl}/Clients/${idClient}`,client);
    }








    createBooking(dto:CreateBookingDto){
        return this.http.post<Booking>(`${this.baseUrl}/Bookings`,dto);
    }
    getBookings(data?:Date,status?:BookingStatus,page?:Number,pageSize?:Number){
        let params = new URLSearchParams();
        if(data)params.set('date',data.toISOString().split('T')[0]);
        if(status !== undefined && status !== null)params.set('status',status.toString());
        if(page)params.set('page',page.toString());
        if(pageSize)params.set('pageSize',pageSize.toString());
        return this.http.get<Booking[]>(`${this.baseUrl}/Bookings?${params.toString()}`);
    }
    updateBookingStatus(id: Number, status:BookingStatus){
        return this.http.patch<Booking>(`${this.baseUrl}/Bookings/${id}/status`,status);
    }
    deleteBooking(id:Number){
        return this.http.delete<Booking>(`${this.baseUrl}/Bookings/${id}`);
    }





}
