import React, { setState, useState } from 'react';

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


function AccountLogin() {


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
                            <form>
                                <MDBInput className='mb-4' type='email' id='form1Example1' label='Email address' />
                                <MDBInput className='mb-4' type='password' id='form1Example2' label='Password' />

                                <MDBRow className='mb-4'>
                                    <MDBCol className='d-flex justify-content-center'>
                                        <MDBCheckbox id='form1Example3' label='Remember me' defaultChecked />
                                    </MDBCol>
                                    <MDBCol>
                                        <a href='#!'>Forgot password?</a>
                                    </MDBCol>
                                </MDBRow>

                                <MDBBtn type='submit' block>
                                    Sign in
                                </MDBBtn>
                            </form>
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>

            </MDBRow>
        </MDBContainer >
    )
}

export default AccountLogin;