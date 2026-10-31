import { Component,OnInit,inject,signal } from '@angular/core';
import {ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { Booking,BookingStatus,Client,Service } from '../../models/models';

@Component({
  imports: [RouterLink],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  public api = inject(ApiService);
  booking = signal<Booking[]>([]);
  clients = signal<Client[]>([]);
  services = signal<Service[]>([]);
  activeTab = signal<'bookings' | 'clients' | 'services'>('bookings');
  bookingStatus = BookingStatus;
  errorMessageAdd =signal('');
  errorMessageEdd =signal('');
  newService = signal<Service | null>(null);



  addServiceName = signal('');
  addServicePrice = signal(0);
  addServiceDescription = signal('');
  addServiceTime = signal(30);

  eddServiceName = signal('');
  eddServicePrice = signal(0);
  eddServiceDescription = signal('');
  eddServiceTime = signal(30);

  getAllBooking(){
    this.api.getBookings().subscribe({
      next:(data)=>{
        this.booking.set(data);
        console.log('Бронирования получены',data);
      },
      error:(err)=>{
        console.error('Ошибка при получении бронирований',err);
      }
    });
    this.activeTab.set('bookings');
  }
  getAllClient(){
    this.api.getClient().subscribe({
      next:(data)=>{
        this.clients.set(data);
        console.log('Клиенты получены',data);
      },
      error:(err)=>{
        console.error('Ошибка при получении клиентов',err);
      }
    });
    this.activeTab.set('clients');
  }
  getAllService(){
    this.api.getService().subscribe({
      next:(data)=>{
        this.services.set(data);
        console.log('Услуги получены',data);
      },
      error:(err)=>{
        console.error('Ошибка при получении услуг',err);
      }
    });
    this.activeTab.set('services');
  }
  ngOnInit(){
    this.getAllBooking();
  }
  
  changeStatus(id:Number,status:BookingStatus){
    this.api.updateBookingStatus(id,status).subscribe({
      next: ()=>{
        this.getAllBooking();
      },
      error:(err)=>{
        console.error('Ошибка при изменении статуса',err);
      }
    })
  }

  deleteBooking(id:Number){
    if(confirm('Вы уверены что хотите удалить?')){
      this.api.deleteBooking(id).subscribe({
        next:()=>{
          this.getAllBooking();
        },
        error:(err)=>{
          console.error('Ошибка при удалении бронирования',err);
        }
      })
    }
  }

  deleteClient(id:number){
    this.api.deleteClient(id).subscribe({
      next:()=>{
        this.getAllClient();
      },
      error:(err)=>{
        console.error('Ошибка при удалении клиента',err);
      }
    })
  }

  onAddService(e : Event){
    e.preventDefault();

    this.api.addService({
      idService:0,
      nameService:this.addServiceName(),
      priceService:Number(this.addServicePrice()),
      descriptionService:this.addServiceDescription(),
      timeService:Number(this.addServiceTime())
    }).subscribe({ 
      next:()=>{
        this.getAllService();
        this.errorMessageAdd.set('')
        this.cancelEditor();
      },
      error:(err)=>{
        this.errorMessageAdd.set("Услуга уже существует, попробуйте изменить")
        console.error('Ошибка при добавлении услуги',err);
      }
    })
  }
  deleteService(id:number){
    this.api.deleteService(id).subscribe({
      next:()=>{
        this.getAllService();
      },
      error:(err)=>{
        console.error('Ошибка при удалении услуги',err);
      }
    })
  }
  

  isEditor = signal(false);

  cancelEditor(){
    this.isEditor.set(false);
    this.eddServiceName.set('');
    this.eddServicePrice.set(0);
    this.eddServiceDescription.set('');
    this.eddServiceTime.set(30); 
    this.errorMessageEdd.set('');
    this.newService.set(null);
  }

  editService(id:number){
    this.eddServiceName.set('');
    this.eddServicePrice.set(0);
    this.eddServiceDescription.set('');
    this.eddServiceTime.set(30);
    this.isEditor.set(true);
    this.api.getServiceById(id).subscribe({
      next: (service)=>{
        this.newService.set(service);
        this.eddServiceName.set(this.newService()!.nameService)
        this.eddServicePrice.set(this.newService()!.priceService);
        this.eddServiceDescription.set(this.newService()!.descriptionService);
        this.eddServiceTime.set(this.newService()!.timeService);
      },
      error:(err)=>{
        console.error('Ошибка при получении услуги',err);
      }
    });

  }

  updateNewService(e:Event){
    e.preventDefault();
    this.api.updateService(this.newService()!.idService,{
      idService:this.newService()!.idService,
      nameService:this.eddServiceName(),
      priceService:Number(this.eddServicePrice()),
      descriptionService:this.eddServiceDescription(),
      timeService:Number(this.eddServiceTime())
    }).subscribe({
      next:()=>{
        this.getAllService();
        this.isEditor.set(false);
      },
      error:(err)=>{
        console.error('Ошибка при обновлении услуги',err);
      }
    })

  }
  


  editClientflag = signal(false);
  editClientName = signal('');
  editClientPhone = signal('');
  editClientEmail = signal('');
  editClientPassword = signal('');
  editClientData = signal<Client | null>(null);
  errorMessageClient = signal('');


  cancelEditClient(){
    this.editClientflag.set(false);
    this.editClientName.set('');
    this.editClientPhone.set('');
    this.editClientEmail.set('');
    this.editClientPassword.set('');
    this.errorMessageClient.set('');
    this.editClientData.set(null);
  }


  editClient(id:number){
    this.editClientflag.set(true);
    this.api.getClientById(id).subscribe({
      next:(client)=>{
        this.editClientData.set(client);
        this.editClientName.set(client.nameClient);
        this.editClientPhone.set(client.phoneClient);
        this.editClientEmail.set(client.emailClient);
        this.editClientPassword.set(client.passwordClient);
      },
      error:(err)=>{
        this.errorMessageClient.set('Ошибка при получении клиента');
        console.error('Ошибка при получении клиента',err);
      }
    })

  }

  onSaveClient(e:Event){
    e.preventDefault();
    this.api.updateClient(this.editClientData()!.idClient,{
      idClient:this.editClientData()!.idClient,
      nameClient:this.editClientName(),
      phoneClient:this.editClientPhone(),
      emailClient:this.editClientEmail(),
      passwordClient:this.editClientPassword()
    }).subscribe({
      next:()=>{
        this.getAllClient();
        this.cancelEditClient();
      },
      error:(err)=>{
        this.errorMessageClient.set('Ошибка при обновлении клиента');
        console.error('Ошибка при обновлении клиента',err);
      }
    })

  }


 
}
