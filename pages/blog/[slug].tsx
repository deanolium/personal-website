import matter from 'gray-matter'
import glob from 'glob'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

type PropsType = {
  frontmatter: { [key: string]: any }
  markdownBody: string
}

interface Params extends ParsedUrlQuery {
  slug: string
}

const BlogTemplate = (props: PropsType) => {
  return (
    <article>
      <h1>{props.frontmatter.title}</h1>
      <div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {props.markdownBody}
        </ReactMarkdown>
      </div>
    </article>
  )
}

export default BlogTemplate

export const getStaticProps: GetStaticProps<PropsType, Params> = async (
  context
) => {
  const { slug } = context.params!
  const content = await import(`./posts/${slug}.md`)
  const data = matter(content.default)

  return {
    props: {
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  const blogs = glob.sync('pages/blog/posts/**/*.md')

  const blogSlugs: string[] = blogs.map((file: string) =>
    file.split('/')[3].replace(/ /g, '-').slice(0, -3).trim()
  )

  const paths = blogSlugs.map((slug) => `/blog/${slug}`)

  return {
    paths,
    fallback: false,
  }
}
