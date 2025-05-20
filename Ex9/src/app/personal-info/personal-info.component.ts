import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dateOfBirth: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      })
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.personalInfoForm.valid) {
      console.log(this.personalInfoForm.value);
      alert('Submitted successfully!');
      this.personalInfoForm.reset();
    }
  }

  get firstName() { return this.personalInfoForm.get('firstName'); }
  get lastName() { return this.personalInfoForm.get('lastName'); }
  get email() { return this.personalInfoForm.get('email'); }
  get phone() { return this.personalInfoForm.get('phone'); }
  get dateOfBirth() { return this.personalInfoForm.get('dateOfBirth'); }
  get address() { return this.personalInfoForm.get('address') as FormGroup; }
} 