type Layoutsetting = {
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
};

interface MarkupLayout {
    settings?: Layoutsetting;
}

interface MailLayoutModel extends MarkupLayout {
    link: string;
}

export type { MailLayoutModel, MarkupLayout };
