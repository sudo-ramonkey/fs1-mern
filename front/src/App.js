import { Routes, Route } from 'react-router-dom';
import Wrapper from './components/Wrapper/Wrapper';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';


function App() {
  return (
    <Wrapper>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Wrapper>
  );
}

export default App;
