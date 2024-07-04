import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBIcon,
    MDBListGroup,
    MDBListGroupItem
} from 'mdb-react-ui-kit';

function UserDashboard() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (session) {
            const fetchEvents = async () => {
                const response = await axios.get(`http://localhost:5000/events?user_id=${session.user.id}`);
                setEvents(response.data.events);
            };

            fetchEvents();
        }
    }, [session]);

    return (
        events.length > 0 && (
            <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
                <MDBRow>
                    <MDBCol md='12' className='position-relative'>
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                        <MDBCard className='my-5 bg-glass'>
                            <MDBCardBody className='p-5'>
                                <h4>Your Events</h4>
                                {session ?
                                    <>
                                        {events.length > 0 ? (
                                            <MDBListGroup>
                                                {events.map((event) => (
                                                    <MDBListGroupItem key={event.id} href={`/events/${event.id}`} className='d-flex justify-content-between align-items-center'>
                                                        <div className='d-flex align-items-center'>
                                                            <MDBIcon icon='calendar' className='me-2' />
                                                            <span>{event.title}</span>
                                                        </div>
                                                        <div className='d-flex align-items-center'>
                                                            <MDBIcon icon='user-friends' className='me-2' />
                                                            <span>{event.attendees}</span>
                                                        </div>
                                                    </MDBListGroupItem>
                                                ))}
                                            </MDBListGroup>
                                        ) : (
                                            <MDBTypography color='secondary' className='fw-bold' style={{ color: 'GrayText' }}>No Events Found</MDBTypography>
                                        )}
                                    </>
                                    :
                                    <>
                                        <div className=''>
                                            <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create An Account To Get started!</MDBCardTitle>
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

export default UserDashboard;

