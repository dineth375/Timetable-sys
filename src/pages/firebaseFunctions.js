import { collection, getDocs, setDoc, doc} from 'firebase/firestore';
import { firestore } from "../firebase";

export async function getTeachersInPresentTeachers() {
    const presentTeachersRef = collection(firestore, "Timetable-sys", "Teachers", "Present Teachers");
    const querySnapshot = await getDocs(presentTeachersRef);
    return querySnapshot.docs.map(doc => doc.id);
}

export async function getTeachersInTeachersDatabase() {
    const teachersDatabaseRef = collection(firestore, "Timetable-sys", "Teachers", "Teachers Database");
    const querySnapshot = await getDocs(teachersDatabaseRef);
    return querySnapshot.docs.map(doc => doc.id);
}

export async function addAbsentTeachers() {
    const presentTeachers = await getTeachersInPresentTeachers();
    const teachersDatabase = await getTeachersInTeachersDatabase();

    // Filter out teachers who are present from the teachers database
    const absentTeachers = teachersDatabase.filter(teacher => !presentTeachers.includes(teacher));

    // Add absent teachers to the Absent Teachers collection using teacher names as document IDs
    const absentTeachersRef = collection(firestore, "Timetable-sys", "Teachers", "Absent Teachers");

    await Promise.all(absentTeachers.map(async teacher => {
        const teacherDocRef = doc(absentTeachersRef, teacher);
        await setDoc(teacherDocRef, { Name: teacher });
    }));

    console.log("Absent teachers added successfully.");
}

export async function getAbsentTeachers() {
    const absentTeachersRef = collection(firestore, "Timetable-sys", "Teachers", "Absent Teachers");
    const querySnapshot = await getDocs(absentTeachersRef);
    return querySnapshot.docs.map(doc => doc.id);
}
