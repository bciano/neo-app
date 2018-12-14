import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { LocalDataSource } from 'ng2-smart-table';
import { EmployeeService } from '../../@core/data/employee.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: EmployeeService) {
    service.getEmployees().subscribe(
      data => {this.source.load(data.results)},
      err => console.error(err),
      () => console.log('done loading table data')
    );
  }

  onDeleteConfirm(event): void {
    console.log(event.data);
    var data = {
      id: event.data.id,
    };
    this.service.deleteEmployee(data).subscribe(
      data => {event.confirm.resolve(event.data)},
      err => console.error(err),
      () => console.log('done deleting employee')
    );
  }

  onCreateConfirm(event): void {
    var newData = {
      id: event.newData.id,
      name : event.newData.name
    };
    this.service.createEmployee(newData).subscribe(
      data => {
        console.log(data); 
        event.confirm.resolve(event.newData)
      },
      err => console.error(err),
      () => console.log('done creating new employee')
    );
  }

  onEditConfirm(event):void {
    console.log(event);
    this.service.updateEmployee(event.data, event.newData).subscribe(
      data => {
        console.log(data); 
        event.confirm.resolve(event.newData)
      },
      err => console.error(err),
      () => console.log('done creating new employee')
    );
  }

  private alive = true;

  ngOnDestroy() {
    this.alive = false;
  }
}
