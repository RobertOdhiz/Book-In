import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { getCalendarEvent } from '../services/googleServices';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../styles/Account_Registration.css';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBTypography
} from 'mdb-react-ui-kit';

function Event() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [eventData, setEventData] = useState(null);
    console.log(eventData);
    const location = useLocation();
    console.log(session ? `Session in Event Page ${session.user.email}` : 'No session');

    useEffect(() => {
        if (session) {
            const fetchEvent = async () => {
                const eventId = location.pathname.split('/').pop();
                console.log(eventId);
                const response = await axios.get(`https://localhost:5000/events/${eventId}`);
                let event = response.data.event; //await getCalendarEvent(session, eventId);

                const eventObj = {
                    id: event.eventId,
                    title: event.title,
                    description: event.description,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    attendees: event.attendees || 'Unknown',
                    location: event.location || 'Unknown',
                    status: event.status || 'Unknown',
                }
                console.log(event, eventObj);
                setEventData(eventObj);
            };

            fetchEvent();
        }
    }, [session]);

    const formatDateTime = (start, end) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' };
        const formattedStartDate = new Date(start).toLocaleDateString('en-US', options);
        const formattedStartTime = new Date(start).toLocaleTimeString('en-US', timeOptions);
        const formattedEndTime = new Date(end).toLocaleTimeString('en-US', timeOptions);

        return `${formattedStartDate} ${formattedStartTime} to ${formattedEndTime}`;
    };

    return (
        eventData && (
            <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
                <MDBRow>
                    <MDBCol md='12' className='position-relative'>
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                        <MDBCard className='my-5 bg-glass'>
                            <MDBCardBody className='p-5'>
                                <h4>EVENT</h4>
                                {session ?
                                    <>
                                        {eventData ? <>
                                            <MDBRow key={eventData.id} className='mb-4 shadow-5-strong'>
                                                <MDBCol md='2' className='m-2 d-flex justify-content-center align-items-center shadow-1-strong' style={{ background: 'lightgrey' }}>
                                                    <div>
                                                        <p>{new Date(eventData.startTime).toLocaleDateString()}</p>
                                                        <p className='fw-bold'>{new Date(eventData.startTime).toLocaleTimeString()}</p>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol className='m-2'>
                                                    <div>
                                                        <h5 className='fw-bold' style={{ color: 'GrayText' }}>{eventData.title}</h5>
                                                        <p className='lead'>{eventData.description}</p>
                                                        <p className='lead'>Expected guests in attendance: {eventData.attendees}</p>
                                                        <p>Event will be held at {eventData.location} from {formatDateTime(eventData.startTime, eventData.endTime)}</p>
                                                    </div>
                                                </MDBCol>
                                            </MDBRow>

                                            <MDBBtn className='me-1' color='success' size='sm' href={`/events/${eventData.id}/qrcode`} onClick={() => { }}>
                                                Get event QR code
                                            </MDBBtn>
                                        </>
                                            : <MDBTypography color='secondary' className='fw-bold' style={{ color: 'GrayText' }}>No Event Found</MDBTypography>}
                                    </>
                                    :
                                    <>
                                        <div className=''>
                                            <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create An Account To Get startted!</MDBCardTitle>
                                            <MDBBtn className='w-100 mb-4' size='md' href='/register' onClick={() => googleSignIn(supabase)}>Sign In</MDBBtn>
                                        </div>
                                    </>
                                }

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    )
}

export default Event;

