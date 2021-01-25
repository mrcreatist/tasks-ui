import { Component, Input, OnInit } from '@angular/core';
import { ItemModel } from 'src/app/model';
import { SocketService } from 'src/app/service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  ACTION = {
    MARK: 'Mark',
    DELETE: 'Delete',
    RENAME: 'Rename'
  }

  @Input() item: ItemModel;

  constructor (
    private _socket: SocketService
  ) { }

  ngOnInit(): void {
  }

  onAction(action: string) {
    switch (action) {
      case this.ACTION.MARK:
        this._socket.markItem(this.item);
        break;
      case this.ACTION.DELETE:
        this._socket.deleteItem(this.item);
        break;
      case this.ACTION.RENAME:
        break;
    }
  }

}
