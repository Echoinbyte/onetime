import React from 'react'
import {BlockNoteView} from "@blocknote/mantine";
import {BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs} from "@blocknote/core";
import {Alert} from "@/components/shared/Alert";
import {Blockquote} from "@/components/shared/Blockquote";
import {MathExpression} from "@/components/shared/Math";
import {HorizontalRule} from "@/components/shared/Hr";
import {IframeBlock} from "@/components/shared/Iframe";
import {Mention} from "@/components/shared/Mention";
import {withMultiColumn} from "@blocknote/xl-multi-column";
import {useCreateBlockNote} from "@blocknote/react";

const schema = BlockNoteSchema.create({
    blockSpecs: {
        ...defaultBlockSpecs,
        alert: Alert,
        blockquote: Blockquote,
        mathExpression: MathExpression,
        hr: HorizontalRule,
        iframe: IframeBlock,
    },
    inlineContentSpecs: {
        ...defaultInlineContentSpecs,
        mention: Mention,
    },
});

const extendedSchema = withMultiColumn(schema);

function RawEditor({compoundContent, type}: {compoundContent: string, type: 'simple' | 'compound'}) {
    const editor = useCreateBlockNote({
        initialContent: JSON.parse(compoundContent || "[{}]"),
        schema: extendedSchema,
    });

    return (
        <BlockNoteView
            editor={editor}
            editable={false}
            slashMenu={false}
            formattingToolbar={false}
            spellCheck={false}
            className="w-full"
        >
        </BlockNoteView>
    )
}

export default RawEditor
