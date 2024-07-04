export async function googleSignIn(supabase) {
    try {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
            },
        })
        console.log('Login successful');

    } catch (error) {
        alert('Error while logging in to Google provider with Supabase');
    }
}

export async function signOut(supabase) {
    await supabase.auth.signOut();
}

export async function createCalendarEvent(session, eventTitle, eventDescription, eventDateTime, eventDuration) {
    const event = {
        summary: eventTitle,
        description: eventDescription,
        start: {
            dateTime: eventDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
            dateTime: getEventEndTime(eventDateTime, eventDuration),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    };

    let eventData = {};
    try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.provider_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        eventData = await response.json();
    } catch (error) {
        console.error('Error creating calendar event:', error);
        return null;
    }

    return eventData;
}

export async function getCalendarEvents(session) {
    try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.provider_token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data.items?.map((event) => ({
            eventId: event.id,
            eventName: event.summary,
            description: event.description || 'No description available',
            startTime: event.start.dateTime || event.start.date,
            endTime: event.end.dateTime || event.end.date,
            user: session.user.email,
        })) || [];
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
    }
}

export async function getCalendarEvent(session, eventId) {
    let event = {};
    try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session.provider_token}`,
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            console.log('event collected', response);
            event = response.json();
        })
    } catch (error) {
        console.error('Error fetching calendar event:', error);
    }

    return event;
}

const getEventEndTime = (dateTime, duration) => {
    if (!dateTime || !duration) {
        throw new RangeError('Invalid dateTime or duration');
    }

    const [hr, min] = duration.split(':').map(Number);
    if (isNaN(hr) || isNaN(min)) {
        throw new RangeError('Invalid duration format');
    }

    const endTime = new Date(dateTime);
    endTime.setHours(endTime.getHours() + hr);
    endTime.setMinutes(endTime.getMinutes() + min);

    if (isNaN(endTime.getTime())) {
        throw new RangeError('Invalid endTime calculation');
    }

    return endTime.toISOString();
};

