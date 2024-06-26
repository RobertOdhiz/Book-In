import { Container, Row, Col, Image, Stack, Nav, NavLink } from 'react-bootstrap';
//import BookIn from './../assets/Gemini_Book-In_Logo.jpeg';

function Footer() {
  return (
    <footer className='main-footer'>
      <Container fluid>
        <Row className='border'>
          <Col className='mx-5'>
            <Stack>
              <Image
                src=''//{BookIn}
                alt='Company Logo'
                rounded
                width={150}
                height={150}
              />
              <h4>Book-In</h4>
            </Stack>
          </Col>
          <Col>
            <Nav className='flex-column fs-5'>
              Useful Links
              <NavLink href='/'>Products</NavLink>
              <NavLink href='#'>Resources</NavLink>
              <NavLink href='#'>About</NavLink>
              <NavLink href='#'>Sign In</NavLink>
            </Nav>
          </Col>
          <Col>
            <h4>Contact Us!</h4>
            <p>bookin@gmail.com</p>
            <p>Phone +(254) 701-2345</p>
          </Col>
        </Row>
      </Container>
      <p>© 2022. All Rights Reserved</p>
    </footer >
  )
}

export default Footer;