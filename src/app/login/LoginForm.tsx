'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-rp-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-rp-red-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Iniciando sesión…' : 'Iniciar sesión'}
    </button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null)

  return (
    <div className="min-h-screen bg-rp-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-rp-gray-200 p-8 w-full max-w-sm">
        <h1 className="font-display text-3xl text-rp-red text-center tracking-wide mb-8">
          RIVERPAR
        </h1>
        <form action={formAction} className="flex flex-col gap-5">
          {state?.error && (
            <p className="text-sm text-rp-red bg-rp-red-light border border-rp-red/20 rounded-lg px-4 py-3">
              {state.error}
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-rp-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-rp-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rp-red/20 focus:border-rp-red transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-rp-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-rp-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rp-red/20 focus:border-rp-red transition-colors"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
