import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from 'src/app/component/add-item/add-item.component';
import { TaskModel } from 'src/app/model';
import { SocketService } from 'src/app/service';
import { AddSectionComponent } from '../add-section';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

  ACTION = {
    DELETE: 'Delete',
    RENAME: 'Rename'
  }

  @Input() list: TaskModel;

  constructor (
    private _socket: SocketService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  addNewItem() {
    this.dialog.open(AddItemComponent, {
      width: '250px', data: { name: this.list.name }
    }).afterClosed().subscribe(result => {
      if (result) {
        this._socket.addItem(this.list.id, result)
      }
    });
  }

  private _renameSection() {
    this.dialog.open(AddSectionComponent, {
      width: '250px', data: this.list
    }).afterClosed().subscribe((result: string) => {
      this._socket.renameSection(this.list, result);
    });
  }

  drop(event: any) {
    this._socket.drop(event);
  }

  onAction(action: string) {
    switch (action) {
      case this.ACTION.DELETE:
        this._socket.deleteSection(this.list);
        break;
      case this.ACTION.RENAME:
        this._renameSection();
        break;
    }
  }

}
