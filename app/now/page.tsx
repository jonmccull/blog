import fs from 'fs'
import path from 'path'
import { CustomMDX } from '../components/mdx'

export const metadata = {
  title: 'Now',
  description: 'What I am focused on right now.',
}

export default function NowPage() {
  const nowPath = path.join(process.cwd(), 'content', 'now.mdx')
  const content = fs.readFileSync(nowPath, 'utf-8')

  return (
    <article className="prose body max-w-none">
      <CustomMDX source={content} />
    </article>
  )
}
