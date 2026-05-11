import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-rp-gray-100 flex flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <Link href="/" className="flex flex-col items-center leading-none mb-10 group">
        <span className="font-display font-bold text-[32px] text-rp-red tracking-tight">
          RIVERPAR
        </span>
        <span className="text-[10px] text-rp-gray-500 tracking-[0.2em] uppercase mt-1">
          Constructora S.A.S.
        </span>
      </Link>

      {/* Número */}
      <p
        className="font-display font-bold text-[120px] leading-none text-rp-gray-200 select-none"
        aria-hidden="true"
      >
        404
      </p>

      {/* Mensaje */}
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-rp-black mt-4">
        Página no encontrada
      </h1>
      <p className="text-sm text-rp-gray-500 mt-3 max-w-sm leading-relaxed">
        La página que buscas no existe o fue movida. Puedes regresar al inicio o
        explorar nuestros proyectos.
      </p>

      {/* Botones */}
      <div className="flex flex-wrap gap-3 justify-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-rp-red text-white font-medium px-6 py-2.5 rounded-md text-sm hover:bg-rp-red-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-red focus-visible:ring-offset-2"
        >
          Volver al inicio
        </Link>
        <Link
          href="/proyectos"
          className="inline-flex items-center justify-center border-2 border-rp-red text-rp-red font-medium px-6 py-2.5 rounded-md text-sm hover:bg-rp-red hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rp-red focus-visible:ring-offset-2"
        >
          Ver proyectos
        </Link>
      </div>
    </div>
  )
}
