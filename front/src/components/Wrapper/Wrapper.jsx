import './styles.css'

const Wrapper = ({ children }) => {
    return (
        <div className="wrapper">
        {/* Aquí puedes agregar providers, contextos, etc. */}
        {children}
        </div>
    )
}

export default Wrapper