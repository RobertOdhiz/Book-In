import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import axios from 'axios';
import '../styles/Account_Registration.css';
import '../styles/event_registration.css';
import Person from '../assets/img_avatar.png';
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
    MDBCardTitle,
    MDBInputGroup
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
    const [eventGuests, setEventGuests] = useState([]);
    const [eventDescription, setEventDescription] = useState('');
    const [userExists, setUserExists] = useState(false);
    const [selectEmail, setSelectEmail] = useState('');

    const session = useSession();
    const supabase = useSupabaseClient();
    const { isLoading } = useSessionContext();

    const fetchUser = async () => {
        if (session) {
            let { user_metadata: { sub: googleId } } = session.user;
            try {
                await axios.get(`http://localhost:5000/users/${googleId}`);
                setUserExists(true);
            } catch (error) {
                console.error('Error fetching user:', error.response.data);
                if (error.response.status === 404) {
                    setUserExists(false);
                }
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, [session]);

    if (isLoading) {
        return null;
    }

    const addEmailToGuests = (email) => {
        setEventGuests([...eventGuests, email]);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = await createCalendarEvent(session, eventTitle, eventDescription, eventDateTime, eventDuration);
            if (data) {
                console.log(`Event created successfully with id: ${data.id}`);

                const startDateTime = data.start ? data.start.dateTime : null;
                const startTimeZone = data.start ? data.start.timeZone : null;
                const endDateTime = data.end ? data.end.dateTime : null;

                if (!startDateTime || !endDateTime) {
                    throw new Error('Event start or end time is missing');
                }

                const eventData = {
                    eventId: data.id,
                    email: session.user.email,
                    title: eventTitle,
                    userId: session.user.user_metadata.sub,
                    startTime: startDateTime,
                    timeZone: startTimeZone,
                    endTime: endDateTime,
                    status: data.status,
                    description: eventDescription,
                    location: eventLocation,
                    attendees: eventGuests
                };

                const handlePost = async () => {
                    axios.post('http://127.0.0.1:5000/events', eventData)
                        .then((response2) => {
                            if (response2.status === 201) {
                                console.log('Event created');
                                window.location.href = `/events/${data.id}`;
                            }
                        })
                        .catch((error) => {
                            console.error('Error posting event:', error);
                            console.log('Event creation failed');
                        });
                };
                handlePost();
            } else {
                console.log('Event creation failed', data);
            }
        } catch (error) {
            console.error('Event creation error:', error);
            console.log('Event creation failed');
        }
    };

    const renderGuests = () => (
        <>
            {selectEmail && (
                <div className='chip d-flex justify-content-between align-items-center mb-2 shadow-5-strong'>
                    <img src={session.user.user_metadata.picture} alt='' />
                    <span>{selectEmail}</span>
                    <MDBIcon icon='close' onClick={() => { setEventGuests(prevGuests => [...prevGuests, selectEmail]) }} />
                </div>
            )}
        </>
    )
    const [hr, min] = eventDuration.split(':');
    const eventLabel = `This event will take place on ${eventDateTime.toDateString()} at ${eventDateTime.toLocaleTimeString()} for duration ${hr}h ${min}m`;

    return (
        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow className='justify-content-center'>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Register <br />
                        <span style={{ color: 'hsl(131, 81%, 75%)' }}>For The best Events</span>
                    </h1>

                    <p className='px-3' style={{ color: 'hsl(131, 81%, 85%)' }}>
                        Ready to bring your event to life and reach a wider audience?
                        Register your event now!
                    </p>

                </MDBCol>

                <MDBCol md='6' className='position-relative'>

                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>
                            {session && userExists ?
                                <>
                                    <h4>Welcome {session.user.email}!</h4>

                                    <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create Event</MDBCardTitle>
                                    <MDBInput wrapperClass='mb-4' label='Event title' id='form1' type='text' onChange={(e) => { setEventTitle(e.target.value) }} />
                                    <MDBInput wrapperClass='mb-2' label='Description' id='form2' type='text' onChange={(e) => { setEventDescription(e.target.value) }} />
                                    <MDBRow>
                                        <MDBCol col='6'>
                                            <label htmlFor='date-picker'>Date</label>
                                            <br />
                                            <DateTimePicker onChange={setEventDateTime} value={eventDateTime} />
                                        </MDBCol>

                                        <MDBCol md='2'>
                                            <label htmlFor='duration-picker'>Duration</label>
                                            <br />
                                            <MDBInput className='w-auto ' style={{ height: '30px' }} wrapperClass='mb-4' label='' id='form2' type='time' onChange={(e) => { setEventDuration(e.target.value) }} />
                                        </MDBCol>
                                    </MDBRow>
                                    <div className='d-flex justify-content-center mb-4 mt-2'>
                                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label={eventLabel} />
                                    </div>
                                    <MDBInput wrapperClass='mb-4' label='Event Location' id='form2' type='text' onChange={(e) => { setEventLocation(e.target.value) }} />
                                    <MDBInput className='mb-4' label='Add Guest Email' id='form3' type='text' onChange={(e) => { setEventGuests((prevGuests) => [...prevGuests, e.target.value]) }}>
                                        <i className='fas fa-plus trailing rounded' floating style={{ cursor: 'pointer' }}></i>
                                    </MDBInput>
                                    <MDBBtn className='w-100 mb-4' size='md'
                                        onClick={handleSubmit}
                                    > Create</MDBBtn>
                                </>
                                :
                                <>
                                    <div>
                                        <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create An Account To Get Started!</MDBCardTitle>
                                        <MDBBtn className='w-100 mb-4' size='md' href='/login'>Get Started</MDBBtn>
                                    </div>
                                </>
                            }
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>
        </MDBContainer >
    );
}

export default EventRegistration;

