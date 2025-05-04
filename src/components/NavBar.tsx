'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function NavBar() {
  const [messageId, setMessageId] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = messageId.replace(/.*message\//, '').trim();
    if (cleanId) {
      router.push(`/message/${cleanId}`);
      setMessageId('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="backdrop-blur-sm bg-white/30 dark:bg-zinc-900/30 fixed w-full top-0 z-50 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/onetime-light.svg" alt="OneTime" width={32} height={32} />
            <span className="font-semibold text-xl">OneTime</span>
          </Link>

          <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
            <input
              type="text"
              value={messageId}
              onChange={(e) => setMessageId(e.target.value)}
              placeholder="Enter message ID or full link..."
              className="w-full px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </form>

          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90 transition-opacity"
          >
            Create Message
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}