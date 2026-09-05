import type { Metadata } from 'next';
import { PlatformProvider } from '@/components/platform-context';
import { AuthFlow } from '@/components/platform-ui';
import './globals.css';
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
