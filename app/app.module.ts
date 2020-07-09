import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MeshComponent } from './mesh.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, MeshComponent ],
  providers: [{ provide: Window, useValue: window }],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
