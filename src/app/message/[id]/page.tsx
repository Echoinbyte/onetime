import React from "react";
import ReadMessageClient from '@/components/ReadMessageClient';

export default async function ReadMessagePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const {id} = await params;

    return <ReadMessageClient id={id} />;
}
