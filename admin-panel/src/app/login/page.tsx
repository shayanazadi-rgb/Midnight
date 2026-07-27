"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      setToken(data.token);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5">
        <div>
          <p className="text-sm tracking-[0.3em] text-plum/50 uppercase">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-plum">ورود به پنل</h1>
          <p className="mt-2 text-sm text-plum/65">Midnight Shop — مدیریت محتوا</p>
        </div>

        <label className="block space-y-2 text-sm">
          <span>نام کاربری</span>
          <input
            className="field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>رمز عبور</span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <button className="btn btn-primary w-full" disabled={loading} type="submit">
          {loading ? "در حال ورود…" : "ورود"}
        </button>
      </form>
    </div>
  );
}
