import type { Metadata, Viewport } from 'next';
import { PlatformProvider } from '@/components/platform-context';
import { AuthFlow } from '@/components/platform-ui';
import './globals.css';
import './ios.css';
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#101012' },
  ],
};
export const metadata: Metadata = {
  title: {
    default: 'Mentorly — знайди свого репетитора',
    template: '%s · Mentorly',
  },
  description:
    'Знайди викладача, з яким навчання стає простішим. Репетитори, розумний пошук, зручний запис на заняття.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <PlatformProvider>
          {children}
          <AuthFlow />
        </PlatformProvider>
      </body>
    </html>
  );
}
