import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (file: File) => void;
}
export default function ChangePhotoModal({
  isOpen,
  onClose,
  onSave
}: ChangePhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleSave = () => {
    if (selectedFile && onSave) {
      onSave(selectedFile);
    }
    handleClose();
  };
  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };
  return <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Change Profile Photo</DialogTitle>
          
        </DialogHeader>
        
        <div className="space-y-6">
          <div className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-base">
                  <span className="text-primary cursor-pointer hover:underline">
                    Click to upload
                  </span>
                  {' '}or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG or JPG (max. 3MB)
                </p>
              </div>
            </div>
          </div>

          {selectedFile && <div className="text-sm text-center p-3 bg-muted rounded-lg">
              Selected: {selectedFile.name}
            </div>}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedFile} className="disabled:opacity-50">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
}