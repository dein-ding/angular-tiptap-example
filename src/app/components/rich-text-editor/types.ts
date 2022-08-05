import type { ChainedCommands, Editor } from '@tiptap/core';

export interface EditorConfig {
    bold?: boolean;
    italic?: boolean;
    strike?: boolean;
    headings?: boolean;
    lists?: boolean;
    code?: boolean;
    rule?: boolean;
    undoRedo?: boolean;
}

export interface FormattingButton {
    configKey: keyof EditorConfig;
    title: string;
    slot: string;
    isActive?: (editor: Editor) => boolean;
    action: (chain: ChainedCommands) => ChainedCommands;
    testName: string;
}
