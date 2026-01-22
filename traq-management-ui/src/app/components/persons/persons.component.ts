import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Person, PersonService } from '../../services/person.service';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css',
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  message = '';

  // Create person form
  firstName = '';
  lastName = '';
  idNumber = '';

  // Search form
  searchIdNumber = '';
  searchSurname = '';
  searchAccountNumber = '';

  // Edit person state
  editingPersonId: number | null = null;
  editFirstName = '';
  editLastName = '';
  editIdNumber = '';

  constructor(private personService: PersonService) { }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.personService.getAllPersons().subscribe({
      next: (data: Person[]) => {
        this.persons = data;
      },
      error: (err: any) => {
        console.error('❌ API error', err);
        this.message = '❌ Failed to load persons';
      },
    });
  }

  createPerson(): void {
    this.message = '';

    if (!this.firstName || !this.lastName || !this.idNumber) {
      this.message = '❌ Please enter all fields';
      return;
    }

    this.personService
      .createPerson({
        firstName: this.firstName,
        lastName: this.lastName,
        idNumber: this.idNumber,
      })
      .subscribe({
        next: () => {
          this.message = '✅ Person created successfully!';
          this.firstName = '';
          this.lastName = '';
          this.idNumber = '';
          this.loadPersons();
        },
        error: (err: any) => {
          console.error('❌ Create error', err);
          this.message = '❌ Failed to create person (ID Number may already exist)';
        },
      });
  }

  deletePerson(id: number): void {
    if (!confirm('Delete this person?')) return;

    this.personService.deletePerson(id).subscribe({
      next: () => {
        this.message = '✅ Person deleted successfully';
        this.loadPersons();
      },
      error: (err: any) => {
        console.error('❌ Delete error', err);
        this.message =
          '❌ Cannot delete person (they may have accounts / accounts not closed)';
      },
    });
  }

  searchPersons(): void {
    this.message = '';

    // if all search boxes empty -> reload all
    if (!this.searchIdNumber && !this.searchSurname && !this.searchAccountNumber) {
      this.loadPersons();
      return;
    }

    this.personService
      .searchPersons(
        this.searchIdNumber,
        this.searchSurname,
        this.searchAccountNumber
      )
      .subscribe({
        next: (data: Person[]) => {
          this.persons = data;
        },
        error: (err: any) => {
          console.error('❌ Search error', err);
          this.message = '❌ Search failed';
        },
      });
  }

  // ✅ EDITING FUNCTIONS
  startEdit(person: Person): void {
    this.editingPersonId = person.personId;
    this.editFirstName = person.firstName;
    this.editLastName = person.lastName;
    this.editIdNumber = person.idNumber;
    this.message = '';
  }

  cancelEdit(): void {
    this.editingPersonId = null;
    this.editFirstName = '';
    this.editLastName = '';
    this.editIdNumber = '';
  }

  saveEdit(): void {
    if (this.editingPersonId === null) return;

    if (!this.editFirstName || !this.editLastName || !this.editIdNumber) {
      this.message = '❌ Please fill all fields before saving';
      return;
    }

    this.personService
      .updatePerson(this.editingPersonId, {
        firstName: this.editFirstName,
        lastName: this.editLastName,
        idNumber: this.editIdNumber,
      })
      .subscribe({
        next: () => {
          this.message = '✅ Person updated successfully';
          this.cancelEdit();
          this.loadPersons();
        },
        error: (err: any) => {
          console.error('❌ Update error', err);
          this.message = '❌ Failed to update person (duplicate ID number?)';
        },
      });
  }
}
