import { Component, inject,signal,computed, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { Service } from '../../models/models';
import {RouterLink} from '@angular/router';



@Component({
  imports: [RouterLink],
  selector: 'app-services-list',
  styleUrl: './services-list.css',
  templateUrl: './services-list.html',
})
export class ServicesList  implements OnInit{
  searchQuery = signal('');
  private api = inject(ApiService);
  services = signal<Service[]>([]);
  
  filteredServices = computed(()=>{
    const query = this.searchQuery().toLocaleLowerCase().trim();
    if(!query){
      return this.services();
    }
    return this.services().filter(s=>s.nameService.toLocaleLowerCase().includes(query));
  })
  ngOnInit(){
    this.api.getService().subscribe({
      next: (data)=>{
        this.services.set(data);
        console.log('Услуги получены с сервера',data);
      },
      error: (err)=>{
        console.error('Ошибка при получении услуг',err);
      }
    })
  }
  onSearch(event: Event){
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }


}
