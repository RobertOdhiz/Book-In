export async function googleSignIn(supabase) {
    const { err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            scopes: 'https://www.googleapis.com/auth/calendar'// calendar api
        }
    });
    if (err) {
        alert('Error while logging in to google provider with supabase');
        console.error(err);
    } else {
        alert('Google Auth success');
        window.location.href = '/register/thank-you';
    };
}

export async function signOut(supabase) {
    await supabase.auth.signOut();
}

export async function createCalendarEvent(session, eventTitle, eventDescription, eventDateTime, eventDuration) {
    const event = {
        'summary': eventTitle,
        'description': eventDescription,
        'start': {
            'dateTime': eventDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'end': {
            'dateTime': eventEndTime(eventDateTime.toISOString(), eventDuration),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
    }


    await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + session.provider_token
        },
        body: JSON.stringify(event)
    }).then((data) => {
        return data.json();
    }).then((data) => {
        alert('Checkout your google calendar for the event');
        //console.log(data);
    }).catch((error) => {
        console.error('Error creating calendar event:', error);
    });
}

export async function getCalendarEvent(session) {
    try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + session.provider_token,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data.items);
        // console.log(data);
        const events = data.items.map((event) => {
            // console.log(Object.keys(event));
            const obj = {
                eventName: event.summary,
                description: event.description || 'No description available',
                startTime: event.start.dateTime || event.start.date,
                endTime: event.end.dateTime || event.end.date,
                user: session.user.email
            }
            return obj;
        });
        return events || [];
    } catch (error) {
        console.error('Error fetching calendar events:', error);
    }
}

const eventEndTime = (dateTimeStr, duration) => {
    const date = new Date(dateTimeStr);
    const [hr, min] = duration.split(':').map(Number);
    date.setHours(date.getHours() + hr);
    date.setMinutes(date.getMinutes() + min);
    console.log(date);
    return date.toISOString();
}