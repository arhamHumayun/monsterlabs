'use client';

import { Button } from './ui/button';

export default function LimitReachInnerToast({ text, router } : { text: string, router: any }) {
  return (
    <div>
      <p className="text-sm font-normal">{text}</p>
      <Button className="mt-2" onClick={() => router.push('/plans')}>
        Upgrade
      </Button>
    </div>
  );
}
