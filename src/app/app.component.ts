import { Component, OnDestroy } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    editor = new Editor({
        extensions: [StarterKit],
    });

    value = '<p>Hello, Tiptap!</p>';

    ngOnDestroy(): void {
        this.editor.destroy();

        this.editor;
    }
}
