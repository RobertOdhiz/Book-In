import React from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { googleSignIn, signOut } from '../services/googleServices';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBTypography
} from 'mdb-react-ui-kit';

function AccountLogin() {
    const session = useSession();
    const supabase = useSupabaseClient();

    const handleSignIn = () => {
        googleSignIn(supabase);
    };

    return (
        <MDBContainer className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Get <br />
                        <span style={{ color: 'hsl(131, 81%, 75%)' }}>Started</span>
                    </h1>
                    <p className='px-3' style={{ color: 'hsl(131, 81%, 85%)' }}>
                        Verify your account with google.
                    </p>
                </MDBCol>
                <MDBCol md='6' className='position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass'>
                        {session ? (
                            <>
                                <MDBTypography tag="h2" className='fw-bold mb-4 text-center'>Welcome Back!</MDBTypography>
                                <MDBTypography tag="h5" className=' mb-3 text-center'>Are you sure you want to sign out.</MDBTypography>
                                <MDBBtn color='success' className='w-100 mb-4' type='submit' size='md' href='/register/thank-you' block>
                                    Proceed To Events
                                </MDBBtn>
                                <MDBBtn color='bg-secondary shadow-1-strong' className='w-100 mb-4' type='submit' size='md' href='/' onClick={() => signOut(supabase)} block>
                                    Sign Out
                                </MDBBtn>
                            </>
                        ) : (
                            <>
                                <MDBCardBody className='p-5'>
                                    <MDBInput className='mb-4' type='email' id='email' name='email' label='Email address' />
                                    <MDBInput className='mb-4' type='password' id='password' name='password' label='Password' />
                                    <MDBRow className='mb-4'>
                                        <MDBCol className='d-flex justify-content-center'>
                                            <MDBCheckbox id='remember' name='remember' label='Remember me' defaultChecked />
                                        </MDBCol>
                                        <MDBCol>
                                            <a href='#!'>Forgot password?</a>
                                        </MDBCol>
                                    </MDBRow>
                                    <MDBBtn className='w-100 mb-4' type='submit' size='md' onClick={handleSignIn} block>
                                        Sign in
                                    </MDBBtn>
                                </MDBCardBody>
                            </>
                        )}
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default AccountLogin;
