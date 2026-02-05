
import React from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-wes-dark/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-wes-greyLight animate-in zoom-in duration-300">
        <div className="bg-red-50 p-6 flex justify-center">
          <div className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-500/30">
            <AlertTriangle size={32} />
          </div>
        </div>
        
        <div className="p-8 text-center">
          <h3 className="text-3xl font-bebas text-wes-dark leading-none mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-xs font-bold text-wes-greyMid uppercase tracking-widest leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 bg-wes-bg flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-white border border-wes-greyLight text-wes-greyMid font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-wes-greyLight/20 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
