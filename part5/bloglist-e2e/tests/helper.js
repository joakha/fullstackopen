const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'submit' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title' }).fill(content.title)
  await page.getByRole('textbox', { name: 'author' }).fill(content.author)
  await page.getByRole('textbox', { name: 'url' }).fill(content.url)
  await page.getByRole('button', { name: 'add' }).click()
}

export { loginWith, createBlog }