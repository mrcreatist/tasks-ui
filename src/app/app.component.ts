import { Component, OnInit } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from './add-item/add-item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  socket: any

  lists: any;

  constructor(public dialog: MatDialog) {
    this.socket = socketIO('ws://localhost:3333');
    this.socket.on('fireInTheHole', (data: any) => this.lists = data);
  }

  ngOnInit() {
  }

  syncWithServer() {
    this.socket.emit('makeFireInTheHole', this.lists);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      let current = this.lists.indexOf(event.container.data);
      moveItemInArray(this.lists[current].data, event.previousIndex, event.currentIndex);
    } else {
      let previous = this.lists.indexOf(event.previousContainer.data);
      let current = this.lists.indexOf(event.container.data);
      transferArrayItem(this.lists[previous].data, this.lists[current].data, event.previousIndex, event.currentIndex);
    }
  }

  addNew(type: string) {
    this.dialog.open(AddItemComponent, {
      width: '250px', data: { type: type }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.lists.forEach((x: any) => {
          if (x.name === type) {
            x.data.push({ title: result, completed: false });
            this.syncWithServer();
          }
        });
      }
    });
  }

  markDone(type: string, itemTitle: string, status: boolean) {
    this.lists.forEach((x: any) => {
      if (x.name === type) {
        x.data.forEach((y: any, index: any) => {
          if (y.title === itemTitle) {
            y.completed = !status;
            moveItemInArray(x.data, index, !status ? (x.data.length - 1) : 0);
            this.syncWithServer();
          }
        });
      }
    });
  }

  delete(type: string, itemTitle: string) {
    this.lists.forEach((x: any) => {
      if (x.name === type) {
        x.data.forEach((y: any, index: number) => {
          if (y.title === itemTitle) {
            x.data.splice(index, 1);
            this.syncWithServer();
          }
        });
      }
    });
  }

}
