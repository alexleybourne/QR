import appleLogo from '../public/logos/apple.svg';
import facebookLogo from '../public/logos/facebook.svg';
import githubLogo from '../public/logos/github.png';
import instagramLogo from '../public/logos/instagram.png';
import twitterLogo from '../public/logos/twitter.png';
import youtubeLogo from '../public/logos/youtube.svg';

export const themes = {
  twitter: {
    fgColour: '#1D9BF0',
    match: /twitter\.com/,
    logo: twitterLogo.src,
  },
  instagram: {
    fgColour: '#BF3F8D',
    match: /instagram\.com/,
    logoPadding: 4,
    qrStyleDots: true,
    eyeRadius: 12,
    logo: instagramLogo.src,
  },
  facebook: {
    fgColour: '#0C8AF0',
    match: /facebook\.com/,
    logo: facebookLogo.src,
    logoPadding: 3,
    logoPaddingCircle: true,
  },
  gitHub: {
    match: /github\.com/,
    logo: githubLogo.src,
    logoPadding: 3,
    logoPaddingCircle: true,
  },
  youtube: {
    match: [/youtube\.com/, /youtu\.be/],
    logo: youtubeLogo.src,
    qrStyleDots: true,
    eyeColour: '#FF0000',
    logoPaddingCircle: true,
  },
  apple: {
    match: /apple\.com/,
    logo: appleLogo.src,
    logoPadding: -20,
    qrStyleDots: true,
  },
};

export const defaultThemes = {
  default: {
    bgColour: '#FFFFFF',
    fgColour: '#000000',
  },
  dark: {
    bgColour: '#000000',
    fgColour: '#FFFFFF',
  },
};
