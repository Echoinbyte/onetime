'use server';

import {nanoid} from 'nanoid';
import connectDB from '@/lib/db';
import {Message} from '@/models/Message';
import {encryptMessage, decryptMessage} from '@/lib/crypto';
import {AppError, ErrorCodes} from '@/lib/errors';

interface CreateMessageOptions {
    content: string;
    expireAt?: number;
    viewLimit?: number;
    type?: 'simple' | 'compound';
}

interface MessageResponse {
    content: string;
    remainingViews: number;
    isLastView: boolean;
    type: 'simple' | 'compound';
}

export async function createMessage({
    content,
    expireAt = 24,
    viewLimit = 1,
    type = 'simple'
}: CreateMessageOptions): Promise<string> {

    if (!content?.trim()) {
        throw new AppError(
            400,
            'Message content is required',
            ErrorCodes.INVALID_INPUT
        );
    }

    if (viewLimit < 1 || viewLimit > 10) {
        throw new AppError(
            400,
            'View limit must be between 1 and 10',
            ErrorCodes.INVALID_VIEW_LIMIT
        );
    }

    try {
        await connectDB();
        const id = nanoid();
        const encrypted = await encryptMessage(content);

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expireAt);

        const message = await Message.create({
            id,
            content: encrypted,
            type,
            expiresAt,
            viewLimit,
            viewCount: 0,
            isActive: true
        });

        return message.id;
    } catch (error) {
        console.error('Error creating message:', error);
        throw new AppError(
            500,
            'Failed to create message',
            ErrorCodes.DATABASE_ERROR
        );
    }
}

export async function readMessage(id: string): Promise<MessageResponse> {
    if (!id?.trim()) {
        throw new AppError(
            400,
            'Message ID is required',
            ErrorCodes.INVALID_INPUT
        );
    }

    try {
        await connectDB();
        const message = await Message.findOne({id});

        if (!message) {
            return Promise.reject(new AppError(
                500,
                'Looks like this message has been expired',
                ErrorCodes.MESSAGE_NOT_FOUND
            ));;
        }

        // Update message state
        message.viewCount += 1;
        const isLastView = message.viewCount >= message.viewLimit;
        message.isActive = !isLastView;
        await message.save();

        // Decrypt content
        let decrypted: string;
        try {
            decrypted = await decryptMessage(message.content);
        } catch {
            return Promise.reject(new AppError(
                500,
                'Failed to decrypt message',
                ErrorCodes.ENCRYPTION_ERROR
            ));
        }

        // Handle message deletion asynchronously
        if (isLastView) {
            // Fire and forget deletion
            void Message.deleteOne({id})
                .catch(error => console.error('Error deleting message:', error));
        }

        // Return response
        return {
            content: decrypted,
            remainingViews: Math.max(0, message.viewLimit - message.viewCount),
            isLastView,
            type: message.type
        };
    } catch (error) {
        console.error('Error reading message:', error);
        // Only re-throw AppErrors, wrap others in DATABASE_ERROR
        return Promise.reject(
            error instanceof AppError
                ? error
                : new AppError(
                    500,
                    'Failed to read message',
                    ErrorCodes.DATABASE_ERROR
                )
        );
    }
}

export async function cleanupExpiredMessages(): Promise<number> {
    try {
        await connectDB();
        const result = await Message.deleteMany({
            $or: [
                {expiresAt: {$lt: new Date()}},
                {isActive: false}
            ]
        });
        return result.deletedCount;
    } catch (error) {
        console.error('Error cleaning up messages:', error);
        throw new AppError(
            500,
            'Failed to cleanup messages',
            ErrorCodes.DATABASE_ERROR
        );
    }
}