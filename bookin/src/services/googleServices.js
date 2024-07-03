export async function googleSignIn(supabase) {
    try {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar',
            },
        });
        window.location.href = '/register/thank-you';
    } catch (error) {
        console.error('Error while logging in to Google provider with Supabase:', error);
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

    await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.provider_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    }).catch((error) => {
        console.error('Error creating calendar event:', error);
    });
}

export async function getCalendarEvent(session) {
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

const getEventEndTime = (dateTime, duration) => {
    const [hr, min] = duration.split(':').map(Number);
    const endTime = new Date(dateTime);
    endTime.setHours(endTime.getHours() + hr, endTime.getMinutes() + min);
    return endTime.toISOString();
};
