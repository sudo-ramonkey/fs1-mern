import '@carbon/styles/css/styles.css';//DO NOT REMOVE THIS LINE
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
const Wrapper = ({ children }) => {
    return (
        <div className="wrapper">
        <Provider store={store}>
        {children}
        </Provider>
        </div>
    )
}

export default Wrapper