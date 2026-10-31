import { Component,OnInit,inject,signal } from '@angular/core';
import {ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import {Service } from '../../models/models';

@Component({
  imports: [RouterLink],
  selector: 'app-booking',
  styleUrl: './booking.css',
  templateUrl: './booking.html',
})
export class Booking implements OnInit {
  selectedDate=signal('');
  selectedTime=signal('');
  clientPassword=signal('');
  clientPhone=signal('');

  isSubmitting = signal(false);
  errorMessage=signal('');
  successMessage=signal('');




  private route = inject(ActivatedRoute);
  public api = inject(ApiService);

  service = signal<Service | null>(null);

  ngOnInit(){
    const idService = Number(this.route.snapshot.paramMap.get('idService'));

    if(idService){
      this.api.getServiceById(idService).subscribe({
        next: (data)=>{
          this.service.set(data);
          console.log('Выбрана услуга: ', data);
        },
        error: (err)=>console.error('Ошибка при получении услуги', err)
      })
    }
    
  }

  onDateChange(event: Event){
    this.selectedDate.set((event.target as HTMLInputElement).value);
  }

  onTimeChange(event:Event){
    this.selectedTime.set((event.target as HTMLInputElement).value);
  }

  onPasswordChange(event:Event){
    this.clientPassword.set((event.target as HTMLInputElement).value);
  }
  onPhoneChange(event:Event){
    this.clientPhone.set((event.target as HTMLInputElement).value); 
  }

  onSubmitBooking(event:Event){
    event.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');


    this.isSubmitting.set(true);

    const startService = `${this.selectedDate()}T${this.selectedTime()}:00`;
    if(this.api.currentUser() == null){
      if(!this.selectedDate() || !this.selectedTime() || !this.clientPassword() || !this.clientPhone()){
        this.errorMessage.set('Пожалуйста, заполните все поля')
        return;
      }

      this.api.loginClient({
        phoneClient: this.clientPhone(), 
        passwordClient: this.clientPassword()}).subscribe({
          next: (client)=>{
            this.api.createBooking({
              idClient: client.idClient,
              idService: this.service()!.idService,
              startService: startService
            }).subscribe({
              next: ()=>{
                this.isSubmitting.set(false);
                this.successMessage.set('Запись успешно оформлена');
              },
              error: (err)=>{
                this.isSubmitting.set(false);
                if(err.status ===409){
                  this.errorMessage.set('Выбранное время уже занято! Пожалуйста, выберите другое время.');
                } else {
                  this.errorMessage.set('Ошибка при создании бронирования.');
                }
              }
            });
          },
          error: (err) =>{
            this.isSubmitting.set(false);
            this.errorMessage.set('Ошибка при авторизации. Проверьте телефон и пароль или зарегестрируйтесь.');
          }
      });
    }
    else{
        if (!this.selectedDate() || !this.selectedTime()) {
      this.errorMessage.set('Пожалуйста, выберите дату и время');
      return;
      }
      this.api.createBooking({
              idClient: this.api.currentUser()!.idClient,
              idService: this.service()!.idService,
              startService: startService
            }).subscribe({
              next: ()=>{
                this.isSubmitting.set(false);
                this.successMessage.set('Запись успешно оформлена');
              },
              error: (err)=>{
                this.isSubmitting.set(false);
                if(err.status ===409){
                  this.errorMessage.set('Выбранное время уже занято! Пожалуйста, выберите другое время.');
                } else {
                  this.errorMessage.set('Ошибка при создании бронирования.');
                }
              }
      });
    }
  }
}
