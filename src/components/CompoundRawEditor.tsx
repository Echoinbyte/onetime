"use client";
import dynamic from "next/dynamic";

export const RawEditor = dynamic(() => import("../components/RawEditor"), {
    ssr: false,
});

import React from "react";

function CompoundRawEditor({compoundContent, type}: {compoundContent: string, type: 'simple' | 'compound'}) {
    return <RawEditor compoundContent={compoundContent} type={type} />;
}

export default CompoundRawEditor;