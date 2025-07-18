import { getApps, initializeApp, cert } from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore"
import {getAuth} from 'firebase-admin/auth'
import { fi } from "zod/v4/locales";
import * as serviceAcccount from './serviceAccountKey.json';

const initFirebaseAdmin = () => {
    const apps = getApps();

    const firebase_id= process.env.FIREBASE_PROJECT_ID;
    const firebase_client_email= process.env.FIREBASE_CLIENT_EMAIL;
    const firebase_private_key= process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if(!apps.length) {
            initializeApp({
    credential: cert({
        projectId: firebase_id,
        clientEmail: firebase_client_email,
        privateKey: firebase_private_key,
    }),
    });

    }
    return {
        auth: getAuth(),
        db: getFirestore()
    }
}

export const {auth, db} = initFirebaseAdmin()