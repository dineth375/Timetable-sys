import React, { useEffect, useState } from 'react';
import { 
  getAbsentTeachers, 
  addAbsentTeachers, 
  getAffectedPeriods 
} from './firebaseFunctions';

export default function Homef() {
  const [absentTeachers, setAbsentTeachers] = useState([]);
  const [affectedPeriods, setAffectedPeriods] = useState({});

  useEffect(() => {
    async function fetchData() {
      await addAbsentTeachers();
      const absentTeachersData = await getAbsentTeachers();
      setAbsentTeachers(absentTeachersData);

      const affectedPeriodsData = await getAffectedPeriods();
      setAffectedPeriods(affectedPeriodsData);
    }
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className='text-5xl font-bold mb-10'>Absent Teachers</h1>
      <div>
        {absentTeachers.length === 0 ? (
          <p>No absent teachers</p>
        ) : (
          <>
            <ul>
              {absentTeachers.map((teacher, index) => (
                <li key={index}>{teacher}</li>
              ))}
            </ul>

            <h2 className='text-3xl font-bold mb-5 mt-10'>Affected Periods</h2>
            {Object.keys(affectedPeriods).map(className => (
              <div key={className}>
                <h3 className='text-xl font-bold'>{className}</h3>
                <ul>
                  {affectedPeriods[className].map((period, index) => (
                    <li key={index}>{period}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}