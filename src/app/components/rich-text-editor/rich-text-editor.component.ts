import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChainedCommands, Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import StarterKit from '@tiptap/starter-kit';
import { formattingControls } from './formatting-controls';
import { EditorConfig } from './types';

@Component({
    selector: 'rich-text-editor',
    templateUrl: './rich-text-editor.component.html',
    styleUrls: ['./rich-text-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RichTextEditorComponent),
            multi: true,
        },
    ],
})
export class RichTextEditorComponent
    implements OnInit, OnDestroy, ControlValueAccessor
{
    constructor() {}

    ngOnInit(): void {
        this.formattingControls = this.formattingControls.filter(
            ({ configKey }) => this.config[configKey]
        );
    }
    ngOnDestroy(): void {
        this.editor.destroy();
    }

    value: string = '';
    @Output() blur = new EventEmitter<FocusEvent>();
    @Output() focus = new EventEmitter<FocusEvent>();

    @Input() placeholder: string = '';
    @Input() config: Record<keyof EditorConfig, true> = {
        bold: true,
        italic: true,
        strike: true,
        headings: true,
        lists: true,
        taskLists: true,
        rule: true,
        code: true,
        undoRedo: true,
    };
    formattingControls = formattingControls;

    isFocused = false;
    editor = new Editor({
        content: this.value,
        extensions: [
            StarterKit,
            Placeholder.configure({
                emptyEditorClass: 'is-editor-empty',
                placeholder: ({ node, editor }) => {
                    if (node.type.name == 'heading')
                        return 'Heading ' + node.attrs.level;

                    if (editor.isEmpty) return this.placeholder;

                    return '';
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],
        onFocus: ({ event }) => {
            this.focus.emit(event);
            this.isFocused = true;
        },
        onBlur: ({ event }) => {
            const isFormattingOptionsContainer = (elem: HTMLElement | null) =>
                elem?.className?.includes('format-controls') || false;

            // @TODO: currently only works with direct children of the formatting options container
            const clickedFormattingOptions = isFormattingOptionsContainer(
                (event.relatedTarget as HTMLElement)?.parentElement
            );

            if (!clickedFormattingOptions) {
                this.blur.emit(event);
                this.isFocused = false;
            }
        },
        onUpdate: ({ editor }) => this.propagateChange(editor.getHTML()),
        // @TODO: figure out a good solution to limit the editor to one line (having ENTER submit something)
        // onCreate: () => {
        //     this.editor.view.dom.addEventListener('keydown', (e) => {
        //         if (e.key == 'Enter' && !e.shiftKey) {
        //             console.log('should stop');
        //             e.cancelBubble = true;
        //             console.log(e.target);
        //             e.preventDefault();
        //             e.stopImmediatePropagation();
        //         }
        //     });
        // },
    });
    execEditorChain(callback: (chain: ChainedCommands) => ChainedCommands) {
        callback(this.editor.chain().focus()).run();
    }

    writeValue(value: string) {
        if (value !== undefined) {
            this.value = value;
            this.editor.commands.setContent(value);
        }
    }
    registerOnTouched(fn: any) {}
    propagateChange: (value: string) => void = () => {};

    registerOnChange(fn: (value: string) => void) {
        this.propagateChange = fn;
    }
}
