/* UploadPage.jsx */
import { useState, useRef, useEffect } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import { courseStyles } from '../config/courseStyles';
import useAuth from '../hooks/useAuth';
import { useUppy } from '../hooks/useUppy';
import { supabase } from '../lib/supabase';

/* ------------------------------------------------------------------ */
/* 1. constants                                                        */
/* ------------------------------------------------------------------ */

const UPPY_VERSION = '3.3.1';
const UPPY_CSS = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.css`;
const UPPY_JS  = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.js`;
const UPLOAD_FUNCTION_ENDPOINT = process.env.REACT_APP_UPLOAD_FUNCTION_ENDPOINT;

// Add error checking for required environment variable
if (!UPLOAD_FUNCTION_ENDPOINT) {
  console.error('Missing upload function endpoint configuration. Please check your environment setup.');
}

/* ------------------------------------------------------------------ */
/* 2. component                                                        */
/* ------------------------------------------------------------------ */

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isTutor, setIsTutor] = useState(false);
  const [isCheckingTutor, setIsCheckingTutor] = useState(true);
  const courseTypeRef = useRef(localStorage.getItem('courseType') || 'cs');
  const auth = useAuth();
  const styles = courseStyles[courseTypeRef.current] || courseStyles.cs;
  
  const { uppyRef, dashRef, progress, uploading, startUpload } = useUppy(auth);

  useEffect(() => {
    const checkTutorStatus = async () => {
      console.log('Checking tutor status...');
      setIsCheckingTutor(true);
      
      if (!auth.session) {
        console.log('No auth session, setting isTutor to false');
        setIsTutor(false);
        setIsCheckingTutor(false);
        return;
      }

      try {
        console.log('Making RPC call to check tutor status...');
        const { data, error } = await supabase.rpc('is_tutor_and_id', {
          p_user_id: auth.session.user.id
        });

        if (error) {
          console.error('Error checking tutor status:', error);
          setIsTutor(false);
        } else {
          console.log('Tutor status result:', data);
          // Access the is_tutor property from the first object in the array
          const isTutorResult = data?.[0]?.is_tutor ?? false;
          setIsTutor(isTutorResult);
        }
      } catch (err) {
        console.error('Exception checking tutor status:', err);
        setIsTutor(false);
      } finally {
        setIsCheckingTutor(false);
      }
    };

    checkTutorStatus();
  }, [auth.session]);

  const handleUpload = async () => {
    await startUpload(title, description, courseTypeRef.current);
    if (!uploading) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      <Navbar courseType={courseTypeRef.current} />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className={`text-4xl font-bold mb-8 text-center ${styles.textColor}`}>
          העלאת סרטוני לימוד
        </h1>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border">
            <CardHeader className={`bg-gradient-to-r ${styles.cardBg} text-white rounded-t-lg`}>
              <CardTitle className="text-xl md:text-2xl">העלה סרטון חדש</CardTitle>
              <CardDescription className="text-white/90">
                העלה סרטוני לימוד לשיתוף עם הקהילה
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {!auth.session && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Info className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold">עליך להתחבר כדי להעלות סרטונים</p>
                    <p className="text-red-700 text-sm mt-1">לחץ על כפתור ההתחברות בתפריט העליון</p>
                  </div>
                </div>
              )}

              {auth.session && !isCheckingTutor && !isTutor && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Info className="text-yellow-500 shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-semibold">רק מורים יכולים להעלות סרטונים</p>
                    <p className="text-yellow-700 text-sm mt-1">אנא צור קשר עם מנהל המערכת לקבלת הרשאות מורה</p>
                  </div>
                </div>
              )}

              {/* title / description inputs */}
              <LabeledInput
                id="videoTitle"
                label="כותרת הסרטון *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="הזן כותרת לסרטון"
                disabled={!auth.session}
              />
              <LabeledTextarea
                id="videoDescription"
                label="תיאור הסרטון"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="תאר במה עוסק הסרטון (לא חובה)"
                disabled={!auth.session}
              />

              {/* uppy dashboard */}
              <div ref={dashRef} />

              <Button
                className={styles.buttonPrimary}
                onClick={handleUpload}
                disabled={uploading || !auth.session || isCheckingTutor || !isTutor || !title.trim() || !uppyRef.current?.getFiles().length}
              >
                {uploading ? 'מעלה...' : 
                 !auth.session ? 'יש להתחבר תחילה' : 
                 isCheckingTutor ? 'בודק הרשאות...' :
                 !isTutor ? 'אין הרשאת מורה' : 
                 'העלה סרטון'}
              </Button>

              {uploading && <ProgressBar percent={progress} styles={styles} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ id, label, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...rest}
      />
    </div>
  );
}

function LabeledTextarea({ id, label, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...rest}
      />
    </div>
  );
}

function ProgressBar({ percent, styles }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>מעלה סרטון...</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${styles.buttonPrimary}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
