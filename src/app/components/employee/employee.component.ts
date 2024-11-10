import { Component, computed, signal } from '@angular/core';
import { Employee } from '../../Models/emplyee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EmployeeFormComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  constructor(private employeeService: EmployeeService) {}

  searchTermSignal = signal('');
  showModal = signal(false);
  selectedEmployee = signal<Employee | null>(null);

  filteredEmployees = computed(() => {
    const employees = this.employeeService.getEmployees()();
    const term = this.searchTermSignal().toLowerCase();
    
    if (!term) return employees;

    return employees.filter(emp => 
      emp.name.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term) ||
      emp.gender.toLowerCase().includes(term) ||
      emp.skills.some(skill => skill.toLowerCase().includes(term))
    );
  });

  showAddModal() {
    this.selectedEmployee.set(null);
    this.showModal.set(true);
  }

  editEmployee(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedEmployee.set(null);
  }

  saveEmployee(employeeData: Omit<Employee, 'id'>) {
    if (this.selectedEmployee()) {
      this.employeeService.updateEmployee({
        ...employeeData,
        id: this.selectedEmployee()!.id
      });
    } else {
      this.employeeService.addEmployee(employeeData);
    }
    this.closeModal();
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id);
    }
  }
}
