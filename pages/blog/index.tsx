import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

export default function Index(props) {
  function truncateSummmary(content: string) {
    return content.slice(0, 100).trimEnd()
  }

  return (
    <section>
      <h1>Blog Articles</h1>
      {props.allBlogs.map((blog) => (
        <Link
          key={blog.slug}
          href={{ pathname: `./blog/${blog.slug}` }}
          passHref={true}
        >
          <a>
            <h2>{blog.frontmatter.title}</h2>
            <h3>{blog.frontmatter.date}</h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {truncateSummmary(blog.markdownBody) + '...'}
            </ReactMarkdown>
          </a>
        </Link>
      ))}
    </section>
  )
}

export async function getStaticProps() {
  const posts = ((context) => {
    const keys = context.keys()
    const values: any[] = keys.map(context)

    const postData = keys.map((key, index) => {
      const slug = key
        .replace(/^.*[\\\/]/, '')
        .split('.')
        .slice(0, -1)
        .join('.')

      const value = values[index]

      const document = matter(value.default)

      return {
        frontmatter: document.data,
        markdownBody: document.content,
        slug,
      }
    })

    return postData
  })(require.context('./posts', true, /\.md$/))

  return {
    props: {
      allBlogs: posts,
    },
  }
}
