import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client';
import { ItemModel, TaskModel } from '../model';
import { environment } from '../../environments/environment';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;
  private lists: Array<TaskModel> = [];

  subject = new Subject<TaskModel[]>();
  list: Observable<TaskModel[]> = this.subject.asObservable();

  constructor () {
    this.socket = socketIO(`ws://${environment.socket.URL}:${environment.socket.port}`);
    this.socket.on('fireInTheHole', (data: Array<TaskModel>) => (this.lists = (data === null ? [] : data), this.subject.next(this.lists)));
  }

  private _getId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private syncWithServer() {
    if (this.lists) {
      this.socket.emit('makeFireInTheHole', this.lists);
    }
  }

  // SECTION OPERATIONS

  addSection(name: string) {
    let section: TaskModel = {
      id: this._getId(),
      name: name,
      data: []
    };
    this.lists.push(section);
    this.syncWithServer();
  }

  deleteSection(list: TaskModel) {
    let tempList: Array<TaskModel> = [];
    this.lists.forEach((l: TaskModel) => {
      if (l.id !== list.id) {
        tempList.push(l);
      }
    });
    this.lists = tempList;
    this.syncWithServer();
  }

  renameSection(list: TaskModel, newName: string) {
    this.lists.forEach((l: TaskModel) => {
      if (l.id === list.id) {
        l.name = newName;
      }
    });
    this.syncWithServer();
  }

  // ITEM OPERATIONS

  addItem(id: number, item: string) {
    let data: ItemModel = {
      id: this._getId(),
      title: item,
      completed: false
    }
    this.lists.filter(_ => _.id === id)[0].data.push(data)
    this.syncWithServer();
  }

  markItem(item: ItemModel) {
    this.lists.forEach((l: TaskModel) => {
      l.data.forEach((i: ItemModel) => {
        if (i.id === item.id) {
          i.completed = !i.completed;
        }
      })
    })
  }

  updateItem(item: ItemModel, name: string) {
    this.lists.forEach((l: TaskModel) => {
      l.data.forEach((i: ItemModel) => {
        if (i.id === item.id) {
          i.title = name;
        }
      });
    })
    this.syncWithServer();
  }

  deleteItem(item: ItemModel) {
    let tempList: Array<TaskModel> = [];
    this.lists.forEach((l: TaskModel) => {
      l.data.forEach((i: ItemModel) => {
        if (i.id !== item.id) {
          tempList.push(l);
        }
      });
    });
    this.lists = tempList;
    this.syncWithServer();
  }

  getList() {
    return this.lists;
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      let current = this.lists.indexOf(event.container.data);
      moveItemInArray(this.lists[current].data, event.previousIndex, event.currentIndex);
    } else {
      let previous = this.lists.indexOf(event.previousContainer.data);
      let current = this.lists.indexOf(event.container.data);
      transferArrayItem(this.lists[previous].data, this.lists[current].data, event.previousIndex, event.currentIndex);
    }
    this.syncWithServer();
  }

}
