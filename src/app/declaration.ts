import { AddItemComponent, AddSectionComponent, PageComponent, SectionComponent } from './component';
import { ItemComponent } from './component/item/item.component';
import { SocketService } from './service';

export const components = [
    PageComponent,
    SectionComponent,
    ItemComponent,
    AddSectionComponent,
    AddItemComponent
];

export const providers = [
    SocketService
];