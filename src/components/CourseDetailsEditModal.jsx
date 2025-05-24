import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Save, X, ImagePlus } from 'lucide-react';
import { courseStyles } from '../config/courseStyles';
import { showNotification } from '../components/ui/notification';

// Function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract the base64 data without the prefix (e.g., "data:image/jpeg;base64,")
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function CourseDetailsEditModal({ 
  open, 
  onOpenChange, 
  courseData,
  onSave,
  courseType = 'cs'
}) {
  const [editedData, setEditedData] = useState({
    title: '',
    description: '',
    price: 0,
    salePrice: '',
    thumbnailUrl: '',
    status: 'draft',
    on_sale_expiration: null
  });

  // Update state when courseData changes or modal opens
  useEffect(() => {
    if (open && courseData) {
      setEditedData({
        title: courseData.title || '',
        description: courseData.description || '',
        price: courseData.price || 0,
        salePrice: courseData.salePrice || '',
        thumbnailUrl: courseData.thumbnailUrl || '',
        status: courseData.status || 'draft',
        on_sale_expiration: courseData.on_sale_expiration || null
      });
      setThumbnailPreview(courseData.thumbnailUrl);
    }
  }, [open, courseData]);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  // Add validation state
  const [showError, setShowError] = useState(false);

  const styles = courseStyles[courseType] || courseStyles.cs;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Set the file
      setThumbnail(file);
      
      // Create and set preview URL
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview); // Clean up previous preview
      }
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } catch (err) {
      console.error('Error handling thumbnail selection:', err);
      showNotification('שגיאה בבחירת התמונה', 'error');
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    if (thumbnailPreview && thumbnailPreview !== courseData.thumbnailUrl) {
      URL.revokeObjectURL(thumbnailPreview); // Clean up the preview URL
    }
    setThumbnailPreview(null);
    setEditedData(prev => ({
      ...prev,
      thumbnailUrl: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploadingThumbnail(true);

    try {
      let finalData = { ...editedData };

      // If there's a new thumbnail, convert it to base64 and include it
      if (thumbnail) {
        const fileBase64 = await fileToBase64(thumbnail);
        finalData.thumbnail = {
          fileBase64,
          fileName: thumbnail.name,
          fileType: thumbnail.type
        };
      }

      await onSave(finalData);
    } catch (err) {
      console.error('Error saving course details:', err);
      showNotification('שגיאה בשמירת פרטי הקורס', 'error');
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>עריכת פרטי קורס</DialogTitle>
          <DialogDescription>ערוך את פרטי הקורס הבסיסיים</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium mb-1">כותרת הקורס</label>
            <input
              type="text"
              name="title"
              value={editedData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Course Description */}
          <div>
            <label className="block text-sm font-medium mb-1">תיאור הקורס</label>
            <textarea
              name="description"
              value={editedData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Course Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">מחיר</label>
              <input
                type="number"
                name="price"
                value={editedData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">מחיר מבצע (אופציונלי)</label>
              <input
                type="number"
                name="salePrice"
                value={editedData.salePrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
              />
            </div>
          </div>

          {/* Sale Expiration Date */}
          {editedData.salePrice && (
            <div>
              <label className="block text-sm font-medium mb-1">תאריך סיום המבצע (אופציונלי)</label>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  name="on_sale_expiration"
                  value={editedData.on_sale_expiration ? new Date(editedData.on_sale_expiration).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                    setEditedData(prev => ({
                      ...prev,
                      on_sale_expiration: date
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditedData(prev => ({
                    ...prev,
                    on_sale_expiration: null
                  }))}
                  className="whitespace-nowrap"
                >
                  <X className="h-4 w-4 ml-1" />
                  נקה תאריך
                </Button>
              </div>
            </div>
          )}

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              תמונה ממוזערת
              <span className="text-red-500">*</span>
            </label>
            <div className={`mt-2 ${showError && !thumbnailPreview ? 'ring-2 ring-red-500 rounded-md' : ''}`}>
              {thumbnailPreview ? (
                <div className="relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Course thumbnail" 
                    className="w-full aspect-video object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center border-2 ${showError ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md p-8 bg-gray-50`}>
                  <ImagePlus className={`h-12 w-12 mb-3 ${showError ? 'text-red-400' : 'text-gray-400'}`} />
                  <p className={`text-sm text-center mb-4 ${showError ? 'text-red-500' : 'text-gray-500'}`}>
                    העלה תמונה לקורס שלך
                  </p>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    disabled={isUploadingThumbnail}
                  />
                  <label
                    htmlFor="thumbnail"
                    className={`px-4 py-2 rounded-md text-white cursor-pointer ${isUploadingThumbnail ? 'bg-gray-400' : styles.buttonPrimary}`}
                  >
                    {isUploadingThumbnail ? (
                      <span className="flex items-center">
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full"></div>
                        מעלה...
                      </span>
                    ) : 'בחר תמונה'}
                  </label>
                </div>
              )}
              {showError && !thumbnailPreview && (
                <p className="text-red-500 text-sm mt-1">נא להעלות תמונה לקורס</p>
              )}
              <p className="text-xs text-gray-500 mt-2">מומלץ: תמונה ביחס 16:9. גודל מומלץ: 1280x720</p>
            </div>
          </div>

          {/* Course Status */}
          <div>
            <label className="block text-sm font-medium mb-1">סטטוס</label>
            <select
              name="status"
              value={editedData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="draft">טיוטה</option>
              <option value="published">פורסם</option>
            </select>
          </div>
        </form>

        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 ml-1" />
            ביטול
          </Button>
          <Button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              
              // Check if we have either a new thumbnail or an existing one
              if (!thumbnail && !thumbnailPreview) {
                setShowError(true);
                showNotification('נא להעלות תמונה לקורס', 'warning');
                return;
              }

              try {
                const finalData = { 
                  ...editedData,
                  previewUrl: thumbnailPreview // Pass the preview URL back
                };

                // If there's a new thumbnail, add its data in the format expected by the edge function
                if (thumbnail) {
                  const base64Data = await fileToBase64(thumbnail);
                  finalData.fileBase64 = base64Data;
                  finalData.fileName = thumbnail.name;
                  finalData.fileType = thumbnail.type;
                }

                onSave(finalData);
                onOpenChange(false);
              } catch (err) {
                console.error('Error preparing data:', err);
                showNotification('שגיאה בהכנת הנתונים', 'error');
              }
            }}
            className={styles.buttonPrimary}
            disabled={!thumbnail && !thumbnailPreview}
          >
            אישור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 