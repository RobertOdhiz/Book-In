import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './components/Landing';
import AccountLogin from './components/Account_Login';
import Registration from './components/Account_Registration';
import EventRegistration from './components/event_registration';
import EventsList from './components/events_list';
import UserDashboard from './components/user_dashboard';
import Event from './components/event_page';
import EventQRCode from './components/event_qrcode';
import ThankYouPage from './components/thank_you_page';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/login' element={<AccountLogin />} />
        <Route path='/register-event' element={<EventRegistration />} />
        <Route path='/events' element={<EventsList />} />
        <Route path='/events/:id' element={<Event />} />
        <Route path='/users/:id/dashboard' element={<UserDashboard />} />
        <Route path='/events/:id/qrcode' element={<EventQRCode />} />
        <Route path='/register/thank-you' element={<ThankYouPage />} />
      </Routes>
    </Router>
  )
}

export default App
