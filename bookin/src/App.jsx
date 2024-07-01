import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/Landing';
import AccountLogin from './components/Account_Login';
import Registration from './components/Account_Registration';
import EventRegistration from './components/event_registration';
import EventsList from './components/events_list';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/login' element={<AccountLogin />} />
        <Route path='/register-event' element={<EventRegistration />} />
        <Route path='/events' element={<EventsList />} />
      </Routes>
    </Router>
  )
}

export default App
