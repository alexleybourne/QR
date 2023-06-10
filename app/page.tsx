'use client';

import './styles.scss';

import React, { ChangeEvent, useRef, useState } from 'react';
import { defaultThemes, themes } from './themes';

import Image from 'next/image';
import { QRCode } from 'react-qrcode-logo';

interface Theme {
  title?: string;
  fgColour?: string;
  match?: RegExp | RegExp[];
  logo?: string;
  logoPadding?: number;
  qrStyleDots?: boolean;
  eyeRadius?: number;
  eyeColour?: string;
  logoPaddingCircle?: boolean;
  bgColour?: string;
  quietZone?: number;
}

export default function Home() {
  const [input, setInput] = useState('');
  const [useTheme, setUseTheme] = useState(true);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [qrSize, setQrSize] = useState(300);
  const [customLogo, setCustomLogo] = useState('');
  const [useFavicon, setUseFavicon] = useState(false);
  const [favicon, setFavicon] = useState('');
  const [logoSize, setLogoSize] = useState(qrSize / 2 / 2);
  const [logoPadding, setLogoPadding] = useState(0);
  const [eyeRadius, setEyeRadius] = useState(0);
  const [eyeColour, setEyeColour] = useState('');
  const [logoPaddingCircle, setLogoPaddingCircle] = useState(false);
  const [qrStyleDots, setQrStyleDots] = useState(false);
  const [bgColour, setBgColour] = useState('');
  const [quietZone, setQuietZone] = useState(8);
  const [ecLevel, setEcLevel] = useState('M'); // L, M, Q, H - The error correction level of the QR Code
  const [showSettings, setShowSettings] = useState(false);
  const qrCanvasId = 'qr-code-canvas';
  // Social links
  const twitterLink = 'https://twitter.com/AlexLeybourne';
  const githubLink = 'https://github.com/alexleybourne/QR';

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    getTheme(event.target.value, useTheme);
    getFavicon(event.target.value);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // handle custom logo upload
  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setCustomLogo(e.target?.result as string);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const deleteLogo = () => {
    setCustomLogo('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleQrResize = (v: number) => {
    setQrSize(v);
    setLogoSize(v / 2 / 2);
  };

  const handleSmartThemeChange = () => {
    const newUseTheme = !useTheme;
    setUseTheme(newUseTheme);
    getTheme(input, newUseTheme);
  };

  // If the url matches a theme, return the theme
  // This accepts array for multiple or a single string match
  const getTheme = (url: string, useTheme: boolean) => {
    if (useTheme) {
      const theme = Object.entries(themes).find(([, theme]) =>
        Array.isArray(theme.match)
          ? theme.match.some((regex: RegExp) => regex.test(url))
          : theme.match.test(url)
      );
      setTheme(theme ? theme[1] : defaultThemes.default);
    } else {
      setTheme(defaultThemes.default);
    }
  };

  // Return custom logo or themed logo if they exist
  const logoUrl = customLogo || theme?.logo;

  const getBase64FromUrl = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const getFavicon = (url: string) => {
    const googleFavicon = `https://www.google.com/s2/favicons?domain=${url}&sz=256`;
    setFavicon(input.length > 2 ? googleFavicon : '');
    // getBase64FromUrl(googleFavicon).then(console.log);
  };

  const downloadJpg = () => {
    try {
      const canvas = document.getElementById(qrCanvasId) as HTMLCanvasElement;
      const link = document.createElement('a');

      let fileName = 'QR-Code';

      // Name the file after the theme if one is applied
      if (theme) {
        fileName = `${theme.title}-${fileName}`;
      }

      // Save as JPEG
      link.download = `${fileName}.jpeg`;
      link.href = canvas?.toDataURL('image/jpeg');

      // Trigger the download
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className='z-30 fixed w-full flex items-center justify-between font-mono text-s p-14'>
        <p className='w-1/4'>
          Create a QR Code quickly and easily for free 🤩 <br />
          Work in progress 🛠️
        </p>
        <div className='left-0 flex items-end justify-center flex-col static h-auto w-auto bg-none'>
          <Image
            src='/qr-code-logo.svg'
            alt='QR Code Logo'
            width={160}
            height={24}
            priority
          />
          <a
            className='pl-1 text-sm flex place-items-center gap-2 p-0 opacity-60 transition duration-300 ease-in-out hover:opacity-100 mt-2'
            href={twitterLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            By Alex Leybourne
          </a>
        </div>
      </nav>
      <main className='flex flex-col items-center justify-between p-10 pt-20'>
        <div className="relative h-[50vh] w-full flex justify-center place-items-center before:absolute before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[200px] after:w-[400px] after:translate-x-2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-violet-700 before:dark:opacity-10 after:dark:from-violet-500 after:dark:via-[#6F3EF0] after:dark:opacity-40 before:lg:h-[360px]">
          <div className='border-violet-800 border rounded-xl p-6 flex flex-col items-center align-center justify-center gap-8 z-20'>
            <QRCode
              id={qrCanvasId}
              value={input.length > 1 ? input : twitterLink}
              size={qrSize}
              logoImage={useFavicon ? favicon : logoUrl}
              logoWidth={logoSize}
              logoHeight={logoSize}
              logoPadding={theme?.logoPadding || logoPadding}
              logoPaddingStyle={theme?.logoPaddingCircle ? 'circle' : 'square'} // square | round
              removeQrCodeBehindLogo={true}
              eyeRadius={theme?.eyeRadius || 0}
              eyeColor={
                theme?.eyeColour ||
                theme?.fgColour ||
                defaultThemes.default.fgColour
              }
              qrStyle={theme?.qrStyleDots ? 'dots' : 'squares'} // squares | dots
              ecLevel='H' // L | M | Q | H
              bgColor={theme?.bgColour || defaultThemes.default.bgColour}
              fgColor={theme?.fgColour || defaultThemes.default.fgColour}
              quietZone={theme?.quietZone || quietZone}
            />
          </div>
        </div>
        <div className='inputs-wrapper transition-duration flex flex-col w-full justify-center'>
          <div className='w-full flex align-middle justify-center'>
            <div
              onClick={() => setShowSettings(true)}
              className={`${
                theme?.title ? 'show' : 'hide'
              } transition-duration smart-theme-notification mb-3 w-1/2 z-40 flex items-center justify-center pb-2 pt-2 px-4 mr-2 border-violet-800 backdrop-blur-2xl rounded-xl border p-4 bg-violet-800/30`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6 mr-2'
              >
                <path
                  fillRule='evenodd'
                  d='M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z'
                  clipRule='evenodd'
                />
              </svg>
              <p>{theme?.title} Smart theme applied</p>
            </div>
          </div>
          <div className='input-wrapper w-full'>
            <div className='transition-duration flex mb-3 w-full justify-center'>
              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`side-button settings-button flex justify-center pb-2 pt-2 pl-2 pr-2 mr-2 border-violet-800 backdrop-blur-2xl rounded-xl border p-4 ${
                  showSettings ? 'bg-violet-800/90' : 'bg-violet-800/30'
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className={`w-6 h-6 transition-duration ${
                    showSettings ? 'rotate' : ''
                  }`}
                >
                  <path
                    fillRule='evenodd'
                    d='M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              {/* Main URL Input */}
              <div className='flex w-full justify-center pb-2 pt-2 border-violet-800 backdrop-blur-2xl static rounded-xl border p-4 bg-violet-800/30'>
                <input
                  value={input}
                  type='text'
                  spellCheck='false'
                  onChange={handleInputChange}
                  placeholder='Paste a link to get started'
                  className='left-0 top-0 flex w-full justify-center static text-center text-white text-md bg-transparent border-none outline-none font-mono font-bold'
                />
              </div>
              {/* Save Button */}
              <button
                onClick={() => downloadJpg()}
                className='side-button save-button flex justify-center pb-2 pt-2 pl-2 pr-2 ml-2 border-violet-800 backdrop-blur-2xl static rounded-xl border p-4 bg-violet-800/30 active:bg-violet-800/90'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z'
                    clipRule='evenodd'
                  />
                  <path d='M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z' />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`settings transition-duration border-violet-300 bg-gradient-to-b from-violet-200 pb-2 pt-2 backdrop-blur-2xl dark:border-violet-800 dark:from-inherit static rounded-xl border bg-violet-200 p-4 dark:bg-violet-800/30 ${
              showSettings ? 'show' : 'hide'
            }`}
          >
            <div className='flex items-center justify-between my-2'>
              <label className='font-bold w-1/2'>Use Smart Themes:</label>
              <input
                type='checkbox'
                checked={useTheme}
                onChange={() => handleSmartThemeChange()}
                className='focus:ring-purple-500 h-4 w-4 text-purple-600 border-violet-800 rounded'
              />
            </div>

            <div className='flex items-center justify-between my-2'>
              <label htmlFor='logo-size' className='font-bold w-1/2'>
                QR Code Size:
              </label>
              <span className='mr-2'>{qrSize}px</span>
              <span>0px</span>
              <input
                id='qr-size'
                type='range'
                min='0'
                max='1000'
                value={qrSize}
                onChange={(event) => handleQrResize(Number(event.target.value))}
                className='w-full mx-2 h-5 bg-violet-800/30 outline-none appearance-none border-2 border-purple-800 rounded-full cursor-pointer focus:border-purple-500'
              />
              <span>1000px</span>
            </div>

            <div className='flex items-center justify-between my-2'>
              <label htmlFor='logo-size' className='font-bold w-1/2'>
                Logo Size:
              </label>
              <span className='mr-2'>{logoSize}px</span>
              <span>0px</span>
              <input
                id='logo-size'
                type='range'
                min='0'
                max={qrSize / 2}
                value={logoSize}
                onChange={(event) => setLogoSize(Number(event.target.value))}
                className='w-full mx-2 h-5 bg-violet-800/30 outline-none appearance-none border-2 border-purple-800 rounded-full cursor-pointer focus:border-purple-500'
              />
              <span>{qrSize / 2}px</span>
            </div>

            <div className='flex items-center justify-between my-2'>
              <label htmlFor='logo-padding' className='font-bold w-1/2'>
                Logo Padding:
              </label>
              <span className='mr-2'>{logoPadding}px</span>
              <span>-50px</span>
              <input
                id='logo-padding'
                type='range'
                min='-50'
                max={qrSize / 2}
                value={logoPadding}
                onChange={(event) => setLogoPadding(Number(event.target.value))}
                className='w-full mx-2 h-5 bg-violet-800/30 outline-none appearance-none border-2 border-purple-800 rounded-full cursor-pointer focus:border-purple-500'
              />
              <span>{qrSize / 2}px</span>
            </div>

            <div className='flex items-center justify-between my-2'>
              <label className='font-bold w-1/2'>Favicon Image:</label>
              {favicon ? (
                <img
                  src={favicon}
                  alt='favicon'
                  className='w-16 h-16 mr-[30%]'
                />
              ) : (
                <p>none found</p>
              )}
              <label htmlFor='favicon' className='font-bold w-1/2'>
                Use Favicon?:
              </label>
              <input
                id='favicon'
                type='checkbox'
                checked={useFavicon}
                onChange={() => setUseFavicon(!useFavicon)}
                className='focus:ring-purple-500 h-4 w-4 text-purple-600 border-violet-800 rounded'
              />
            </div>

            <div className='flex items-center justify-between my-2'>
              <label className='font-bold w-1/2'>Logo Image:</label>
              <input
                type='file'
                accept='image/*'
                onChange={handleLogoUpload}
                ref={fileInputRef}
                className='w-full p-2 border-2 border-violet-800 focus:border-white rounded'
              />
              <button onClick={() => deleteLogo()}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-6 h-6 ml-3'
                >
                  <path
                    fill-rule='evenodd'
                    d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
                    clip-rule='evenodd'
                  />
                </svg>
              </button>
            </div>

            <div className='flex items-center justify-between my-2'>
              <label htmlFor='logo-padding' className='font-bold w-1/2'>
                Quiet Zone:
              </label>
              <span className='mr-2'>{quietZone}px</span>
              <span>0px</span>
              <input
                id='logo-padding'
                type='range'
                min='0'
                max={qrSize / 2}
                value={quietZone}
                onChange={(event) => setQuietZone(Number(event.target.value))}
                className='w-full mx-2 h-5 bg-violet-800/30 outline-none appearance-none border-2 border-purple-800 rounded-full cursor-pointer focus:border-purple-500'
              />
              <span>{qrSize / 2}px</span>
            </div>
          </div>
        </div>
      </main>
      <footer className='w-full flex align-center justify-center flex-col mt-10 mb-4'>
        <span className='flex align-center justify-center'>
          <p className='opacity-40'>Created by</p>
          <a
            className='mx-2 opacity-60 transition duration-300 hover:opacity-100'
            href={twitterLink}
            target='_blank'
          >
            Alex Leybourne
          </a>
          <p className='opacity-40'>2023</p>
        </span>
        <span className='flex align-center justify-center m-2'>
          <a
            className='mx-2 flex opacity-60 transition duration-300 hover:opacity-100'
            href={githubLink}
            target='_blank'
          >
            <Image
              className='invert mr-1'
              src='/github.svg'
              alt='Github Logo'
              width={16}
              height={16}
            />
            GitHub Repo
          </a>
        </span>
      </footer>
    </>
  );
}
