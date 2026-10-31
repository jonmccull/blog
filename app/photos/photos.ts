import type { StaticImageData } from 'next/image'
import firebirdOnTheBench from '@/public/images/photos/firebird-on-the-bench.webp'
import churchWindows from '@/public/images/photos/church-windows.webp'
import photo20261028 from '@/public/images/photos/photo-2026-10-28.webp'

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
    image: photo20261028,
    alt: 'A wire fence on posts crosses rough yellow grass towards a grey sea breaking on a rocky shore under low cloud; a Norwegian flag flies from a tall pole beside a railed tarmac path on the right.',
    camera: 'Fujifilm X100VI',
    settings: '23mm · f/10 · 1/42 s · ISO 500',
    location: 'Haugesund, Norway',
    date: '2026-10-28',
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
