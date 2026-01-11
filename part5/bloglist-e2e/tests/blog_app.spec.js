const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

const content = {
    title: `my test blog ${Date.now()}`,
    author: `me ${Date.now()}`,
    url: "kk"
}

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'test tester',
                username: 'testguy',
                password: 'salainen'
            }
        })

        await request.post('/api/users', {
            data: {
                name: 'test tester2',
                username: 'testguy2',
                password: 'salainen2'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click();
        await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'submit' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'cancel' })).toBeVisible();
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, "testguy", "salainen")
            await expect(page.getByText("login successful")).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, "testguy", "wrong password")
            await expect(page.getByText("wrong credentials")).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, "testguy", "salainen")
        })

        test('a new blog can be created', async ({ page }) => {


            await createBlog(page, content)
            await expect(page.getByText(`Added ${content.title}`)).toBeVisible()
            await expect(page.getByText(`${content.title} by ${content.author}`)).toBeVisible()
        })

        describe("After a blog is created", () => {
            beforeEach(async ({ page }) => {
                console.log("hello")
                await createBlog(page, content)
            })

            test("blog can be liked", async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                await expect(page.getByText("Likes: 0")).toBeVisible()
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText("Likes: 1")).toBeVisible()
                await expect(page.getByText(`Updated likes for ${content.title}`)).toBeVisible()
            })

            test("user can delete their blog", async ({ page }) => {
                page.on("dialog", async (dialog) => {
                    expect(dialog.type()).toBe("confirm");
                    expect(dialog.message()).toContain(`Do you want to delete ${content.title} by ${content.author}?`);
                    await dialog.accept();
                });

                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'remove' }).click()
                await expect(page.getByText(`Deleted ${content.title}`)).toBeVisible()
            })

            test("only user who added blog sees the delete button", async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
                await page.getByRole('button', { name: 'logout' }).click()
                await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0);
                await loginWith(page, "testguy2", "salainen2")
                await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0);
                await page.getByRole('button', { name: 'logout' }).click()
                await loginWith(page, "testguy", "salainen")
                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
            })
        })
    })
})

