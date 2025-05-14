import AppHeader from '../Misc/AppHeader'
import './styles.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <AppHeader/>
      <main className="layout-main">{children}</main>
      <footer className="layout-footer">Footer Content</footer>
    </div>
  )
}

export default Layout