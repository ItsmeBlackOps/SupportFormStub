import React from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from './Modal';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <Modal isOpen={true} onClose={() => {}} title="">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        <p className="text-gray-900">Analyzing image...</p>
      </div>
    </Modal>
  );
}