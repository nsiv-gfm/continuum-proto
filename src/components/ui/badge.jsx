import React from 'react'
export const Badge = ({ className='', variant='default', ...props }) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
  const variants = {
    default: "bg-muted text-foreground",
    secondary: "bg-primary text-primary-foreground"
  }
  return <div className={[base, variants[variant]||variants.default, className].join(' ')} {...props} />
}
export default Badge
