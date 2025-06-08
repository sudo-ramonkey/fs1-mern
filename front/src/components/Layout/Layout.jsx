import AppHeader from '../Misc/AppHeader'
import Footer from '../Footer/Footer'
import './styles.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <AppHeader/>
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout