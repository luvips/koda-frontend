'use client';

/**
 * Navbar.tsx
 * Barra de navegación fija superior para AWOS.
 *
 * Características:
 *  - Glassmorphism oscuro: fondo rgba(0,0,0,0.8) + backdrop-blur
 *  - Borde inferior cian muy sutil
 *  - Logo "AWOS" en fuente mono con glow cian
 *  - Links "Test" y "Dashboard" con indicador underline animado (layoutId)
 *  - Estado sin usuario: botón "Login" (CyberButton ghost)
 *  - Estado con usuario: avatar con iniciales + nombre + botón "Logout"
 *  - Responsive: hamburger en móvil con menú desplegable animado
 *
 * NOTA MOCK: Esta versión no consulta Zustand todavía.
 * Cambiar MOCK_LOGGED_IN a true/false para ver ambos estados.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { CyberButton } from '@/components/ui/CyberButton';

// ─── Configuración mock ───────────────────────────────────────────────────────

/**
 * MOCK_LOGGED_IN
 * Cambia este valor para previsualizar el estado autenticado o anónimo.
 *  true  → muestra avatar + nombre + Logout
 *  false → muestra botón Login
 */
const MOCK_LOGGED_IN = true;

/**
 * Usuario mock hardcodeado para previsualización.
 * Cuando se integre Zustand, reemplazar por useUser() del store.
 */
const MOCK_USER = {
  username: 'koda_tester',
  email:    'test@koda.dev',
};

// ─── Links de navegación ──────────────────────────────────────────────────────

/**
 * Definición de los links del navbar.
 * href debe coincidir con las rutas del App Router.
 */
const NAV_LINKS = [
  { label: 'Test',       href: '/test'      },
  { label: 'Dashboard',  href: '/dashboard' },
] as const;

// ─── Subcomponente: Logo ──────────────────────────────────────────────────────

/**
 * Logo "KODA" con glow cian sutil.
 * Usa text-shadow inline porque Tailwind no lo soporta nativamente.
 */
function NavLogo() {
  return (
    <Link
      href="/"
      className="font-mono text-xl font-bold tracking-[0.2em] text-[#00ffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]"
      style={{ textShadow: '0 0 10px rgba(0,255,255,0.5)' }}
      aria-label="KODA — Ir al inicio"
    >
      KODA
    </Link>
  );
}

// ─── Subcomponente: NavLink con underline animado ─────────────────────────────

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * Link individual con indicador underline animado via framer-motion layoutId.
 * El layoutId="underline" permite que el indicador se deslice entre links activos.
 */
function NavLink({ href, label, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'relative pb-1 font-mono text-sm tracking-wider transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]',
        isActive ? 'text-[#00ffff]' : 'text-[#444444] hover:text-[#00ffff]',
      ].join(' ')}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}

      {/* Indicador underline animado — solo visible en el link activo */}
      {isActive && (
        <motion.span
          layoutId="underline"
          className="absolute bottom-0 left-0 h-px w-full bg-[#00ffff]"
          style={{ boxShadow: '0 0 6px rgba(0,255,255,0.6)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

// ─── Subcomponente: Avatar de usuario ─────────────────────────────────────────

interface UserAvatarProps {
  username: string;
}

/**
 * Avatar circular con las iniciales del usuario.
 * Fondo cian muy oscuro, borde cian sutil.
 */
function UserAvatar({ username }: UserAvatarProps) {
  // Toma las dos primeras letras del username como iniciales
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#00ffff] font-mono text-xs font-bold text-[#00ffff]"
      style={{ backgroundColor: 'rgba(0,255,255,0.08)' }}
    >
      {initials}
    </span>
  );
}

// ─── Subcomponente: Sección de usuario (autenticado) ─────────────────────────

interface UserSectionProps {
  username: string;
  onLogout: () => void;
}

/**
 * Muestra el avatar, el nombre del usuario y el botón de logout.
 * Se renderiza cuando MOCK_LOGGED_IN = true.
 */
function UserSection({ username, onLogout }: UserSectionProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar con iniciales */}
      <UserAvatar username={username} />

      {/* Nombre del usuario */}
      <span className="hidden font-mono text-sm text-[#888888] sm:block">
        {username}
      </span>

      {/* Botón de logout */}
      <CyberButton variant="ghost" size="sm" onClick={onLogout}>
        Logout
      </CyberButton>
    </div>
  );
}

// ─── Subcomponente: Menú móvil desplegable ────────────────────────────────────

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  isLoggedIn: boolean;
  username?: string;
  onClose: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

/**
 * Menú desplegable para pantallas móviles.
 * Animado con framer-motion (slide-down + fade).
 */
function MobileMenu({
  isOpen,
  pathname,
  isLoggedIn,
  username,
  onClose,
  onLogout,
  onLogin,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{
            backgroundColor: 'rgba(0,0,0,0.95)',
            borderBottom: '1px solid rgba(0,255,255,0.1)',
          }}
          className="absolute left-0 top-full w-full px-6 py-4 md:hidden"
        >
          {/* Links de navegación en columna */}
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={pathname === link.href}
                onClick={onClose}
              />
            ))}
          </nav>

          {/* Separador */}
          <div
            className="my-4 h-px"
            style={{ backgroundColor: 'rgba(0,255,255,0.08)' }}
          />

          {/* Sección de autenticación en móvil */}
          {isLoggedIn && username ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserAvatar username={username} />
                <span className="font-mono text-sm text-[#888888]">
                  {username}
                </span>
              </div>
              <CyberButton variant="ghost" size="sm" onClick={onLogout}>
                Logout
              </CyberButton>
            </div>
          ) : (
            <CyberButton variant="ghost" size="sm" onClick={onLogin}>
              Login
            </CyberButton>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function Navbar() {
  // Ruta activa para resaltar el link correcto
  const pathname = usePathname();

  // Estado del menú hamburger en móvil
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Handlers mock ──────────────────────────────────────────────────────────
  // Cuando se integre Zustand, reemplazar por loginMock() y logout() del store.

  function handleLogin() {
    // TODO: conectar con useStore().loginMock()
    console.log('[MOCK] Abrir modal de login');
    setMobileOpen(false);
  }

  function handleLogout() {
    // TODO: conectar con useStore().logout()
    console.log('[MOCK] Cerrar sesión');
    setMobileOpen(false);
  }

  return (
    // ── Barra fija superior ────────────────────────────────────────────────
    <header
      style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,255,255,0.1)',
      }}
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-6">

        {/* ── Logo ── */}
        <NavLogo />

        {/* ── Links de navegación (desktop) ── */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}
        </nav>

        {/* ── Sección derecha: auth (desktop) ── */}
        <div className="hidden items-center md:flex">
          {MOCK_LOGGED_IN ? (
            // Usuario autenticado: avatar + nombre + logout
            <UserSection
              username={MOCK_USER.username}
              onLogout={handleLogout}
            />
          ) : (
            // Usuario anónimo: botón login
            <CyberButton variant="ghost" size="sm" onClick={handleLogin}>
              Login
            </CyberButton>
          )}
        </div>

        {/* ── Botón hamburger (móvil) ── */}
        <button
          className="flex items-center justify-center text-[#444444] transition-colors hover:text-[#00ffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff] md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {/* Alterna entre icono hamburger y X */}
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Menú desplegable móvil ── */}
      <MobileMenu
        isOpen={mobileOpen}
        pathname={pathname}
        isLoggedIn={MOCK_LOGGED_IN}
        username={MOCK_LOGGED_IN ? MOCK_USER.username : undefined}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </header>
  );
}
