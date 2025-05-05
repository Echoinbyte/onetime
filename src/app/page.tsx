'use client';

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import {useState} from 'react';
import {createMessage} from '@/app/actions';
import {motion, AnimatePresence} from 'framer-motion';
import {AlertCircle, Check, CopyIcon, Loader2, Lock, Timer, Users} from 'lucide-react';
import confetti from 'canvas-confetti';
import {AppError} from "@/lib/errors";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CompoundEditor from "@/components/CompoundEditor";

interface ErrorState {
    message: string;
    field?: string;
}


export default function MessageForm() {
    const [simpleContent, setContent] = useState('');
    const [compoundContent, setCompoundContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageId, setMessageId] = useState<string | null>(null);
    const [error, setError] = useState<ErrorState | null>(null);
    const [copied, setCopied] = useState(false);
    const [expiryHours, setExpiryHours] = useState(24);
    const [viewLimit, setViewLimit] = useState(1);
    const [type, setType] = useState<'simple' | 'compound'>('simple');

    const validateForm = (): boolean => {
        if (type === 'simple' ? !simpleContent.trim() : !compoundContent.trim()) {
            setError({message: 'Message cannot be empty', field: 'content'});
            return false;
        }

        if (expiryHours < 1 || expiryHours > 168) {
            setError({message: 'Expiry time must be between 1 and 168 hours', field: 'expiry'});
            return false;
        }

        if (viewLimit < 1 || viewLimit > 10) {
            setError({message: 'View limit must be between 1 and 10 views', field: 'viewLimit'});
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const id = await createMessage({
                content: type === "simple" ? simpleContent.trim() : compoundContent.trim(),
                expireAt: expiryHours,
                viewLimit: viewLimit,
                type: type,
            });

            if (!id) {
                throw new Error('Failed to create message');
            }

            setMessageId(id);
            queueMicrotask(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: {y: 0.6}
                })
            })
        } catch (err) {
            const error = err as AppError;
            setError({
                message: error.message || 'Something went wrong. Please try again.',
                field: 'submit'
            });
        } finally {
            setIsLoading(false);
        }
    };

        const link = `${process.env.NEXT_PUBLIC_ORIGIN || "http://localhost:3000"}/message/${messageId}`;

        return (
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                className="max-w-3xl mx-auto mt-24 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl"
            >
                <h1 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-violet-500 text-transparent bg-clip-text">
                    Send a One-Time Secret
                </h1>

                <AnimatePresence mode="wait">
                    {!messageId ? (
                        <motion.div
                            key="form"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                        >
                            <div className="space-y-4">
                                <Tabs onValueChange={(value) => setType(value as 'simple' | 'compound')}
                                      defaultValue="simple" className={"w-full"}>
                                    <TabsList>
                                        <TabsTrigger className={"cursor-pointer"} value="simple">Simple</TabsTrigger>
                                        <TabsTrigger className={"cursor-pointer"} value="compound">Compound</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="simple">
                                    <textarea
                                        className={`w-full h-40 p-4 rounded-lg border transition-all
                                        ${error?.field === 'content'
                                                                            ? 'border-red-500 ring-2 ring-red-500'
                                                                            : 'border-zinc-300 dark:border-zinc-700'}
                                        bg-zinc-100 dark:bg-zinc-800`}
                                        placeholder="Enter your secret message..."
                                        value={simpleContent}
                                        onChange={(e) => {
                                            setContent(e.target.value);
                                            if (error?.field === 'content') setError(null);
                                        }}
                                        aria-label="Secret message"
                                        aria-invalid={error?.field === 'content'}
                                        aria-describedby={error?.field === 'content' ? 'content-error' : undefined}
                                    />
                                    </TabsContent>
                                    <TabsContent value="compound">
                                        <CompoundEditor compoundContent={compoundContent} setCompoundContent={setCompoundContent} />
                                    </TabsContent>
                                </Tabs>


                                {error?.field === 'content' && (
                                    <p id="content-error" className="text-red-500 text-sm -mt-2">{error.message}</p>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <label
                                            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                            <Timer size={16}/>
                                            Expire after (hours)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="168"
                                            value={expiryHours}
                                            onChange={(e) => setExpiryHours(Number(e.target.value))}
                                            className={`w-full p-2 rounded-lg border ${error?.field === 'expiry'
                                                ? 'border-red-500 ring-2 ring-red-500'
                                                : 'border-zinc-300 dark:border-zinc-700'} border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800`}
                                            aria-label="Expiry time in hours"
                                            aria-invalid={error?.field === 'expiry'}
                                            aria-describedby={error?.field === 'expiry' ? 'expiry-error' : undefined}
                                        />
                                        {error?.field === 'expiry' && (
                                            <div id="expiry-error" className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                                    <AlertCircle size={16}/>
                                                    {error.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <label
                                            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                            <Users size={16}/>
                                            View limit
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={viewLimit}
                                            onChange={(e) => setViewLimit(Number(e.target.value))}
                                            className={`w-full p-2 rounded-lg border  ${error?.field === 'viewLimit'
                                                ? 'border-red-500 ring-2 ring-red-500'
                                                : 'border-zinc-300 dark:border-zinc-700'} border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800`}
                                            aria-label="View limit"
                                            aria-invalid={error?.field === 'viewLimit'}
                                            aria-describedby={error?.field === 'viewLimit' ? 'viewLimit-error' : undefined}
                                        />
                                        {error?.field === 'viewLimit' && (
                                            <div id="viewLimit-error" className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                                    <AlertCircle size={16}/>
                                                    {error.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="cursor-pointer w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                    aria-label="Secure message"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin"/>
                                    ) : (
                                        <>
                                            <Lock size={18}/>
                                            Secure Message
                                        </>
                                    )}
                                </button>
                                {error?.field === 'submit' && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                        <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                                            <AlertCircle size={16}/>
                                            {error.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            className="space-y-4"
                        >
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                                    <Check size={18}/>
                                    Message secured successfully!
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={link}
                                    readOnly
                                    className="flex-1 p-3 rounded-lg border bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                                />
                                <button
                                    className="cursor-pointer p-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(link).then(() => setCopied(true));
                                    }}
                                >
                                    {copied ? <Check size={18}/> : <CopyIcon size={18}/>}
                                </button>
                            </div>

                            <button
                                onClick={() => {
                                    setMessageId(null);
                                    setContent('');
                                    setCompoundContent('');
                                    setExpiryHours(24);
                                    setViewLimit(1);
                                    setType('simple');
                                    setCopied(false);
                                    setError(null);
                                    setIsLoading(false);
                                }}
                                className="cursor-pointer w-full py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Create Another Message
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }