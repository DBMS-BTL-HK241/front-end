import React from 'react';
import { fetchAppointmentsCalendar } from '../../services/apiService';
import { Calendar, Badge, List, Stack } from 'rsuite';

function getTodoList(date) {
    if (!date) {
        return [];
    }
    const day = date.getDate();

    switch (day) {
        case 10:
            return [
                { time: '10:30 am', title: 'Meeting' },
                { time: '12:00 pm', title: 'Lunch' }
            ];
        case 15:
            return [
                { time: '09:30 am', title: 'Products Introduction Meeting' },
                { time: '12:30 pm', title: 'Client entertaining' },
                { time: '02:00 pm', title: 'Product design discussion' },
                { time: '05:00 pm', title: 'Product test and acceptance' },
                { time: '06:30 pm', title: 'Reporting' }
            ];
        default:
            return [];
    }
}

function renderCell(date) {
    const list = getTodoList(date);

    if (list.length) {
        return <Badge className="calendar-todo-item-badge" content={list.length} />;
    }

    return null;
}

const AppointmentsCalendar = () => {
    const [selectedDate, setSelectedDate] = React.useState(null);

    const handleSelect = date => {
        setSelectedDate(date);
    };

    return (
        <div className="mt-[100px]">
            <h1 className="text-2xl font-bold mb-4 text-center">Appointments Calendar</h1>
            <Stack direction="row" spacing={10} alignItems="flex-start" wrap>
                <Calendar
                    compact
                    renderCell={renderCell}
                    onSelect={handleSelect}
                />
                <TodoList date={selectedDate} />
            </Stack>
        </div>

    );
};

const TodoList = ({ date }) => {
    const list = getTodoList(date);

    if (!list.length) {
        return <div>No tasks for this day.</div>;
    }

    return (
        <List style={{ flex: 1 }} bordered>
            {list.map(item => (
                <List.Item key={item.time} index={item.time}>
                    <div>{item.time}</div>
                    <div>{item.title}</div>
                </List.Item>
            ))}
        </List>
    );
};

export default AppointmentsCalendar;
