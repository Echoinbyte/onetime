"use client";
import "@blocknote/core/fonts/inter.css";
import {
    DefaultReactSuggestionItem,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { en } from "@blocknote/core/locales";
import {
    locales as multiColumnLocales,
    multiColumnDropCursor,
    withMultiColumn,
    getMultiColumnSlashMenuItems,
} from "@blocknote/xl-multi-column";
import {
    BlockNoteSchema,
    combineByGroup,
    defaultBlockSpecs,
    defaultInlineContentSpecs,
    filterSuggestionItems,
    insertOrUpdateBlock,
} from "@blocknote/core";
import {startTransition, useEffect, useMemo, useRef} from "react";
import { Alert } from "./shared/Alert";
import { Blockquote } from "./shared/Blockquote";
import { MathExpression } from "./shared/Math";
import { HorizontalRule } from "./shared/Hr";
import { IframeBlock } from "./shared/Iframe";
import { Mention } from "./shared/Mention";
import {
    RiAlertFill,
    RiComputerLine,
    RiDoubleQuotesL,
    RiFunctionLine,
    RiSeparator,
} from "react-icons/ri";

export const schema = BlockNoteSchema.create({
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

const insertAlert = (editor: typeof extendedSchema.BlockNoteEditor) => ({
    title: "Alert",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "alert",
        });
    },
    aliases: [
        "alert",
        "notification",
        "emphasize",
        "warning",
        "error",
        "info",
        "success",
    ],
    group: "Modules",
    icon: <RiAlertFill />,
    subtext: "Highlight important info.",
});

const insertBlockquote = (editor: typeof extendedSchema.BlockNoteEditor) => ({
    title: "Blockquote",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "blockquote",
        });
    },
    aliases: ["blockquote", "quote", "citation", "reference", "quotation"],
    group: "Modules",
    icon: <RiDoubleQuotesL />,
    subtext: "Emphasize quotes or references.",
});

const insertMathExpression = (
    editor: typeof extendedSchema.BlockNoteEditor
) => ({
    title: "Math Expression",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "mathExpression",
        });
    },
    aliases: ["math", "equation", "formula", "calculation", "expression"],
    group: "Modules",
    icon: <RiFunctionLine />,
    subtext: "Display math or science equations.",
});

const insertHR = (editor: typeof extendedSchema.BlockNoteEditor) => ({
    title: "Horizontal Rule",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "hr", // Type should match the block type created for horizontal rules
        });
    },
    aliases: ["hr", "divider", "line"],
    group: "Modules",
    icon: <RiSeparator />, // You can replace this with an appropriate icon
    subtext: "Insert a horizontal line to separate content.",
});

const insertIframe = (editor: typeof extendedSchema.BlockNoteEditor) => ({
    title: "I-Frame",
    onItemClick: () => {
        insertOrUpdateBlock(editor, {
            type: "iframe", // This should match the block type used for iframe
        });
    },
    aliases: ["iframe", "embed", "video", "external"],
    group: "Modules",
    icon: <RiComputerLine />, // You can replace this with an appropriate icon
    subtext: "Embed external content via iframe.",
});

const getMentionMenuItems = (
    editor: typeof extendedSchema.BlockNoteEditor
): DefaultReactSuggestionItem[] => {
    const users = ["people", "everyone", "someone", "noone", "admin", "author"];

    return users.map((user) => ({
        title: user,
        onItemClick: () => {
            editor.insertInlineContent([
                {
                    type: "mention",
                    props: {
                        user,
                    },
                },
                " ",
            ]);
        },
    }));
};

export default function Editor({compoundContent, setCompoundContent}: {compoundContent: string, setCompoundContent: (content: string) => void}) {

    const editor = useCreateBlockNote({
        initialContent: JSON.parse(compoundContent || "[{}]"),
        schema: extendedSchema,
        dropCursor: multiColumnDropCursor,
        dictionary: {
            ...en,
            multi_column: multiColumnLocales.en,
        },
        placeholders: {
            ...en.placeholders,
            emptyDocument: "Type '/' to insert secret message",
        },
        tables: {
            cellBackgroundColor: true,
            cellTextColor: true,
            headers: true,
            splitCells: true,
        },
    });

    const getSlashMenuItems = useMemo(() => {
        return async (query: string) =>
            filterSuggestionItems(
                combineByGroup(
                    getDefaultReactSlashMenuItems(editor),
                    getMultiColumnSlashMenuItems(editor),
                    [
                        insertAlert(editor),
                        insertBlockquote(editor),
                        insertMathExpression(editor),
                        insertHR(editor),
                        insertIframe(editor),
                    ]
                ),
                query
            );
    }, [editor]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);


    const editorOnChange = async () => {
        if (!editor.document) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            const content = JSON.stringify(editor.document);
            startTransition(() => setCompoundContent(content));
        }, 500);
    }

    return (
        <>
            <BlockNoteView
                editor={editor}
                onChange={editorOnChange}
                slashMenu={false}
                className="pb-4 w-full"
            >
                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={getSlashMenuItems}
                />
                <SuggestionMenuController
                    triggerCharacter={"@"}
                    getItems={async (query) =>
                        filterSuggestionItems(getMentionMenuItems(editor), query)
                    }
                />
            </BlockNoteView>
        </>
    );
}