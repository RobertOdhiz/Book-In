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
        alert('Account setup successful');
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

    console.log('create calendar event', event);

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
        console.log(data);
    });
}

const eventEndTime = (dateTimeStr, duration) => {
    const date = new Date(dateTimeStr);
    const [hr, min] = duration.split(':').map(Number);
    date.setHours(date.getHours() + hr);
    date.setMinutes(date.getMinutes() + min);
    console.log(date);
    return date.toISOString();
}