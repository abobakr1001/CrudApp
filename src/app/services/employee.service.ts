import { Injectable, signal } from '@angular/core';
import { Employee } from '../Models/emplyee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employees = signal<Employee[]>([]);
  private nextId = signal(1);

  getEmployees() {
    return this.employees;
  }

  addEmployee(employee: Omit<Employee, 'id'>) {
    this.employees.update(employees => [
      ...employees,
      { ...employee, id: this.nextId() }
    ]);
    this.nextId.update(id => id + 1);
  }

  updateEmployee(updatedEmployee: Employee) {
    this.employees.update(employees =>
      employees.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  }

  deleteEmployee(id: number) {
    this.employees.update(employees => 
      employees.filter(emp => emp.id !== id)
    );
  }
}
