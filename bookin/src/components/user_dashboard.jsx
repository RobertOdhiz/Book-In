import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import axios from 'axios';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBIcon,
    MDBCardText,
    MDBTypography,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBadge
} from 'mdb-react-ui-kit';

function UserDashboard() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (session) {
            const fetchEvents = async () => {
                try {
                    const { user_metadata } = session.user;
                    const userId = user_metadata.sub;
                    const response = await axios.get(`http://localhost:5000/users/${userId}/dashboard`);
                    setEvents(response.data.events);
                } catch (error) {
                    console.error('Error fetching events:', error.response.data);
                    if (error.response.status === 404) {
                        window.Location.href = '/register/thank-you';
                    }
                }
            };

            fetchEvents();
        }
    }, [session]);

    const renderEvents = () => (
        events.map((event) => (
            <tr key={event._id}>
                <td>
                    <div className='d-flex align-items-center'>
                        <img
                            src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                            alt=''
                            style={{ width: '45px', height: '45px' }}
                            className='rounded-circle'
                        />
                        <div className='ms-3'>
                            <p className='fw-bold mb-1'>{event.title}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <p className='fw-normal mb-1'>{new Date(event.startTime).toLocaleDateString()}</p>
                </td>
                <td>
                    <p className='fw-normal mb-1'>{new Date(event.endTime).toLocaleDateString()}</p>
                </td>
                <td>
                    <MDBBadge color='success' pill>
                        {event.status}
                    </MDBBadge>
                </td>
                <td>Senior</td>
            </tr>
        ))
    );

    return (
        <MDBContainer className='p-4 shadow-2-strong'>
            <MDBTypography tag='h3' className='mb-5 fw-bold'>
                Dashboard
            </MDBTypography>
            <MDBRow className='mb-2'>
                <MDBCol md='2' className='text-center' color='success'>
                    <div className='position-relative d-inline-block'>
                        <div color='success'
                            className='bg-success shadow-1-strong d-flex justify-content-center align-items-center border border-dark rounded-circle'
                            style={{ width: '100px', height: '100px' }}
                            id='eventCount'
                        >
                            <p className='fw-bold m-0 text-white' style={{ fontSize: '40px' }}>{events.length}</p>
                        </div>
                        <MDBBadge color='info' dark pill className='position-absolute translate-middle'>
                            events
                            <span class="visually-hidden">unread messages</span>
                        </MDBBadge>
                    </div>
                </MDBCol>
            </MDBRow>
            <MDBTable align='middle' className='mt-5'>
                <MDBTableHead className='shadow-1-strong'>
                    <tr>
                        <th scope='col'>EVENT</th>
                        <th scope='col'>EVENT START</th>
                        <th scope='col'>EVENT END</th>
                        <th scope='col'>STATUS</th>
                        <th scope='col'>BOOKED</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {events.length > 0 ? renderEvents() : <p>No events</p>}
                </MDBTableBody>
            </MDBTable>
        </MDBContainer>
    );
}

export default UserDashboard;

