import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import WhatsAppCTA from '@/components/ui/WhatsAppCTA'
import SectionLabel from '@/components/ui/SectionLabel'
import Container from '@/components/ui/Container'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function TestUIPage() {
  return (
    <>
      <Navbar settings={null} />

      <Container className="py-16 space-y-20">
        {/* ── SectionLabel ── */}
        <section className="space-y-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-rp-gray-500 border-b border-rp-gray-200 pb-2">
            SectionLabel
          </h2>
          <SectionLabel
            eyebrow="Nuestros proyectos"
            title="Vive donde lo imaginaste"
            subtitle="Diseñamos espacios que combinan confort, funcionalidad y ubicaciones estratégicas en las mejores zonas de la ciudad."
          />
          <SectionLabel
            eyebrow="Centrado"
            title="Calidad que se nota"
            subtitle="Cada detalle está pensado para ofrecerte la mejor experiencia de vida."
            centered
          />
        </section>

        {/* ── Buttons ── */}
        <section className="space-y-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-rp-gray-500 border-b border-rp-gray-200 pb-2">
            Button — variantes
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary" size="md">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="outline" size="sm">Outline SM</Button>
            <Button variant="outline" size="md">Outline MD</Button>
            <Button variant="outline" size="lg">Outline LG</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="ghost" size="sm">Ghost SM</Button>
            <Button variant="ghost" size="md">Ghost MD</Button>
            <Button variant="ghost" size="lg">Ghost LG</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" href="/proyectos">Como Link → /proyectos</Button>
            <Button variant="outline" disabled>Deshabilitado</Button>
          </div>
        </section>

        {/* ── Badge ── */}
        <section className="space-y-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-rp-gray-500 border-b border-rp-gray-200 pb-2">
            Badge — estados comerciales
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge status="preventa" />
            <Badge status="en_obra" />
            <Badge status="listo_entrega" />
            <Badge status="vendido" />
          </div>
        </section>

        {/* ── WhatsAppCTA ── */}
        <section className="space-y-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-rp-gray-500 border-b border-rp-gray-200 pb-2">
            WhatsAppCTA
          </h2>
          <WhatsAppCTA
            phone="+573001234567"
            projectName="Torres del Parque"
            projectUrl="https://riverpar.com/proyectos/torres-del-parque"
          />
        </section>

        {/* ── Tipografía / tokens ── */}
        <section className="space-y-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-rp-gray-500 border-b border-rp-gray-200 pb-2">
            Tipografía y paleta
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="font-display text-4xl font-bold text-rp-black">Playfair Display</p>
              <p className="font-sans text-lg text-rp-gray-700">DM Sans — texto de UI</p>
              <p className="font-sans text-sm text-rp-gray-500">Subtítulos y descripciones</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'rp-red', bg: '#C8102E' },
                { name: 'rp-red-dark', bg: '#9B0C23' },
                { name: 'rp-red-light', bg: '#FDECEA' },
                { name: 'rp-black', bg: '#111111' },
                { name: 'gray-700', bg: '#444444' },
                { name: 'gray-500', bg: '#777777' },
                { name: 'gray-200', bg: '#E8E8E8' },
                { name: 'gray-100', bg: '#F5F5F5' },
              ].map(({ name, bg }) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-lg border border-rp-gray-200"
                    style={{ backgroundColor: bg }}
                  />
                  <span className="text-[10px] text-rp-gray-500 font-mono">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>

      <Footer settings={null} />
    </>
  )
}
