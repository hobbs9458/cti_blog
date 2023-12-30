import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './globals.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Akshar } from 'next/font/google';
const akshar = Akshar({ subsets: ['latin'] });

export const metadata = {
  title: 'Cutting Tools Inc.',
  description:
    'Cutting Tools Inc. is the premier distributor and machine solutions provider for the Automotive, Aerospace, Defense, Energy, Firearms, and Medical manufacturing industries.',
  additionalMetaTags: [
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={akshar.className}>
        <Navbar />
        <div className='childrenHeight'>{children}</div>
        <ToastContainer />
        <Footer />
      </body>
    </html>
  );
}
