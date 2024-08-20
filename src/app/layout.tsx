/* Components */
import { type JSX } from 'react';
import { Providers } from '@/lib/providers';
import ClientProviders from './ClientProviders';

/* Instruments */
import './globals.css';

export default function RootLayout(
  props: React.PropsWithChildren,
): JSX.Element {
  return (
    <Providers>
      <html lang="en">
        <body>
          <ClientProviders>{props.children}</ClientProviders>
        </body>
      </html>
    </Providers>
  );
}
