import { Component,inject,signal ,OnInit} from '@angular/core';
import { ApiService } from '../../services/api';
import { Booking,BookingStatus} from '../../models/models';
import { RouterLink } from '@angular/router';



@Component({
  imports: [RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  public api = inject(ApiService);

  authMode = signal<'login' | 'register'>('login');

  name = signal('');
  phone=signal('');
  email=signal('');
  password = signal('')
  
  myBookings = signal<Booking[]>([]);

  errorMessage=signal('');
  successMessage = signal('');
  isSubmiting = signal(false);

  bookingStatus = BookingStatus;

  ngOnInit(){
    if(this.api.currentUser()){
      this.loadMyBookings();
    }
  }

  loadMyBookings(){
   const user = this.api.currentUser();
   if(!user)return;
   this.api.getBookings().subscribe({
    next:(all)=>{
      const mine = all.filter(b=>b.idClient === user.idClient);
      this.myBookings.set(mine);
    },
    error:(err)=>{console.error(err);}
   }) 
  }

  onLogin(e:Event){
    e.preventDefault();
    this.errorMessage.set('');
    this.isSubmiting.set(true);

    this.api.loginClient({
      phoneClient:this.phone(),
      passwordClient:this.password()}).subscribe({
        next: (user)=>{
          this.isSubmiting.set(false);
          this.api.setCurrentUser(user);
          this.loadMyBookings();
        },
        error: ()=>{
          this.isSubmiting.set(false);
          this.errorMessage.set('Неверный телефон или пароль!');
        }
      });
    }

  onRegister(e:Event){
    e.preventDefault();
    this.errorMessage.set('');
    this.isSubmiting.set(true);

    this.api.createClient({
      nameClient:this.name(),
      phoneClient:this.phone(),
      emailClient:this.email(),
      passwordClient:this.password()
    }).subscribe({
      next:(user)=>{
        this.isSubmiting.set(false);
        this.api.setCurrentUser(user);
        this.loadMyBookings();
      },
      error: ()=>{
        this.isSubmiting.set(false);
        this.errorMessage.set('Ошибка регистрации. Возможно, такой телефон уже используется')
      }
    });
  }

  cancelMyBooking(idBooking: number){
    if(confirm('Вы уверены что хотите отменить запись?')){
     this.api.updateBookingStatus(idBooking,BookingStatus.Cancelled).subscribe({
      next: ()=>this.loadMyBookings(),
      error: (err)=>console.error(err)
    })
  }
  }

  onLogout(){
    this.api.logout();
    this.myBookings.set([]);
  }







}






