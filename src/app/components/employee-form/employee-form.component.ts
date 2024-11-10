import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../Models/emplyee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {
  employee = input<Employee | null>(null);
  save = output<Omit<Employee, 'id'>>();

  employeeForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      skills: this.fb.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(5)])
    });
  }

  ngOnInit() {
    if (this.employee()) {
      const emp = this.employee()!;
      this.employeeForm.patchValue({
        name: emp.name,
        email: emp.email,
        gender: emp.gender
      });
      emp.skills.forEach(skill => this.addSkill(skill));
    }
  }

  get skills() {
    return this.employeeForm.get('skills') as FormArray;
  }

  addSkill(value: string = '') {
    if (this.skills.length < 5) {
      this.skills.push(this.fb.control(value, Validators.required));
    }
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.save.emit(this.employeeForm.value);
    }
  }
}
