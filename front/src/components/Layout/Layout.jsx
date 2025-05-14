import React from 'react'
import './styles.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">Header Content</header>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">Footer Content</footer>
    </div>
  )
}

export default Layout