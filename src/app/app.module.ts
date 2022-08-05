import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxTiptapModule } from 'ngx-tiptap';

import { AppComponent } from './app.component';
import { RichTextEditorComponent } from './components/rich-text-editor/rich-text-editor.component';

@NgModule({
    declarations: [AppComponent, RichTextEditorComponent],
    imports: [BrowserModule, FormsModule, NgxTiptapModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
