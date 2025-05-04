import { readMessage } from '@/app/actions';
import React from "react";

interface Props {
    params: { id: string };
}

export default async function ReadMessagePage({ params }: Props) {
    const { id } = await params;
    const message = await readMessage(id);

    if (!message) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl text-center">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Message Not Found</h1>
                <p className="text-zinc-700 dark:text-zinc-300 mt-2">It may have already been read or the link is invalid.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">One-Time Message</h1>
            <p className="whitespace-pre-wrap bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg text-zinc-900 dark:text-white">
                {message}
            </p>
            <p className="mt-4 text-green-600 dark:text-green-400 font-medium">This message has now been deleted forever.</p>
        </div>
    );
}
