
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, UserPlus, History, LayoutDashboard, Search, Bell, CheckCircle, AlertCircle, DollarSign, LogOut } from 'lucide-react';
import { Student, AttendanceLog, PackageSize } from './types';
import StudentCard from './components/StudentCard';
import AddStudentForm from './components/AddStudentForm';
import LogList from './components/LogList';
import StudentHistoryModal from './components/StudentHistoryModal';
import ConfirmModal from './components/ConfirmModal';

const CYCLE_DAYS = 20;

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs'>('dashboard');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingHistoryStudentId, setViewingHistoryStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para o modal de confirmação
  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  useEffect(() => {
    const savedStudents = localStorage.getItem('pt_students');
    const savedLogs = localStorage.getItem('pt_logs');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('pt_students', JSON.stringify(students));
    localStorage.setItem('pt_logs', JSON.stringify(logs));
  }, [students, logs]);

  const addStudent = (name: string, contractedPackage: PackageSize) => {
    const today = new Date();
    const expiration = new Date();
    expiration.setDate(today.getDate() + CYCLE_DAYS);

    const newStudent: Student = {
      id: generateId(),
      name,
      contractedPackage,
      lessonBalance: contractedPackage,
      lastPaymentDate: today.toISOString(),
      cycleExpiration: expiration.toISOString(),
    };

    setStudents(prev => [...prev, newStudent]);
    
    const log: AttendanceLog = {
      id: generateId(),
      timestamp: today.toISOString(),
      studentId: newStudent.id,
      studentName: newStudent.name,
      action: 'DEPOSIT',
      adjustment: contractedPackage,
    };
    setLogs(prev => [log, ...prev]);
    setShowAddForm(false);
  };

  const updateStudent = (id: string, name: string, contractedPackage: PackageSize) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, name, contractedPackage } : s));
    setLogs(prev => prev.map(l => l.studentId === id ? { ...l, studentName: name } : l));
    setEditingStudent(null);
  };

  // Função disparada pelo botão de excluir aluno
  const requestDeleteStudent = useCallback((studentId: string) => {
    setConfirmState({
      title: 'EXCLUIR ALUNO',
      message: 'ATENÇÃO: Todos os registros e o saldo deste aluno serão apagados permanentemente.',
      action: () => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setLogs(prev => prev.filter(l => l.studentId !== studentId));
        if (viewingHistoryStudentId === studentId) {
          setViewingHistoryStudentId(null);
        }
        setConfirmState(null);
      }
    });
  }, [viewingHistoryStudentId]);

  const handleCheckIn = (studentId: string) => {
    const now = new Date().toISOString();
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updated = { ...s, lessonBalance: s.lessonBalance - 1 };
        const log: AttendanceLog = {
          id: generateId(),
          timestamp: now,
          studentId: s.id,
          studentName: s.name,
          action: 'CHECK_IN',
          adjustment: -1,
        };
        setLogs(prevLogs => [log, ...prevLogs]);
        return updated;
      }
      return s;
    }));
  };

  const handleDeposit = (studentId: string, amount: number) => {
    const today = new Date();
    const expiration = new Date();
    expiration.setDate(today.getDate() + CYCLE_DAYS);

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updated = { 
          ...s, 
          lessonBalance: s.lessonBalance + amount,
          lastPaymentDate: today.toISOString(),
          cycleExpiration: expiration.toISOString()
        };
        const log: AttendanceLog = {
          id: generateId(),
          timestamp: today.toISOString(),
          studentId: s.id,
          studentName: s.name,
          action: 'DEPOSIT',
          adjustment: amount,
        };
        setLogs(prevLogs => [log, ...prevLogs]);
        return updated;
      }
      return s;
    }));
  };

  // Função disparada pelo botão de estornar log
  const requestDeleteLog = useCallback((logId: string) => {
    const logToCancel = logs.find(l => l.id === logId);
    if (!logToCancel) return;

    setConfirmState({
      title: 'ESTORNAR REGISTRO',
      message: 'O saldo do aluno será corrigido e este registro será removido do histórico.',
      action: () => {
        setStudents(prev => prev.map(s => 
          s.id === logToCancel.studentId 
            ? { ...s, lessonBalance: s.lessonBalance - logToCancel.adjustment }
            : s
        ));
        setLogs(prev => prev.filter(l => l.id !== logId));
        setConfirmState(null);
      }
    });
  }, [logs]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

  const viewingStudent = useMemo(() => {
    return students.find(s => s.id === viewingHistoryStudentId) || null;
  }, [students, viewingHistoryStudentId]);

  const stats = useMemo(() => {
    const overdue = students.filter(s => s.lessonBalance <= 0 || new Date(s.cycleExpiration) < new Date()).length;
    return {
      total: students.length,
      overdue,
      active: students.length - overdue
    };
  }, [students]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64 transition-all bg-wes-bg">
      <nav className="fixed bottom-0 left-0 w-full md:top-0 md:h-full md:w-64 bg-white border-t md:border-t-0 md:border-r border-wes-greyLight z-50 flex md:flex-col items-center py-2 md:py-8 px-4 justify-around md:justify-start gap-4 print:hidden">
        <div className="hidden md:flex flex-col items-center gap-1 mb-12 px-2 w-full">
           <div className="p-4 mb-2 w-full flex flex-col items-center">
              <div className="font-bebas text-4xl leading-none flex items-center">
                <span className="text-wes-dark">WES</span>
                <span className="text-wes-greyMid">MENEZES</span>
              </div>
              <div className="text-[8px] font-bold text-wes-greyMid tracking-[0.3em] uppercase mt-1">
                Treinamento Personalizado
              </div>
           </div>
        </div>
        
        <button 
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-6 py-4 md:w-[90%] rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-white bg-wes-cyan shadow-lg shadow-wes-cyan/30' : 'text-wes-greyMid hover:bg-wes-greyLight/50'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Painel</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-6 py-4 md:w-[90%] rounded-xl transition-all ${activeTab === 'logs' ? 'text-white bg-wes-cyan shadow-lg shadow-wes-cyan/30' : 'text-wes-greyMid hover:bg-wes-greyLight/50'}`}
        >
          <History size={20} />
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Atividades</span>
        </button>

        <div className="md:mt-auto md:w-full px-2">
          <button 
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 px-4 py-4 md:w-full rounded-xl bg-wes-dark text-white hover:bg-black transition-all shadow-xl shadow-wes-dark/20"
          >
            <UserPlus size={20} />
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">Novo Aluno</span>
          </button>
        </div>
      </nav>

      <main className="p-4 md:p-10 max-w-7xl mx-auto print:hidden">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-bebas tracking-tight flex items-center gap-2">
              <span className="text-wes-dark">{activeTab === 'dashboard' ? 'GERENCIAMENTO' : 'HISTÓRICO'}</span>
              <span className="text-wes-greyMid">{activeTab === 'dashboard' ? 'GERAL' : 'DE ATIVIDADES'}</span>
            </h1>
            <div className="h-1.5 w-20 bg-wes-cyan mt-2"></div>
          </div>
          
          {activeTab === 'dashboard' && (
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wes-greyMid" size={20} />
              <input 
                type="text" 
                placeholder="BUSCAR ALUNO..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-wes-greyLight rounded-xl focus:outline-none focus:ring-4 focus:ring-wes-cyan/10 focus:border-wes-cyan transition-all shadow-sm font-bold text-sm tracking-widest"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </header>

        {activeTab === 'dashboard' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl border border-wes-greyLight shadow-sm flex items-center gap-6">
                <div className="bg-wes-greyLight/30 p-4 rounded-xl text-wes-dark"><UserPlus size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-wes-greyMid uppercase tracking-[0.2em]">Cadastrados</p>
                  <p className="text-4xl font-bebas text-wes-dark leading-none mt-1">{stats.total}</p>
                </div>
              </div>
              <div className="bg-wes-cyan text-white p-8 rounded-2xl shadow-xl shadow-wes-cyan/20 flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-xl"><CheckCircle size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Ativos</p>
                  <p className="text-4xl font-bebas leading-none mt-1">{stats.active}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-wes-greyLight shadow-sm flex items-center gap-6">
                <div className="bg-red-50 p-4 rounded-xl text-red-500"><AlertCircle size={28} /></div>
                <div>
                  <p className="text-[10px] font-black text-wes-greyMid uppercase tracking-[0.2em]">Pendentes</p>
                  <p className="text-4xl font-bebas text-red-500 leading-none mt-1">{stats.overdue}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStudents.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onCheckIn={handleCheckIn}
                  onDeposit={handleDeposit}
                  onViewHistory={(s) => setViewingHistoryStudentId(s.id)}
                  onDelete={requestDeleteStudent}
                  onEdit={(s) => setEditingStudent(s)}
                />
              ))}
              {filteredStudents.length === 0 && (
                <div className="col-span-full bg-white rounded-3xl p-24 text-center border-2 border-dashed border-wes-greyLight">
                  <Search className="mx-auto w-16 h-16 text-wes-greyLight mb-6" />
                  <h3 className="text-2xl font-bebas text-wes-greyMid">NENHUM ALUNO ENCONTRADO</h3>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            <LogList logs={logs} onDeleteLog={requestDeleteLog} />
          </div>
        )}
      </main>

      {/* Modal de Confirmação Customizado */}
      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.action}
          onCancel={() => setConfirmState(null)}
        />
      )}

      {(showAddForm || editingStudent) && (
        <div className="fixed inset-0 bg-wes-dark/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 border border-wes-greyLight">
            <AddStudentForm 
              student={editingStudent || undefined}
              onClose={() => { setShowAddForm(false); setEditingStudent(null); }} 
              onSubmit={(name, size) => editingStudent ? updateStudent(editingStudent.id, name, size) : addStudent(name, size)} 
            />
          </div>
        </div>
      )}

      {viewingStudent && (
        <div className="fixed inset-0 bg-wes-dark/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:p-0 print:bg-white print:relative print:z-0">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl animate-in fade-in zoom-in duration-300 print:shadow-none print:w-full print:max-w-none print:rounded-none overflow-hidden">
            <StudentHistoryModal 
              student={viewingStudent}
              logs={logs}
              onClose={() => setViewingHistoryStudentId(null)}
              onDeleteLog={requestDeleteLog}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
