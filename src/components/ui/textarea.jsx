import React from 'react'
export function Textarea({ className='', ...props }) {
  return <textarea className={['w-full border rounded-lg px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-emerald-500', className].join(' ')} {...props} />
}
