import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

function AccountLogin() {
    const session = useSession();
    const supabase = useSupabaseClient();
    const [userExists, setUserExists] = useState(false);
    console.log(session ? `Session in Account Login : ${session.user.email}` : 'No session');

    const handleSignIn = async () => {
        const { data, error } = await supabase.auth.refreshSession();
        const { session, user } = data;
        console.log(session, user);
        await googleSignIn(supabase).then(() => {
            alert('Signed in');
            window.location.href = '/register/thank-you';
        });
    };

    const handleSignOut = async () => {
        await signOut(supabase).then(() => {
            alert('Signed out');
            //window.location.href = '/';
        });
    };


    const fetchUser = async () => {
        let { user_metadata: { sub: googleId } } = session.user;
        try {
            const response = await axios.get(`http://localhost:5000/users/${googleId}`);
            setUserExists(true);
        } catch (error) {
            console.error('Error fetching user:', error.response.data);
            if (error.response.status === 404) {
                setUserExists(false);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, [session]);



    return (
        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow className='justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <MDBCol sm='12' md='6' className='text-center text-md-start'>
                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        Get <br />
                        <span style={{ color: 'hsl(131, 81%, 75%)' }}>Started</span>
                    </h1>
                    <p className='px-3' style={{ color: 'hsl(131, 81%, 85%)' }}>
                        Verify your account with Google.
                    </p>
                </MDBCol>
                <MDBCol sm='12' md='6' className='position-relative'>
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>
                    <MDBCard className='my-5 bg-glass p-5'>
                        {session ? (
                            <>
                                <MDBTypography tag="h2" className='fw-bold mb-4 text-center'>Welcome Back!</MDBTypography>
                                {userExists ?
                                    <>
                                        <MDBBtn color='success' className='w-100 mb-4' size='md' href='/register-event' block>
                                            Proceed To Events
                                        </MDBBtn>
                                    </>
                                    :
                                    <>
                                        <MDBBtn color='success' className='w-100 mb-4' size='md' href='/register/thank-you' block>
                                            Proceed To Registration
                                        </MDBBtn>
                                    </>
                                }

                                <MDBBtn color='bg-secondary shadow-1-strong' className='w-100 mb-4' size='md' onClick={handleSignOut} block>
                                    Sign Out
                                </MDBBtn>
                            </>
                        ) : (
                            <MDBCardBody className='p-5'>
                                <MDBTypography tag="h2" className='fw-bold mb-4 text-center'>Proceed With Google</MDBTypography>
                                <MDBRow className='mb-4'>
                                    <MDBCol className='d-flex justify-content-center'>
                                        <MDBCheckbox id='remember' name='remember' label='Remember me' defaultChecked />
                                    </MDBCol>
                                    <MDBCol>
                                        <a href='#!'>Forgot password?</a>
                                    </MDBCol>
                                </MDBRow>
                                <MDBBtn className='w-100 mb-4' size='md' onClick={handleSignIn} block>
                                    Sign In
                                </MDBBtn>
                            </MDBCardBody>
                        )}
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default AccountLogin;
