import React from 'react'
export function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    default: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-600',
    outline: 'border border-zinc-300 text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-600',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  }
  const sizes = { sm: 'px-2 py-1 text-xs rounded-lg', md: '', lg: 'px-4 py-3 text-base rounded-2xl' }
  return <button className={[base, variants[variant] || variants.default, sizes[size] || '', className].join(' ')} {...props} />
}
