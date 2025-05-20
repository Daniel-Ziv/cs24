import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export default function DeleteChapterModal({ open, onOpenChange, onConfirm, chapterTitle, uploadedVideosCount }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>מחיקת פרק</DialogTitle>
          <DialogDescription>
            האם אתה בטוח שברצונך למחוק את הפרק "{chapterTitle}"?
            {uploadedVideosCount > 0 && (
              <div className="mt-2 text-red-600">
                שים לב: פרק זה מכיל {uploadedVideosCount} סרטונים שכבר הועלו. מחיקת הפרק תמחק גם את כל הסרטונים שבתוכו לצמיתות.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            ביטול
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            מחיקה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 