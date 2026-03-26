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
    <article className="prose prose-neutral dark:prose-invert max-w-2xl mx-auto pr-2 md:pr-0">
      <CustomMDX source={content} />
    </article>
  )
}
