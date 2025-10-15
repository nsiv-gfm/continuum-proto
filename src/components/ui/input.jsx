import React from 'react'
export function Input({ className='', ...props }) {
  return <input className={['w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500', className].join(' ')} {...props} />
}
