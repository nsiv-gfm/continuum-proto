import React from 'react'
export function Badge({ className='', variant='default', ...props }) {
  const variants = {
    default: 'bg-zinc-900 text-white',
    secondary: 'bg-zinc-200 text-zinc-900',
    outline: 'border border-zinc-300 text-zinc-700'
  }
  return <span className={['inline-flex items-center text-xs px-2 py-1 rounded-full', variants[variant]||'', className].join(' ')} {...props} />
}
