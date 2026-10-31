import type { StaticImageData } from 'next/image'
import firebirdOnTheBench from '@/public/images/photos/firebird-on-the-bench.webp'
import churchWindows from '@/public/images/photos/church-windows.webp'
import dscf0901 from '@/public/images/photos/dscf0901.webp'

// The Photos page shows this list, in this order (newest first, by hand). Each image is a static
// import from public/images/photos/, so its width and height are known at build time and a missing
// file fails the build. Prepare a file with `node scripts/photo-prep.mjs <original>` first.

export type Photo = {
  image: StaticImageData
  /** What is in the picture, for people who cannot see it. Not shown. */
  alt: string
  camera: string
  lens?: string
  /** Exposure, as the camera reports it: '23mm · f/8 · 1/34 s · ISO 640' */
  settings?: string
  /** Film stock, for film. Digital photos leave it out. */
  film?: string
  location: string
  /** ISO date, shown as month and year */
  date?: string
}

export const photos: Photo[] = [
  {
    image: dscf0901,
    alt: '',
    camera: 'Fujifilm X100VI',
    lens: 'XF23mmF2',
    settings: '23mm · f/5.6 · 1/250 s · ISO 320',
    location: 'Haugesund, the harbour',
    date: '2026-10-31',
  },
  {
    image: firebirdOnTheBench,
    alt: 'A red Gibson Firebird on a workbench mat, its white pickguard and chrome bridge catching the light from a window behind it.',
    camera: 'Fujifilm X100VI',
    settings: '23mm · f/8 · 1/34 s · ISO 640',
    location: 'MusikkHuset, Haugesund',
    date: '2026-10-30',
  },
  {
    image: churchWindows,
    alt: 'Three arched, leaded windows in a white wooden church wall, lit warm by a low sun under a pale blue sky.',
    camera: 'Fujifilm X100VI',
    settings: '23mm · f/16 · 1/52 s · ISO 500',
    location: 'Haugesund',
    date: '2026-10-29',
  },
]
