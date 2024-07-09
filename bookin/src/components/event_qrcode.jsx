import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { getCalendarEvent } from '../services/googleServices';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode'; // use "qrcode" package instead of "react-qr-code"
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
import axios from 'axios';


function EventQRCode() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [eventData, setEventData] = useState({});
    const [fullEventData, setFullEventData] = useState({});
    const [qrCodeDataURL, setQRCodeDataURL] = useState(null);
    const location = useLocation();
    const currentUrl = window.location.href;
    const parts = location.pathname.split('/');
    const id = parts[parts.length - 2];

    useEffect(() => {
        if (session) {
            const fetchEvent = async () => {
                const response = await axios.get(`https://alxrob.tech/events/${id}`);
                setFullEventData(response.data.event);
                const event = response.data.event;

                setEventData({
                    id: event.eventId,
                    title: event.title,
                    description: event.description,
                    startTime: event.startTime,
                    endTime: event.endTime,
                    attendees: event.attendees || 'Unknown',
                    location: event.location || 'Unknown',
                    status: event.status || 'Unknown',
                })
                generateQRCode(currentUrl);
            };

            fetchEvent();
        }
    }, [session]);

    const generateQRCode = async (url) => {
        try {
            const dataUrl = await QRCode.toDataURL(url);
            setQRCodeDataURL(dataUrl);
        } catch (error) {
            console.error('Failed to generate QR code', error);
        }
    };

    const saveQRCode = async () => {
        if (qrCodeDataURL) {
            try {
                setFullEventData({ ...fullEventData, qrCodeDataURL: qrCodeDataURL });
                console.log(fullEventData);
                const dbId = fullEventData._id;
                console.log(dbId);
                axios.put(`https://alxrob.tech/events/${dbId}`, fullEventData)
                    .then((response) => {
                        if (response.status === 200 || response.status === 204) {
                            alert('QR Code saved successfully!');
                        } else {
                            alert('Failed to save QR Code');
                        }
                    })

            } catch (error) {
                console.error('Failed to save QR Code', error);
            }
        }
    };

    const formatDateTime = (start, end) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true, timeZoneName: 'short' };
        const formattedStartDate = new Date(start).toLocaleDateString('en-US', options);
        const formattedStartTime = new Date(start).toLocaleTimeString('en-US', timeOptions);
        const formattedEndTime = new Date(end).toLocaleTimeString('en-US', timeOptions);

        return `${formattedStartDate} ${formattedStartTime} to ${formattedEndTime}`;
    };

    return (

        <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='12' className='position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass'>
                        <MDBCardBody className='p-5'>
                            <h4>TICKET</h4>
                            {session ? (
                                <>
                                    {eventData ? (
                                        <>
                                            <MDBRow key={eventData.id} className='mb-4 shadow-5-strong'>
                                                <MDBCol md='2' className='m-2 d-flex justify-content-center align-items-center shadow-1-strong'>
                                                    <img src={qrCodeDataURL} alt='QR Code' />
                                                </MDBCol>
                                                <MDBCol className='m-2'>
                                                    <MDBTypography color='secondary' className='fw-bold' style={{ color: 'GrayText' }}>Ticket Type</MDBTypography>
                                                    <p className='lead'>{eventData.title}</p>
                                                    <MDBTypography color='secondary' className='fw-bold' style={{ color: 'GrayText' }}>Event</MDBTypography>
                                                    <p className='lead'>{eventData.description}</p>
                                                    <p className='lead'>Expected guests in attendance: {eventData.guests}</p>
                                                    <p>Event will be held at {eventData.location} from {formatDateTime(eventData.startTime, eventData.endTime)}</p>
                                                    <MDBTypography color='secondary' className='fw-bold' style={{ color: 'GrayText' }}>Status</MDBTypography>
                                                    <p className='lead'>{eventData.status}</p>
                                                </MDBCol>
                                                <MDBBtn color='success' className='me-2 mb-4' size='md' onClick={saveQRCode}>Save QR Code</MDBBtn>
                                            </MDBRow>
                                        </>
                                    ) : (
                                        <MDBTypography color='secondary' className='fw-bold' style={{ color: 'GrayText' }}>No Event Found</MDBTypography>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className=''>
                                        <MDBCardTitle className='pb-2 mb-4 solid-bottom-border'>Create An Account To Get Started!</MDBCardTitle>
                                        <MDBBtn className='w-100 mb-4' size='md' href='/register' onClick={() => googleSignIn(supabase)}>Sign In</MDBBtn>
                                    </div>
                                </>
                            )}

                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>

    );
}

export default EventQRCode;

