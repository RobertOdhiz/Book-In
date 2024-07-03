import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { getCalendarEvent } from '../services/googleServices';
import { useLocation } from 'react-router-dom';
import '../styles/Account_Registration.css';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle
} from 'mdb-react-ui-kit';

function EventsList() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [events, setEvents] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (session) {
            const fetchEvents = async () => {
                const eventsData = await getCalendarEvent(session);
                setEvents(eventsData);
            };

            fetchEvents();
        }
    }, [session]);

    return (
        <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='12' className='position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>
                            <h4>EVENTS</h4>
                            {session ?
                                <>
                                    {events.length > 0 ? events.map((event) => (
                                        <MDBRow key={event.id} className='mb-4 shadow-5-strong'>
                                            <MDBCol md='2' className='m-2 d-flex justify-content-center align-items-center shadow-1-strong' style={{ background: 'lightgrey' }}>
                                                <div>
                                                    <p>{new Date(event.startTime).toLocaleDateString()}</p>
                                                    <p className='fw-bold'>{new Date(event.startTime).toLocaleTimeString()}</p>
                                                </div>
                                            </MDBCol>
                                            <MDBCol className='m-2'>
                                                <div>
                                                    <h5 className='fw-bold' style={{ color: 'GrayText' }}>{event.eventName}</h5>
                                                    <p>{event.description}</p>
                                                </div>
                                            </MDBCol>
                                        </MDBRow>
                                    )) : <h5 className='fw-bold' style={{ color: 'GrayText' }}>No Events Found</h5>}
                                </>
                                :
                                <>
                                    <div className=''>
                                        <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create An Account To Get Started!</MDBCardTitle>
                                        <MDBBtn className='w-100 mb-4' size='md' href='/register' onClick={() => googleSignIn(supabase)}>Sign In</MDBBtn>
                                    </div>
                                </>
                            }
                            <h5>location</h5>
                            <p>location - pathname: {location.pathname}</p>
                            <p>location - search: {location.search}</p>
                            <p>location - hash: {location.hash}</p>
                            <pre>{JSON.stringify(location.state, null, 2)}</pre>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}

export default EventsList;
