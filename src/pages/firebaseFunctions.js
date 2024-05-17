import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
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
  const presentTeachersArray = await getTeachersInPresentTeachers();
  const presentTeachersSet = new Set(presentTeachersArray);
  const teachersDatabase = await getTeachersInTeachersDatabase();

  const absentTeachers = teachersDatabase.filter(teacher => !presentTeachersSet.has(teacher));

  const absentTeachersRef = collection(firestore, "Timetable-sys", "Teachers", "Absent Teachers");

  // Get existing absent teachers
  const existingAbsentTeachersSnapshot = await getDocs(absentTeachersRef);
  const existingAbsentTeachersSet = new Set(existingAbsentTeachersSnapshot.docs.map(doc => doc.id));

  // 1. Delete teachers who are no longer absent
  const teachersToDelete = [...existingAbsentTeachersSet].filter(teacher => !absentTeachers.includes(teacher));
  await Promise.all(teachersToDelete.map(async teacher => {
    const teacherDocRef = doc(absentTeachersRef, teacher);
    await deleteDoc(teacherDocRef);
  }));

  // 2. Add new absent teachers
  const teachersToAdd = absentTeachers.filter(teacher => !existingAbsentTeachersSet.has(teacher));
  await Promise.all(teachersToAdd.map(async teacher => {
    const teacherDocRef = doc(absentTeachersRef, teacher);
    await setDoc(teacherDocRef, { Name: teacher });
  }));

  console.log("Absent teachers updated successfully.");
}

export async function getAbsentTeachers() {
    const absentTeachersRef = collection(firestore, "Timetable-sys", "Teachers", "Absent Teachers");
    const querySnapshot = await getDocs(absentTeachersRef);
    return querySnapshot.docs.map(doc => doc.id);
}
export async function getAffectedPeriods() {
  const absentTeachers = await getAbsentTeachers();
  const affectedPeriods = {};

  // Fetch all class data in parallel
  const classPromises = [];
  for (let classNumber = 1; classNumber <= 12; classNumber++) {
    const classRef = collection(firestore, "Timetable-sys", "Classes", `Class ${classNumber}`);
    classPromises.push(getDocs(classRef));
  }

  const classSnapshots = await Promise.all(classPromises);

  // Process each class data
  classSnapshots.forEach((classSnapshot, classIndex) => {
    const className = `Class ${classIndex + 1}`;
    const periodsInClass = []; // Store affected periods for this class

    classSnapshot.docs.forEach(periodDoc => {
      const periodData = periodDoc.data();
      if (absentTeachers.includes(periodData.Teacher)) {
        periodsInClass.push(periodDoc.id); 
      }
    });

    // Only add the class to affectedPeriods if there are affected periods
    if (periodsInClass.length > 0) { 
      affectedPeriods[className] = periodsInClass;
    } 
  });

  return affectedPeriods;
}