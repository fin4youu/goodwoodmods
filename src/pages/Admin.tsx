import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, getDocs, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Shield, KeyRound, Users, Trash2, CheckCircle2 } from 'lucide-react';

export default function Admin() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [roleToAssign, setRoleToAssign] = useState<'trainee' | 'admin'>('trainee');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const codesSnap = await getDocs(collection(db, 'inviteCodes'));
      
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setInviteCodes(codesSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      const codeId = newCode.trim().toUpperCase();
      await setDoc(doc(db, 'inviteCodes', codeId), {
        code: codeId,
        createdBy: profile?.uid,
        createdAt: Date.now(),
        usedBy: null,
        roleToAssign
      });
      setNewCode('');
      fetchData();
    } catch (error) {
      console.error("Error generating code", error);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    try {
      await deleteDoc(doc(db, 'inviteCodes', codeId));
      fetchData();
    } catch (error) {
      console.error("Error deleting code", error);
    }
  };

  const handlePromoteUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: 'moderator',
        status: 'passed'
      });
      fetchData();
    } catch (error) {
      console.error("Error promoting user", error);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <Shield className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#004225] tracking-tight">Staff Management</h1>
        <p className="text-gray-600 mt-2 text-lg">Manage users, moderators, and invite codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invite Codes Section */}
        <Card className="lg:col-span-1 border-t-4 border-t-[#D4AF37]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#004225]" />
              Invite Codes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleGenerateCode} className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Code</label>
                <Input 
                  placeholder="e.g. GW-MOD-2026" 
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role to Assign</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004225]"
                  value={roleToAssign}
                  onChange={(e) => setRoleToAssign(e.target.value as any)}
                >
                  <option value="trainee">Trainee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-[#004225] hover:bg-[#00331c] text-white">Generate Code</Button>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {inviteCodes.map(code => (
                <div key={code.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div>
                    <p className="font-mono font-bold text-[#004225]">{code.code}</p>
                    <p className="text-xs text-gray-500 capitalize">{code.roleToAssign} • {code.usedBy ? 'Used' : 'Available'}</p>
                  </div>
                  {!code.usedBy && (
                    <button onClick={() => handleDeleteCode(code.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {inviteCodes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No invite codes generated yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Section */}
        <Card className="lg:col-span-2 border-t-4 border-t-[#004225]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              User Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading users...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">User</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Progress</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={u.photoURL || ''} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                            <div>
                              <p className="font-medium text-gray-900">{u.displayName}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize font-medium text-[#004225]">
                          {u.role}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${u.status === 'passed' ? 'bg-green-100 text-green-800' : 
                              u.status === 'failed' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role === 'trainee' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5 w-16">
                                <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: `${(u.currentModule / 6) * 100}%` }}></div>
                              </div>
                              <span className="text-xs text-gray-500">{u.currentModule}/6</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {u.role === 'trainee' && u.status === 'passed' && (
                            <Button 
                              size="sm" 
                              onClick={() => handlePromoteUser(u.id)}
                              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Promote
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
