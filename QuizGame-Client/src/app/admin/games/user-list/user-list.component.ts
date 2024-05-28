import { Component, Input } from '@angular/core';
import { MatListModule, MatSelectionListChange, MatListOption } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageData } from '../../../models/pagedata';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatProgressBarModule,
    MatListModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  users: PageData<User> | null = null;
  isLoading : boolean = true;
  selectedUsers: User[] = [];
  @Input() totalSelectedUsers: User[] = [];

  constructor(
    private userService : UserService,
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe( (resp) => {
      if(resp != null) {
        this.users = resp;
        this.isLoading = false;
      }
    });
  }

  modifySelection(event: MatSelectionListChange){
    this.selectedUsers = event.source.selectedOptions.selected.map((o: MatListOption) => o.value);
    this.users?.data.forEach( (user) => {
      if(this.totalSelectedUsers.findIndex( value => value.id === user.id) != -1)
      {
        this.totalSelectedUsers.splice(this.totalSelectedUsers.findIndex( value => value.id === user.id), 1)
      }
    });

    this.totalSelectedUsers.splice(this.totalSelectedUsers.length+1, 0, ...this.selectedUsers)
  }

  getUsers(startIndex: number){
    this.userService.getAllUsers(undefined, undefined, startIndex).subscribe( (resp) => {
      if(resp != null) {
        this.users = resp;
        this.isLoading = false;
      }
    });
  }

  onChangePage(event: PageEvent){
    this.isLoading = true;
    this.getUsers(event.pageIndex*event.pageSize);
  }

  isSelected(id: string): boolean{
    if(this.totalSelectedUsers.find( p => p.id == id) != undefined){
      return true;
    }
    else
      return false;
  }
}
