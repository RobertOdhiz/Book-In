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
    MDBBadge,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            const fetchEvents = async () => {
                try {
                    const { user_metadata } = session.user;
                    const userId = user_metadata.sub;
                    const response = await axios.get(`https://localhost:5000/users/${userId}/dashboard`);
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
            console.log(event),
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
                    <p className='fw-normal mb-1'>{new Date(event.startTime).toLocaleTimeString()}</p>
                </td>
                <td>
                    <p className='fw-normal mb-1'>{new Date(event.endTime).toLocaleDateString()}</p>
                    <p className='fw-normal mb-1'>{new Date(event.endTime).toLocaleTimeString()}</p>
                </td>
                <td>
                    <MDBBadge color='success' pill>
                        {event.status}
                    </MDBBadge>
                </td>
                <td>
                    <MDBDropdown>
                        <MDBDropdownToggle className='bg-success text-white rounded-5'>Attendees</MDBDropdownToggle>
                        <MDBDropdownMenu>
                            {Array.isArray(event.attendees) && event.attendees.length > 0 ?
                                event.attendees.map((item, key) => (
                                    <MDBDropdownItem>
                                        {
                                            item.email
                                        }
                                    </MDBDropdownItem>
                                )) :
                                <MDBDropdownItem className='align-content-center mx-2'>
                                    <h6 className='align-content-center'>None</h6>
                                </MDBDropdownItem>
                            }
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </td>
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
                    {events.length > 0 ? renderEvents() :
                        <div className='d-flex align-items-center justify-content-center flex-column p-4 w-100 gap-1'>
                            <p className=''>No Events</p>
                            <MDBBtn className='bg-success text-white' onClick={() => navigate('/register-event')}>Create Event Now</MDBBtn>
                        </div>}
                </MDBTableBody>
            </MDBTable>
        </MDBContainer>
    );
}

export default UserDashboard;

