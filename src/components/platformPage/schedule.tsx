import React, { useCallback, useMemo, useState } from 'react';
import {
    Calendar,
    momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import * as dates from './zoom/date';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        },
    });

export default function Schedule({
    localizer = mLocalizer,
    events,
    ...props
}) {
    
    const [date, setDate] = useState(new Date())

    const onNavigate = useCallback((newDate) => setDate(newDate), [setDate])

    type CalendarView = 'month' | 'agenda' | 'week' | 'day';

    const [view, setView] = useState<CalendarView>('month');

    const { components, max, views } = useMemo(
        () => ({
            components: {
                timeSlotWrapper: ColoredDateCellWrapper,
            },
            max: dates.add(dates.endOf(new Date(), 'day'), 1, 'day'),
            views: {
                month: true,
                week: true,
                day: true,
                agenda: true,
            },
        }),
        []
    );

    return (
        <div className="height600" {...props}>
            <Calendar
                components={components}
                date={date}
                events={events}
                length={events.length}
                localizer={localizer}
                max={max}
                selectable={true}
                step={60}
                views={views}
                style={{ height: 600 }}
                onView={(view: CalendarView) => {
                        setView(view);
                    }
                }
                onNavigate={onNavigate}
                view={view}
                startAccessor={(event) => new Date(event.start)}
            />
        </div>
    );
}
