// hooks/useFirestore.ts
import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  QuerySnapshot,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function useFirestore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocument = async (
    collectionName: string,
    data: any
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, data);
      setLoading(false);
      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };


const getEquipo = async (): Promise<DocumentData[] | null> => {
  setLoading(true);
  setError(null);
  try {
    const colRef = collection(db, "equipo");
    // Ordena los documentos por el campo 'fechaRegistro' de manera ascendente
    const snapshot = await getDocs(query(colRef, orderBy("fechaRegistro")));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLoading(false);
    return data;
  } catch (err: any) {
    setError(err.message);
    setLoading(false);
    return null;
  }
};


  return {
    addDocument,
    getEquipo,
    
    loading,
    error,
  };
}
