import './App.css'
import Home from './components/Home'
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import NotFound from '../src/components/NotFound';

function App() {

  return (
    <Home />
  )
}

// export default App
// const App: React.FC = () => {
// return (
//   <Routes>
//        <Route path="/" element={<Home />} />
//         {/* כאשר לא נמצא נתיב, Navigate לדף ה-404 */}
//         {/* <Route path="*" element={<NotFound />} /> */}
//     </Routes>
// );

// };
export default App;
