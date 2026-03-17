import React from 'react';
import { Card } from '../ui/Card';
import { PointsTableEntry } from '../../types';

interface StandingsTableProps {
  entries: PointsTableEntry[];
  sport: string;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ entries, sport }) => {
  return (
    <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Rank</th>
                        <th className="px-4 md:px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[140px]">Team</th>
                        <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">P</th>
                        <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">W</th>
                        <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">L</th>
                        <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {sport === 'Cricket' ? 'NRR' : 'Diff'}
                        </th>
                        <th className="px-4 md:px-6 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider">Pts</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {entries.length > 0 ? (
                        entries.map((entry) => (
                            <tr key={entry.rank} className={`hover:bg-slate-50 ${entry.rank <= 2 ? 'bg-blue-50/30' : ''}`}>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                        entry.rank === 2 ? 'bg-slate-200 text-slate-700' :
                                        'text-slate-500'
                                    }`}>
                                        {entry.rank}
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                    <span className="font-bold text-slate-900 text-sm">{entry.team}</span>
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600">{entry.played}</td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">{entry.won}</td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">{entry.lost}</td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600 font-mono">
                                    {sport === 'Cricket' ? entry.nrr : entry.diff}
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center text-base font-bold text-slate-900">
                                    {entry.points}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500 italic">
                                No standing data available for this tournament.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </Card>
  );
};