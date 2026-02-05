
import React, { useState } from 'react';
import { Calendar, CreditCard, ChevronRight, Check, AlertTriangle, PlusCircle, DollarSign, Clock, History, Trash2, MoreVertical, Edit2 } from 'lucide-react';
import { Student } from '../types';

interface StudentCardProps {
  student: Student;
  onCheckIn: (id: string) => void;
  onDeposit: (id: string, amount: number) => void;
  onViewHistory: (student: Student) => void;
  onDelete: (id: string) => void;
  onEdit: (student: Student) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onCheckIn, onDeposit, onViewHistory, onDelete, onEdit }) => {
  const [showDepositOptions, setShowDepositOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isExpired = new Date(student.cycleExpiration) < new Date();
  const isLowBalance = student.lessonBalance <= 0;
  const isOverdue = isExpired || isLowBalance;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className={`relative bg-white rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
      isOverdue ? 'border-red-400 ring-2 ring-red-50' : 'border-wes-greyLight hover:border-wes-cyan/50'
    }`}>
      {/* Header Info */}
      <div className={`px-5 py-3 flex justify-between items-center ${isOverdue ? 'bg-red-50' : 'bg-wes-greyLight/20'}`}>
        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
          isOverdue ? 'bg-red-500 text-white' : 'bg-wes-cyan text-white'
        }`}>
          {isOverdue ? 'Atenção / Vencido' : 'Situação Ok'}
        </span>
        
        <div className="relative">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 text-wes-greyMid hover:text-wes-dark hover:bg-wes-greyLight rounded-lg transition-all"
          >
            <MoreVertical size={18} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl z-20 py-2 border border-wes-greyLight">
                <button 
                  type="button"
                  onClick={() => { onEdit(student); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-wes-dark hover:bg-wes-bg transition-all flex items-center gap-3"
                >
                  <Edit2 size={14} className="text-wes-cyan" />
                  Editar Perfil
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    console.log('🗑️ Remover clicado', student.id);
                    onDelete(student.id);
                    setShowMenu(false);}}
                    //onDelete(student.id); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-3 border-t border-wes-greyLight/50"
                >
                  <Trash2 size={14} />
                  Remover Aluno
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-3xl font-bebas text-wes-dark tracking-tight leading-none mb-6">
          {student.name.split(' ')[0]} <span className="text-wes-greyMid">{student.name.split(' ').slice(1).join(' ')}</span>
        </h3>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-wes-bg rounded-xl border border-wes-greyLight/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLowBalance ? 'bg-red-100 text-red-600' : 'bg-wes-cyan/10 text-wes-cyan'}`}>
                <Check size={18} />
              </div>
              <span className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest">Aulas Restantes</span>
            </div>
            <span className={`text-4xl font-bebas ${isLowBalance ? 'text-red-500' : 'text-wes-dark'}`}>
              {student.lessonBalance}
            </span>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Clock className={isExpired ? 'text-red-500' : 'text-wes-greyMid'} size={16} />
              <span className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest">Vencimento</span>
            </div>
            <span className={`text-xs font-black ${isExpired ? 'text-red-500' : 'text-wes-dark'}`}>
              {formatDate(student.cycleExpiration)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button 
            type="button"
            onClick={() => onCheckIn(student.id)}
            className="w-full bg-wes-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-wes-dark/20"
          >
            Realizar Check-in
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => onViewHistory(student)}
              className="flex-1 bg-white border border-wes-greyLight text-wes-dark py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-wes-bg transition-all"
            >
              <History size={14} />
              Extrato
            </button>
            <button 
              type="button"
              onClick={() => setShowDepositOptions(!showDepositOptions)}
              className="flex-1 bg-wes-cyan text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-2 hover:bg-wes-blue transition-all shadow-md shadow-wes-cyan/20"
            >
              <PlusCircle size={14} />
              Recarregar
            </button>
          </div>

          {showDepositOptions && (
            <div className="mt-4 p-4 bg-wes-bg rounded-xl border border-wes-greyLight animate-in slide-in-from-top-2 duration-300">
              <p className="text-[9px] font-bold text-wes-greyMid uppercase tracking-[0.2em] mb-3 text-center">Selecionar Pacote de Aulas</p>
              <div className="grid grid-cols-5 gap-1.5">
                {[4, 8, 12, 16, 20].map(val => (
                  <button 
                    key={val}
                    onClick={() => { onDeposit(student.id, val); setShowDepositOptions(false); }}
                    className="h-10 flex items-center justify-center rounded-lg bg-white border border-wes-greyLight text-wes-dark font-bebas text-lg hover:bg-wes-cyan hover:text-white hover:border-wes-cyan transition-all"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
