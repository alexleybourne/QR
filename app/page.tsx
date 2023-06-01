'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { QRCode } from 'react-qrcode-logo';
import githubLogo from '../public/logos/github.png';
// Logo Images
import instagramLogo from '../public/logos/instagram.png';
import twitterLogo from '../public/logos/twitter.png';

export default function Home() {
  const [input, setInput] = useState('');
  const [useTheme, setUseTheme] = useState(true);
  const [theme, setTheme] = useState(null);
  const [customLogo, setCustomLogo] = useState('');
  const [logoSize, setLogoSize] = useState(50);
  const twitterLink = 'https://twitter.com/AlexLeybourne';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    getTheme(event.target.value);
  };

  const themes = {
    twitter: {
      fgColour: '#1D9BF0',
      match: /twitter\.com/,
      logo: twitterLogo.src,
    },
    instagram: {
      fgColour: '#BF3F8D',
      match: /instagram\.com/,
      logoPadding: 4,
      qrStyle: 'dots',
      eyeRadius: 12,
      logo: instagramLogo.src,
    },
    gitHub: {
      match: /github\.com/,
      logo: githubLogo.src,
      logoPadding: 3,
      logoPaddingStyle: 'circle',
    },
  };

  const defaultThemes = {
    default: {
      bgColour: '#FFFFFF',
      fgColour: '#000000',
    },
    dark: {
      bgColour: '#000000',
      fgColour: '#FFFFFF',
    },
  };

  // if the url matches a theme, return the theme
  const getTheme = (url: string) => {
    const theme = Object.entries(themes).find(([, theme]) =>
      theme.match.test(url)
    );
    setTheme(theme ? theme[1] : defaultThemes.default);
  };

  // Return custom logo or themed logo if they exist
  const logoUrl = customLogo || theme?.logo;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex'>
        <p className='w-1/4'>Create a QR Code quickly and easily for free 🤩</p>
        <div className='left-0 flex items-end justify-center flex-col static h-auto w-auto bg-none'>
          <Image
            src='/qr-code-logo.svg'
            alt='QR Code Logo'
            width={160}
            height={24}
            priority
          />
          <a
            className='pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 opacity-60 transition duration-300 ease-in-out hover:opacity-100 mt-2'
            href={twitterLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            By Alex Leybourne
          </a>
        </div>
      </div>

      <div className="relative h-[50vh] w-full flex justify-center place-items-center before:absolute before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[200px] after:w-[400px] after:translate-x-2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-violet-700 before:dark:opacity-10 after:dark:from-violet-500 after:dark:via-[#6F3EF0] after:dark:opacity-40 before:lg:h-[360px]">
        <div className='flex flex-col items-center align-center justify-center gap-8'>
          <QRCode
            value={input.length > 1 ? input : twitterLink}
            size={200}
            logoImage={logoUrl}
            logoWidth={logoSize}
            logoHeight={logoSize}
            logoPadding={theme?.logoPadding || 0}
            logoPaddingStyle={theme?.logoPaddingStyle || 'square'} // round | square
            removeQrCodeBehindLogo={Boolean(logoUrl)}
            eyeRadius={theme?.eyeRadius || 0}
            qrStyle={theme?.qrStyle || 'squares'} // squares | dots
            ecLevel='H' // L | M | Q | H
            bgColor={theme?.bgColour || defaultThemes.default.bgColour}
            fgColor={theme?.fgColour || defaultThemes.default.fgColour}
          />
        </div>
      </div>

      <p className='flex w-[50vw] justify-center border-b border-violet-300 bg-gradient-to-b from-violet-200 pb-2 pt-2 backdrop-blur-2xl dark:border-violet-800 dark:bg-violet-800/30 dark:from-inherit static lg:rounded-xl lg:border lg:bg-violet-200 p-4 lg:dark:bg-violet-800/30'>
        &nbsp;
        <input
          value={input}
          type='text'
          spellCheck='false'
          onChange={handleInputChange}
          placeholder='Paste a link to get started'
          className='fixed left-0 top-0 flex w-full justify-center lg:static text-center text-white text-md bg-transparent border-none outline-none font-mono font-bold'
        />
      </p>

      <footer className='flex mt-20'>
        <p className='opacity-40'>Created by</p>
        <a
          className='mx-2 opacity-60 transition duration-300 hover:opacity-100'
          href={twitterLink}
          target='_blank'
        >
          Alex Leybourne
        </a>
        <p className='opacity-40'>2023.</p>
      </footer>
    </main>
  );
}
