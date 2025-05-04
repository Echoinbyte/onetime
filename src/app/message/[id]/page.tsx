'use client';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {AlertCircle, Check, Eye, Gift, Lock} from 'lucide-react';
import {readMessage} from '@/app/actions';
import * as React from 'react';
import confetti from "canvas-confetti";
import {AppError} from '@/lib/errors';
import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import {BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs} from "@blocknote/core";
import {Alert} from "@/components/shared/Alert";
import {Blockquote} from "@/components/shared/Blockquote";
import {MathExpression} from "@/components/shared/Math";
import {HorizontalRule} from "@/components/shared/Hr";
import {IframeBlock} from "@/components/shared/Iframe";
import {Mention} from "@/components/shared/Mention";
import {withMultiColumn} from "@blocknote/xl-multi-column";


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

interface ErrorState {
    message: string;
    code: string;
}

export default async function ReadMessagePage({
                                            params,
                                        }: {
    params: Promise<{ id: string }>
}) {

    const {id} = await params;

    const [isRevealed, setIsRevealed] = useState(false);
    const [isLastView, setIsLastView] = useState(false);
    const [remainingViews, setRemainingViews] = useState(0);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'simple' | 'compound'>('simple');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorState | null>(null);

    const revealMessage = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await readMessage(id);
            setMessage(response.content);
            setRemainingViews(response.remainingViews);
            setIsLastView(response.isLastView);
            setType(response.type);
            setIsRevealed(true);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: {y: 0.6}
            });
        } catch (err) {
            const error = err as AppError;
            setError({
                message: error.message || 'Failed to reveal message',
                code: error.code || 'UNKNOWN_ERROR'
            });
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    };

    const editor = useCreateBlockNote({
        schema: extendedSchema,
    });

    useEffect(() => {
        if (type === 'simple') return;

        editor.replaceBlocks(editor?.document, JSON.parse(message || ""))
    }, [message, type]);

    if (error) {
        return (
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="max-w-xl mx-auto mt-24 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl text-center"
            >
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500"/>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {error.code === 'MESSAGE_NOT_FOUND' ? 'Message Not Found' : 'Error'}
                </h1>
                <p className="text-zinc-700 dark:text-zinc-300 mt-2">
                    {error.message}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="max-w-3xl mx-auto mt-24 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl"
        >
            <AnimatePresence mode="wait">
                {!isRevealed ? (
                    <motion.div
                        key="unrevealed"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="text-center"
                    >
                        <Gift className="w-16 h-16 mx-auto mb-4 text-blue-500"/>
                        <h1 className="text-2xl font-bold mb-4">You have a secret message!</h1>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            This message will self-destruct after being read.
                        </p>
                        <button
                            onClick={revealMessage}
                            disabled={isLoading}
                            className="cursor-pointer px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                        >
                            {isLoading ? (
                                "Decrypting..."
                            ) : (
                                <>
                                    <Lock size={18}/>
                                    Reveal Message
                                </>
                            )}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed"
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Secret Message</h1>
                            {!isLastView && (
                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                    <Eye size={16}/>
                                    {remainingViews} views remaining
                                </div>
                            )}
                        </div>
                        {
                            type === 'simple' ? (
                                <div
                                    className="whitespace-pre-wrap bg-zinc-100 dark:bg-zinc-800 p-6 rounded-lg text-zinc-900 dark:text-white">
                                    {message}
                                </div>
                            ) : (
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
                        <div
                            className={`p-4 rounded-lg ${isLastView ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                            <p className={`font-medium flex items-center gap-2 ${isLastView ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                <Check size={18}/>
                                {isLastView
                                    ? 'This message has been permanently deleted.'
                                    : `This message will be deleted after ${remainingViews} more view${remainingViews > 1 ? 's' : ''}.`
                                }
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}