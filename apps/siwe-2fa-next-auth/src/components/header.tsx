import { Suspense } from 'react';

import Link from 'next/link';

import { Button } from '@repo/ui/button';

import { AccountButton } from './account-button';

export const Header: React.FC = () => {
  return (
    <header className="flex w-full justify-between gap-5 p-5">
      <div className="flex gap-5">
        <Button variant="link" size="sm" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="/me">Me</Link>
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
      <div className="flex justify-end">
        <Suspense>
          <AccountButton />
        </Suspense>
      </div>
    </header>
  );
};
