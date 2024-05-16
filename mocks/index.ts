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
  http.get("/verify-email/:email", async ({ params }) => {
    const { email } = params as { email: string }

    const candidate = usersStorage
      .getValue()
      .find((candidate) => candidate.email === email)

    if (candidate) {
      return HttpResponse.json({
        status: 200,
        data: {
          code: faker.string.numeric({ length: 6 }),
        },
      })
    } else {
      return new HttpResponse("Not found", { status: 404 })
    }
  }),
)
