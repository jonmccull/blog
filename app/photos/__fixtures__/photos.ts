import type { StaticImageData } from 'next/image'
import type { Photo } from '../photos'

// Shared by the photos unit tests. Not under __tests__, so Jest doesn't run it as a suite.

export const image = (src: string, width = 2048, height = 1365): StaticImageData => ({
  src,
  width,
  height,
  blurDataURL: 'data:image/webp;base64,UklGRg==',
})

export const photos: Photo[] = [
  {
    image: image('/a.webp'),
    alt: 'A red guitar',
    camera: 'Fujifilm X100VI',
    settings: '23mm · f/8 · 1/34 s · ISO 640',
    location: 'MusikkHuset, Haugesund',
    date: '2026-10-30',
  },
  {
    image: image('/b.webp'),
    alt: 'Church windows',
    camera: 'Praktica MTL5B',
    film: 'HP5',
    location: 'Haugesund',
  },
]

// jsdom has no modal dialogs; these stand in for showModal and close, firing close like a browser does
export function fakeDialogs() {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
