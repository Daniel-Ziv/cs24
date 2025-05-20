import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export default function DeleteVideoModal({ open, onOpenChange, onConfirm, videoTitle }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>מחיקת סרטון</DialogTitle>
          <DialogDescription>
            האם אתה בטוח שברצונך למחוק את הסרטון "{videoTitle}"? פעולה זו תמחק את הסרטון לצמיתות ולא ניתן יהיה לשחזר אותו.
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