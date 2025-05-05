"use client";
import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("../components/Editor"), {
    ssr: false,
});

import React from "react";

function CompoundEditor({compoundContent, setCompoundContent}: {compoundContent: string, setCompoundContent: (content: string) => void}) {
    return <Editor compoundContent={compoundContent} setCompoundContent={setCompoundContent} />;
}

export default CompoundEditor;