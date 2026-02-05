
import React from 'react';
import { X, FileText, Download, User, ArrowDownLeft, ArrowUpRight, Printer, Trash2, Calendar } from 'lucide-react';
import { Student, AttendanceLog } from '../types';

interface StudentHistoryModalProps {
  student: Student;
  logs: AttendanceLog[];
  onClose: () => void;
  onDeleteLog: (logId: string) => void;
}

const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({ student, logs, onClose, onDeleteLog }) => {
  const studentLogs = logs.filter(log => log.studentId === student.id);

  const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header Interativo */}
      <div className="px-8 py-6 border-b border-wes-greyLight flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-4xl font-bebas text-wes-dark leading-none">RELATÓRIO <span className="text-wes-greyMid">DETALHADO</span></h2>
          <p className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest mt-1">Aluno: {student.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => window.print()}
            className="px-6 py-3 bg-wes-cyan text-white hover:bg-wes-blue rounded-xl transition-all flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-wes-cyan/30"
          >
            <Printer size={16} />
            Imprimir
          </button>
          <button onClick={onClose} className="p-3 hover:bg-wes-bg rounded-xl text-wes-greyMid transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Conteúdo do Relatório */}
      <div className="flex-1 overflow-y-auto p-8 md:p-12 print:p-0">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Visual WesMenezes (Igual ao logo) */}
          <div className="flex flex-col items-center mb-16 text-center">
             <div className="font-bebas text-6xl leading-none flex items-center">
                <span className="text-wes-dark">WES</span>
                <span className="text-wes-greyMid">MENEZES</span>
              </div>
              <div className="text-xs font-bold text-wes-greyMid tracking-[0.5em] uppercase mt-2 border-t border-wes-greyLight pt-2 px-4">
                Treinamento Personalizado
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-wes-bg p-8 rounded-2xl border border-wes-greyLight">
              <p className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest mb-4">Informações do Aluno</p>
              <h3 className="text-3xl font-bebas text-wes-dark leading-none mb-2">{student.name}</h3>
              <div className="flex items-center gap-2 text-wes-greyMid">
                <Calendar size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Ciclo expira em: {new Date(student.cycleExpiration).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="bg-wes-dark p-8 rounded-2xl shadow-xl shadow-wes-dark/20 text-white flex flex-col justify-center">
              <p className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest mb-2">Saldo Atual</p>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-bebas leading-none">{student.lessonBalance}</span>
                <span className="text-wes-cyan font-bebas text-2xl pb-1">AULAS</span>
              </div>
            </div>
          </div>

          {/* Tabela de Logs */}
          <div className="bg-white border border-wes-greyLight rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-wes-bg border-b border-wes-greyLight">
                <tr>
                  <th className="px-6 py-4 font-bold text-wes-dark uppercase tracking-widest text-[9px]">Data / Hora</th>
                  <th className="px-6 py-4 font-bold text-wes-dark uppercase tracking-widest text-[9px]">Atividade</th>
                  <th className="px-6 py-4 font-bold text-wes-dark uppercase tracking-widest text-[9px] text-right">Crédito</th>
                  <th className="px-6 py-4 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wes-greyLight">
                {studentLogs.length > 0 ? (
                  studentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-wes-bg/50 transition-colors">
                      <td className="px-6 py-4 text-wes-greyMid font-medium">{formatDate(log.timestamp)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {log.action === 'CHECK_IN' ? (
                            <ArrowDownLeft size={16} className="text-wes-dark" />
                          ) : (
                            <ArrowUpRight size={16} className="text-wes-cyan" />
                          )}
                          <span className="font-bold text-wes-dark uppercase tracking-wider text-[10px]">
                            {log.action === 'CHECK_IN' ? 'Aula Realizada' : 'Pacote Adquirido'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-bebas ${log.adjustment < 0 ? 'text-wes-dark' : 'text-wes-cyan'}`}>
                          {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right print:hidden">
                        <button 
                          onClick={() => onDeleteLog(log.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-wes-greyMid font-bold uppercase tracking-widest text-xs italic">
                      Nenhum registro encontrado para este ciclo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-16 text-center hidden print:block pt-8 border-t border-wes-greyLight">
             <div className="font-bebas text-2xl text-wes-dark">WESMENEZES <span className="text-wes-greyMid">TREINAMENTO PERSONALIZADO</span></div>
             <p className="text-[8px] font-bold text-wes-greyMid uppercase tracking-widest mt-1">Este documento é apenas para controle de crédito do aluno.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHistoryModal;
