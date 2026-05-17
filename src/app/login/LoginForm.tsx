'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { AlertCircle } from 'lucide-react'
import { loginAction } from './actions'

type FieldErrors = {
  email?: string
  password?: string
}

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const errors: FieldErrors = {}

    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ingresa un correo electrónico válido'
    }

    if (!password.trim()) {
      errors.password = 'La contraseña es requerida'
    }

    if (Object.keys(errors).length > 0) {
      e.preventDefault()
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
  }

  return (
    <div className="min-h-screen bg-rp-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-rp-gray-200 p-8 w-full max-w-sm">
        <h1 className="font-display text-3xl text-rp-red text-center tracking-wide mb-8">
          RIVERPAR
        </h1>
        <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-5">
          {state?.error && (
            <div className="flex items-start gap-3 bg-red-50 border-l-4 border-l-rp-red rounded-r-lg px-4 py-3">
              <AlertCircle
                size={16}
                className="text-rp-red mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm text-red-900">{state.error}</p>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-rp-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="border border-rp-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rp-red/20 focus:border-rp-red transition-colors"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-rp-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="border border-rp-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rp-red/20 focus:border-rp-red transition-colors"
            />
            {fieldErrors.password && (
              <p className="text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
