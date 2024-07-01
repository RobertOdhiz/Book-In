import React, { setState, useState } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';

import '../styles/Account_Registration.css';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBCardTitle
} from 'mdb-react-ui-kit';

import { googleSignIn, signOut, createCalendarEvent } from '../services/googleServices';

import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import '../styles/Account_login.css';

function EventRegistration() {
    const [eventDateTime, setEventDateTime] = useState(new Date());
    const [eventDuration, setEventDuration] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventGuest, setEventGuest] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const session = useSession(); // current active token stored here, when session exists we have a user
    const supabase = useSupabaseClient();
    const { isLoading } = useSessionContext(); // prevents a blank screen on load

    if (isLoading) { return <></> };

    const [hr, min] = eventDuration.split(':');
    const eventLabel = `This event will take place on ${eventDateTime.toDateString()} at ${eventDateTime.toLocaleTimeString()} for duration ${hr}h ${min}m`;

    return (
        <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Register Event <br />
                        <span style={{ color: 'hsl(131, 81%, 75%)' }}>For The best Events</span>
                    </h1>

                    <p className='px-3' style={{ color: 'hsl(131, 81%, 85%)' }}>
                        Ready to bring your event to life and reach a wider audience?
                        Register now your event now !
                    </p>

                </MDBCol>

                <MDBCol md='6' className='position-relative'>

                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>
                            {session ?
                                <>
                                    <h4>Welcome {session.user.email} !</h4>

                                    <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create Event</MDBCardTitle>
                                    <MDBInput wrapperClass='mb-4' label='Event title' id='form1' type='text' onChange={(e) => { setEventTitle(e.target.value) }} />
                                    <MDBInput wrapperClass='mb-2' label='Description' id='form2' type='text' onChange={(e) => { setEventDescription(e.target.value) }} />
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <label htmlFor='date-picker'>Date</label>
                                            <DateTimePicker onChange={setEventDateTime} value={eventDateTime} />
                                        </MDBCol>

                                        <MDBCol >
                                            <label htmlFor='duration-picker'>Duration</label>
                                            <br />
                                            <MDBInput style={{ height: '30px' }} wrapperClass='mb-4' label='' id='form2' type='time' onChange={(e) => { setEventDuration(e.target.value) }} />
                                        </MDBCol>
                                    </MDBRow>
                                    <div className='d-flex justify-content-center mb-4 mt-2'>
                                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label={eventLabel} />
                                    </div>
                                    <MDBInput wrapperClass='mb-4' label='Event Location' id='form2' type='text' onChange={(e) => { setEventLocation(e.target.value) }} />
                                    <MDBInput wrapperClass='mb-4' label='Add Guest' id='form3' type='text' onChange={(e) => { setEventGuest(e.target.value) }} />
                                    <MDBBtn className='w-100 mb-4' size='md'
                                        onClick={() => { createCalendarEvent(session, eventTitle, eventDescription, eventDateTime, eventDuration); signOut(supabase) }}
                                    > Create</MDBBtn>
                                </>
                                :
                                <>
                                    <div className=''>
                                        <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create An Account To Get Started !</MDBCardTitle>
                                        <MDBBtn className='w-100 mb-4' size='md' href='/register' onClick={() => googleSignIn(supabase)}>Get Started</MDBBtn>
                                    </div>
                                </>
                            }
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>
        </MDBContainer >
    )
}

export default EventRegistration;