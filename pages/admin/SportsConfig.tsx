import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MOCK_SPORTS } from '../../services/mockData';
import { Plus, Edit2, Check, AlertTriangle } from 'lucide-react';
import { Sport } from '../../types';
import toast from 'react-hot-toast';

export const SportsConfig = () => {
  const [sports, setSports] = useState<Sport[]>(MOCK_SPORTS.map(s => ({...s, rules: []})));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSport, setNewSport] = useState({ name: '', type: 'Outdoor', icon: '🏆' });
  
  // Rules Management State
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [currentRules, setCurrentRules] = useState<string[]>([]);
  const [newRuleText, setNewRuleText] = useState('');

  const handleAddSport = () => {
    const sport: Sport = {
        id: `sp-${Date.now()}`,
        name: newSport.name,
        type: newSport.type as 'Indoor' | 'Outdoor',
        icon: newSport.icon,
        rules: []
    };
    setSports([...sports, sport]);
    setIsModalOpen(false);
    setNewSport({ name: '', type: 'Outdoor', icon: '🏆' });
    toast.success("Sport added successfully.");
  };

  const handleOpenRules = (sport: Sport) => {
      setSelectedSport(sport);
      setCurrentRules(sport.rules || []);
      setIsRulesModalOpen(true);
  };

  const handleAddRule = () => {
      if (newRuleText.trim()) {
          setCurrentRules([...currentRules, newRuleText.trim()]);
          setNewRuleText('');
      }
  };

  const handleRemoveRule = (index: number) => {
      const updatedRules = [...currentRules];
      updatedRules.splice(index, 1);
      setCurrentRules(updatedRules);
  };

  const handleSaveRules = () => {
      if (selectedSport) {
          setSports(sports.map(s => s.id === selectedSport.id ? { ...s, rules: currentRules } : s));
          setIsRulesModalOpen(false);
          setSelectedSport(null);
          toast.success("Rules updated successfully.");
      }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sports Configuration</h1>
          <p className="text-slate-500">Manage supported sports and rules engines.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add New Sport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sports.map((sport) => (
          <Card key={sport.id} className="relative group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                {sport.icon}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                sport.type === 'Indoor' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {sport.type}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{sport.name}</h3>
            <p className="text-sm text-slate-500 mb-4">
              {sport.rules && sport.rules.length > 0 ? `${sport.rules.length} custom rules defined.` : 'Standard rules engine enabled.'}
            </p>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenRules(sport)}>
                <Edit2 className="h-4 w-4 mr-1" /> Edit Rules
              </Button>
            </div>
          </Card>
        ))}
        
        {/* Placeholder for Rules Engine Info */}
        <Card className="md:col-span-2 lg:col-span-3 bg-blue-50 border-blue-100">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded text-blue-600">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Global Rules Engine</h3>
              <p className="text-sm text-blue-700 mt-1">
                Changing rules here affects all active tournaments for that sport. 
                Ensure you notify all participating schools before making major rule modifications during an ongoing season.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add Sport Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Sport"
      >
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sport Name</label>
                  <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                      placeholder="e.g. Volleyball"
                      value={newSport.name}
                      onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                  />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                      <select 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                          value={newSport.type}
                          onChange={(e) => setNewSport({...newSport, type: e.target.value})}
                      >
                          <option value="Outdoor">Outdoor</option>
                          <option value="Indoor">Indoor</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Icon (Emoji)</label>
                      <input 
                          type="text" 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none text-center"
                          placeholder="🏆"
                          maxLength={2}
                          value={newSport.icon}
                          onChange={(e) => setNewSport({...newSport, icon: e.target.value})}
                      />
                  </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSport} disabled={!newSport.name}>
                      Add Sport
                  </Button>
              </div>
          </div>
      </Modal>

      {/* Edit Rules Modal */}
      <Modal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        title={`Edit Rules: ${selectedSport?.name}`}
      >
          <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                      These rules will be displayed to referees and players. Be clear and concise.
                  </p>
              </div>

              <div className="space-y-2">
                  {currentRules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-lg group">
                          <span className="flex-shrink-0 h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">{index + 1}</span>
                          <p className="text-sm text-slate-700 flex-1">{rule}</p>
                          <button 
                            onClick={() => handleRemoveRule(index)}
                            className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              <span className="sr-only">Remove</span>
                              &times;
                          </button>
                      </div>
                  ))}
                  {currentRules.length === 0 && (
                      <p className="text-center text-slate-400 text-sm py-4 italic">No custom rules added yet.</p>
                  )}
              </div>

              <div className="flex gap-2">
                  <input 
                      type="text" 
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 outline-none"
                      placeholder="Enter a new rule..."
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                  />
                  <Button onClick={handleAddRule} disabled={!newRuleText.trim()}>Add</Button>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-2">
                  <Button variant="outline" onClick={() => setIsRulesModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveRules}>Save Changes</Button>
              </div>
          </div>
      </Modal>
    </DashboardLayout>
  );
};