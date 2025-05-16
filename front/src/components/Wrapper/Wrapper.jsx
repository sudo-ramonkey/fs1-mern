import '@carbon/styles/css/styles.css';//DO NOT REMOVE THIS LINE

const Wrapper = ({ children }) => {
    return (
        <div className="wrapper">
        {/* Aquí puedes agregar providers, contextos, etc. */}
        {children}
        </div>
    )
}

export default Wrapper