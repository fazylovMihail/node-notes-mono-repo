import {
  AuthUser,
  PostAuthUser,
  PostAuthUserSchema,
  UserName,
} from "@shared/models/User";

async function fetchUser(): Promise<UserName> {
  try {
    const response = await fetch("/api/auth/me", { method: "GET" });
    if (!response.ok) {
      throw new Error("Ошибка получение пользователя.");
    }

    return await response.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function fetchUserLogin({
  username,
  password,
}: AuthUser): Promise<PostAuthUser> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Ошибка авторизации.");
    }

    const data: unknown = await response.json();

    return PostAuthUserSchema.parse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function fetchUserRegister({
  username,
  password,
}: AuthUser): Promise<PostAuthUser> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Ошибка регистрации.");
    }

    const data: unknown = await response.json();

    return PostAuthUserSchema.parse(data);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function fetchUserLogout(): Promise<void> {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      throw new Error("Ошибка выхода из аккаунта.");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { fetchUser, fetchUserLogin, fetchUserRegister, fetchUserLogout };
