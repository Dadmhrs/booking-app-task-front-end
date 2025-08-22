// Organisms
import Layout from '@/components/organisms/layout/layout.jsx';
// Providers
import ReduxProvider from '../components/providers/ReduxProvider.jsx';
// Styles
import '../styles/globals.css';

export const metadata = {
  title: 'Booking App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inder&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-nunito bg-gray-100">
        <ReduxProvider>
          <Layout>
            <main>{children}</main>
          </Layout>
        </ReduxProvider>
      </body>
    </html>
  );
}
