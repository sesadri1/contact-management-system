import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Contact } from '../models/contact.model';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
    http = inject(HttpClient);
    title = 'contactly.web';


  contactsForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>('', Validators.required),
    favorite: new FormControl<boolean>(false)
  });

  contacts$ = this.getContacts();

  onFormSubmit() {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      favorite: this.contactsForm.value.favorite,
    };

    

    this.http.post('https://localhost:44317/api/Contacts',addContactRequest)
    .subscribe({
      next: (value) => {
       this.contacts$ = this.getContacts();
       this.contactsForm.reset({
       favorite: false
});

      },
      error: (err) => {
          console.error(err);
      }
        
    });
  }

  onDelete(id: string){
      this.http.delete(`https://localhost:44317/api/Contacts/${id}`)
      .subscribe({
        next: (value) => {
          alert('Item deleted');
          this.contacts$ = this.getContacts();
        },

        error: (err) => {
          console.error(err);
        }

      });
    }

  private getContacts(): Observable<Contact[]>{
   return this.http.get<Contact[]>('https://localhost:44317/api/Contacts');
  }
}
