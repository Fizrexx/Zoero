import './globals.css'

export const metadata = {
  title: 'Zoero',
  description: 'Simple image sharing platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
