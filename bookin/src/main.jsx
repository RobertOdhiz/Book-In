import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createClient } from '@supabase/supabase-js'; //allows react application to talk to supabase
import { SessionContextProvider } from '@supabase/auth-helpers-react'; // allows our app to talk to supabase and use the client

const supabase = createClient(
  'https://prjhjaprjmqggepsgffn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamhqYXByam1xZ2dlcHNnZmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk0Mjk3MDEsImV4cCI6MjAzNTAwNTcwMX0.Mkt_xNv-Jqf_6gG7ysHOqu0tyyhiSXGsmDGbZmsR50Y'
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>,
)
