import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskModel } from 'src/app/model';
import { SocketService } from '../../service';
import { AddSectionComponent } from '../add-section';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  lists: Array<TaskModel>;

  constructor (
    private _socket: SocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._socket.list.subscribe((boards: Array<TaskModel>) => (this.lists = boards, console.log(this.lists)));
  }

  getList() {
    this.lists = this._socket.getList();
  }

  addNewSection() {
    this.dialog.open(AddSectionComponent, {
      width: '250px'
    }).afterClosed().subscribe((result: string) => {
      this._socket.addSection(result);
    });
  }

}
