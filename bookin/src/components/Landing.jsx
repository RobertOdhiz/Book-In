import { Container, Row, Col, Image, Stack, Nav, NavLink } from 'react-bootstrap';
import HeroIllustration from './../assets/Hero-Illustration.svg'
import AllInone from './../assets/All-in-one.svg';
import Analytics from './../assets/Analytics.svg';
import Attendees from './../assets/Attendee-Management.svg';
import Platform from './../assets/Platform.svg';
import Tickets from './../assets/Tickets.svg';
import Target from './../assets/Target.svg';
import '../styles/landing.css';
import Footer from './Footer.jsx';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { MDBBtn } from 'mdb-react-ui-kit';
import Iframe from 'react-iframe'

function Landing() {

  const session = useSession();
  let UserDashboardUrl = '/login';
  if (session) {
    UserDashboardUrl = `/users/${session.user.user_metadata.sub}/dashboard`;
  }

  return (
    <>
      <div className='landing'>
        <nav className='nav'>
          <h4>Book-In</h4>
          <ul>
            <li ><NavLink className='text-link' href='/'>Home</NavLink></li>
            {session ?
              <>
                <li ><NavLink className='text-link' href={UserDashboardUrl}>Dashboard</NavLink></li>
                <MDBBtn color='success'>
                  <NavLink className='text-link' href='/login'>Logout</NavLink>
                </MDBBtn>
              </>
              :
              <>
                <MDBBtn color='success'>
                  <NavLink className='text-link' href='/login'>Login</NavLink>
                </MDBBtn>
              </>
            }
          </ul>
        </nav>
        <div className="hero">
          <div className="left-hero">
            <h1>
              Simplify Your Event Bookings with Our All-in-One Solution
            </h1>
            <p className="tagline">
              Join the 1000+ of users like you that use our services From ticket sales to attendee management, our platform has everything you need for a successful event.
            </p>
            <MDBBtn className='' color='success'  >
              <NavLink className='text-link' href='/register-event'>Create An event for Free</NavLink>
            </MDBBtn>

          </div>
          <img src={HeroIllustration} alt='Hero image' />
        </div>
        <div className="section1">
          <div className="comp">
            <img src={Platform} alt="" />
            <p>
              Use Book-In ina ny device
            </p>
          </div>
          <div className="comp">
            <img src={Target} alt="" />
            <p>
              Target a wide audience with a user friendly platform
            </p>
          </div>
          <div className="comp">
            <img src={Tickets} alt="" />
            <p>
              Generate a ticket easily with templates
            </p>
          </div>
        </div>
        <div className="section2">
          <div className="left-sec">
            <h5>Bookings</h5>
            <h2>
              A fully integrated suite of Event Creation and Customization tools
            </h2>
            <p>
              Design and launch your events with ease using our intuitive tools. Customize every detail to meet your specific needs and create an unforgettable experience for your attendees.
            </p>
          </div>
          <img src={AllInone} alt="bookings illustration" />
        </div>
        <div className="section2">
          <img src={Attendees} alt="management illustration" />
          <div className="right-sec">
            <h5>Management</h5>
            <h2>
              Comprehensive Attendee Management
            </h2>
            <p>
              Efficiently Manage Your Attendees from Registration to Post-Event Follow-Up. Book-In Simplifies Check-Ins, Communications And Engagement To Ensure A smooth and Enjoyable Experience For All.
            </p>
          </div>
        </div>
        <div className="section2">
          <div className="right-sec">
            <h5>Monitoring</h5>
            <h2>
              Insightful Real-time Analytics and Reporting
            </h2>
            <p>
              Gain valuable insights into your event’s performance with our real-time analytics. Track attendee behavior, measure engagement, and make data-driven decisions to enhance future events.
            </p>
          </div>
          <img src={Analytics} alt="monitoring illustration" />
        </div>
        <div className="cta-sec">
          <h5>Plan Smarter</h5>
          <h1>Ready To Rock Your Next Event Or Appointment?</h1>
          <button>Create Now</button>
        </div>
      </div>

      <Footer />

    </>
  )
}

export default Landing
