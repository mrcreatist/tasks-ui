export class TaskModel {
    id: number;
    name: string;
    data: Array<ItemModel>;
}

export class ItemModel {
    id: number;
    title: string;
    completed: boolean;
}