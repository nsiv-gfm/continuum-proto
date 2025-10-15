import React from 'react'
export const Card = ({ className='', ...props }) => (
  <div className={["rounded-2xl border bg-card text-card-foreground shadow-sm", className].join(' ')} {...props} />
)
export const CardHeader = ({ className='', ...props }) => (
  <div className={["flex flex-col space-y-1.5 p-6", className].join(' ')} {...props} />
)
export const CardTitle = ({ className='', ...props }) => (
  <h3 className={["text-lg font-semibold leading-none tracking-tight", className].join(' ')} {...props} />
)
export const CardDescription = ({ className='', ...props }) => (
  <p className={["text-sm text-muted-foreground", className].join(' ')} {...props} />
)
export const CardContent = ({ className='', ...props }) => (
  <div className={["p-6 pt-0", className].join(' ')} {...props} />
)
export const CardFooter = ({ className='', ...props }) => (
  <div className={["flex items-center p-6 pt-0", className].join(' ')} {...props} />
)
export default Card
