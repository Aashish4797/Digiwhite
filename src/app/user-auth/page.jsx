'use client';

import { Suspense } from 'react';
import AuthPageContent from './AuthPageContent';

export default function UserAuthPage() {
  return (
    <Suspense fallback={<div>Loading authentication UI...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
