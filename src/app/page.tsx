// app/page.tsx
'use client';

import {useEffect, useState} from 'react';
import {createMessage} from '@/app/actions';
import {Check, CopyIcon, Loader2} from 'lucide-react';

export default function MessageForm() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageId, setMessageId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [copied])

    const handleSubmit = async () => {
        if (!content.trim()) return setError('Message cannot be empty');
        setIsLoading(true);
        setError('');

        try {
            const id = await createMessage(content);
            setMessageId(id);
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const link = `${process.env.ORIGIN || "http://localhost:3000"}/message/${messageId}`;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">Send a One-Time Secret</h1>
            {!messageId ? (
                <>
          <textarea
              className="w-full h-40 p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
              placeholder="Enter your secret message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
          />
                    {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        className="mt-4 w-full bg-black text-white py-2 rounded-lg flex items-center justify-center cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin"/> : 'Generate One-Time Link'}
                    </button>
                </>
            ) : (
                <div className="space-y-2">
                    <p className="text-green-600 dark:text-green-400 font-medium">Success! Share this link:</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={link}
                            readOnly
                            className="flex-1 p-2 rounded-lg border bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                        />
                        <button
                            className="cursor-pointer p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 flex flex-row items-center justify-center gap-2"
                            onClick={() => {
                                navigator.clipboard.writeText(link).then(() => setCopied(true))
                            }}
                        >
                            {
                                copied ? (
                                    <>
                                        <Check size={18}/>
                                    </>
                                ) : (
                                    <>
                                        <CopyIcon size={18}/>
                                    </>
                                )
                            }
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}