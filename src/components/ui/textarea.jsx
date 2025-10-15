import React from 'react'
export const Textarea = ({ className='', ...props }) => (
  <textarea className={["flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className].join(' ')} {...props} />
)
export default Textarea
