"use client";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import db, { auth } from "@/firebase";
import { errorMessage, successMessage } from "@/utils";
import { useRouter } from "next/navigation";

export default function OAuth() {
  const router = useRouter();

  const handleGoogleAuth = async () => {
    try {
      const auth = getAuth();

      // Google Auth Provider
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //   setCookie("currentUser", auth.currentUser, 10);

      // Check if there is a user, if not we add the details and save to the database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      // After the steps, directing user to the home page
      successMessage("authentication successful");
      router.push("/dashboard");
    } catch (err: any) {
      errorMessage(err.message);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
    >
      <FcGoogle className="text-2xl  bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}
