"use client";

import { Suspense } from 'react';
import Info from '@/components/Info';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Info/>
        </Suspense>
    );
}