import style from './styles/layout.module.css'

export const metadata = {
  title: 'RedLineCall',
  description: 'Sistema de ocorrências e denúncias da policia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={style.container}>{children}</body>
    </html>
  );
}
