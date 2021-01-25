import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './module';
import { AddItemComponent } from './component/add-item/add-item.component';
import { components, providers } from './declaration';
import { ItemComponent } from './component/item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    ...components,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [...providers],
  entryComponents: [AddItemComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
