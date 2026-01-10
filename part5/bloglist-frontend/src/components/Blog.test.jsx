import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from "./Blog"
import BlogForm from './BlogForm'

const testBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    user: {
        name: 'John'
    }
}

test('renders blog title and author', () => {
    render(
        <Blog
            blog={testBlog}
            user={null}
        />
    )

    const element = screen.getByText(`${testBlog.title} by ${testBlog.author}`)
    expect(element).toBeDefined()
})

test('renders blog url, likes and user', async () => {
    render(
        <Blog
            blog={testBlog}
            user={null}
        />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText(testBlog.url)
    const likes = screen.getByText(`likes: ${testBlog.likes}`)
    const userWhoAddedBlog = screen.getByText(testBlog.user.name)

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(userWhoAddedBlog).toBeDefined()
})

test('blog like button is called correctly', async () => {
    const mockHandler = vi.fn()

    render(
        <Blog
            blog={testBlog}
            user={null}
            updateBlogLikes={mockHandler}
        />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog form data is passed correctly', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(
        <BlogForm createBlog={createBlog} />
    )

    const titleField = screen.getByPlaceholderText("title");
    await user.type(titleField, testBlog.title)
    const authorField = screen.getByPlaceholderText("author");
    await user.type(authorField, testBlog.author)
    const urlField = screen.getByPlaceholderText("url");
    await user.type(urlField, testBlog.url)
    const submitButton = screen.getByText("add")
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual({
        title: testBlog.title,
        author: testBlog.author,
        url: testBlog.url
    })
})