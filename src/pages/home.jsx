import React, { useEffect, useState } from 'react';
import { getAbsentTeachers } from './firebaseFunctions';

export default function Homef() {
    const [absentTeachers, setAbsentTeachers] = useState([]);

    useEffect(() => {
        async function fetchAbsentTeachers() {
            const absentTeachersData = await getAbsentTeachers();
            setAbsentTeachers(absentTeachersData);
        }
        fetchAbsentTeachers();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className='text-5xl font-bold mb-10'>Absent Teachers</h1>
            <div>
                {absentTeachers.length === 0 ? (
                    <p>No absent teachers</p>
                ) : (
                    <ul>
                        {absentTeachers.map((teacher, index) => (
                            <li key={index}>{teacher}</li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
