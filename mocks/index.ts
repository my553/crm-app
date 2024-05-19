import { faker } from "@faker-js/faker"
import { LiveStorage } from "@mswjs/storage"
import { http, HttpResponse } from "msw"
import { setupWorker } from "msw/browser"

interface User {
  id: string
  password: string
  email: string
}

interface UserDto extends Omit<User, "id"> {}

const usersStorage = new LiveStorage<User[]>("users", [])

const codeStorage = new LiveStorage<string>("code", "")

export const worker = setupWorker(
  http.post("/register", async ({ request }) => {
    const body = (await request.json()) as UserDto

    const candidate = usersStorage
      .getValue()
      .find(({ email }) => body.email === email)

    if (!candidate) {
      usersStorage.update((users) => {
        return users.concat([{ ...body, id: faker.string.uuid() }])
      })

      return HttpResponse.json({
        status: 200,
      })
    } else {
      return new HttpResponse("User already exists", { status: 409 })
    }
  }),
  http.post("/login", async ({ request }) => {
    const body = (await request.json()) as UserDto

    const candidate = usersStorage
      .getValue()
      .find(({ email }) => body.email === email)

    if (candidate && body.password === candidate.password) {
      return HttpResponse.json({
        status: 200,
      })
    } else {
      return new HttpResponse("Forbidden", { status: 403 })
    }
  }),
  http.get("/send-code", async ({ request }) => {
    const email = new URL(request.url).searchParams.get("email") as string

    const candidate = usersStorage
      .getValue()
      .find((candidate) => candidate.email === email)

    if (candidate) {
      const code = faker.string.numeric({ length: 6 })

      return HttpResponse.json({
        status: 200,
        data: {
          code,
        },
      })
    } else {
      return new HttpResponse("Not found", { status: 404 })
    }
  }),
  http.get("/verify-code", async ({ request }) => {
    const url = new URL(request.url)
    const email = url.searchParams.get("email") as string
    const code = url.searchParams.get("code") as string

    const candidate = usersStorage
      .getValue()
      .find((candidate) => candidate.email === email)

    if (candidate && code === codeStorage.getValue()) {
      return HttpResponse.json({
        status: 200,
      })
    } else {
      return new HttpResponse("Wrong code", { status: 401 })
    }
  }),
  http.get("/change-password", async ({ request }) => {
    const { email, newPassword } = (await request.json()) as {
      newPassword: string
      email: string
    }

    const candidate = usersStorage
      .getValue()
      .find((candidate) => candidate.email === email)

    if (candidate) {
      usersStorage.update((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email
            ? {
                ...user,
                password: newPassword,
              }
            : user,
        ),
      )

      return HttpResponse.json({
        status: 200,
      })
    } else {
      return new HttpResponse("Wrong code", { status: 401 })
    }
  }),
)
