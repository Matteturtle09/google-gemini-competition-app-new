import firebaseApp from "../config";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default async function getDocument(collection, id) {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try {
        result = await getDoc(docRef)
    } catch (e) {
        error = e;
    }

    return {result,error};
}