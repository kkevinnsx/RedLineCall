import style from './styles/layout.module.css';
import { setupSocket } from '../app/lib/socket';

export const metadata = {
  title: 'RedLineCall',
  description: 'Sistema de ocorrências e denúncias da polícia',
};

if (typeof window === "undefined") {
  setupSocket(globalThis);
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={style.container}>{children}</body>
    </html>
  );
}
