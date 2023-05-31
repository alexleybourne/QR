'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { QRCode } from 'react-qrcode-logo';

export default function Home() {
  const [input, setInput] = useState('');
  const twitterLink = 'https://twitter.com/AlexLeybourne';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
        <p className='w-1/4'>Create a QR Code quickly and easily for free 🤩</p>
        <div className='fixed bottom-0 left-0 flex h-48 w-full items-end justify-center flex-col bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none'>
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
          <QRCode value={input.length > 1 ? input : twitterLink} size={200} />
        </div>
      </div>

      <p className='fixed left-0 top-0 flex w-[50vw] justify-center border-b border-violet-300 bg-gradient-to-b from-violet-200 pb-2 pt-2 backdrop-blur-2xl dark:border-violet-800 dark:bg-violet-800/30 dark:from-inherit lg:static lg:rounded-xl lg:border lg:bg-violet-200 p-4 lg:dark:bg-violet-800/30'>
        &nbsp;
        <input
          value={input}
          onChange={handleInputChange}
          placeholder='Paste a link to get started'
          className='fixed left-0 top-0 flex w-full justify-center lg:static text-center text-white text-md bg-transparent border-none outline-none font-mono font-bold'
        />
      </p>

      <footer className='flex mt-20'>
        <p className='opacity-40'>Created</p>
        <a
          className='mx-2 opacity-60 transition duration-300 hover:opacity-100'
          href={twitterLink}
          target='_blank'
        >
          Alex Leybourne
        </a>{' '}
        <p className='opacity-40'>2022.</p>
      </footer>
    </main>
  );
}
