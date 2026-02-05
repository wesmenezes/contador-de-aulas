
import React, { useState, useEffect } from 'react';
import { X, User, Package, ChevronRight } from 'lucide-react';
import { Student, PackageSize } from '../types';

interface AddStudentFormProps {
  student?: Student;
  onClose: () => void;
  onSubmit: (name: string, contractedPackage: PackageSize) => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ student, onClose, onSubmit }) => {
  const [name, setName] = useState(student?.name || '');
  const [packageSize, setPackageSize] = useState<PackageSize>(student?.contractedPackage || 8);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setPackageSize(student.contractedPackage);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name, packageSize);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bebas text-wes-dark leading-none">
            {student ? 'EDITAR' : 'NOVO'} <span className="text-wes-greyMid">ALUNO</span>
          </h2>
          <div className="h-1.5 w-12 bg-wes-cyan mt-1"></div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-wes-bg rounded-xl text-wes-greyMid transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest">Nome do Aluno</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-wes-greyMid" size={18} />
            <input 
              autoFocus
              required
              type="text" 
              placeholder="Digite o nome completo..."
              className="w-full pl-12 pr-4 py-4 bg-wes-bg border border-wes-greyLight rounded-xl focus:outline-none focus:border-wes-cyan transition-all font-bold text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-wes-greyMid uppercase tracking-widest">Pacote Inicial / Renovação</label>
          <div className="grid grid-cols-5 gap-2">
            {[4, 8, 12, 16, 20].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setPackageSize(size as PackageSize)}
                className={`py-4 rounded-xl font-bebas text-xl transition-all border ${
                  packageSize === size 
                    ? 'bg-wes-cyan text-white border-wes-cyan shadow-lg shadow-wes-cyan/30' 
                    : 'bg-white text-wes-greyMid border-wes-greyLight hover:border-wes-cyan/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-wes-greyMid font-bold uppercase tracking-widest text-[10px] hover:bg-wes-bg rounded-xl transition-all border border-wes-greyLight"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-wes-dark text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-black transition-all shadow-xl shadow-wes-dark/20 flex items-center justify-center gap-3"
          >
            {student ? 'Salvar Alterações' : 'Cadastrar Aluno'}
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
