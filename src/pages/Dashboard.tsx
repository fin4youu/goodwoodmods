import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { courseModules } from '../data/course';
import { Trophy, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  const totalModules = courseModules.length;
  const progressPercent = Math.round((profile.currentModule / totalModules) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#004225] tracking-tight">Welcome back, {profile.displayName.split(' ')[0]}</h1>
        <p className="text-gray-600 mt-2 text-lg">Goodwood RBLX Moderator Academy Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-[#004225]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Current Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize text-[#004225]">{profile.role}</div>
            <p className="text-xs text-gray-500 mt-1">Status: <span className="font-semibold capitalize">{profile.status}</span></p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#D4AF37]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#004225]" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#004225]">{progressPercent}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-[#D4AF37] h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#004225]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#D4AF37]" />
              Final Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#004225]">
              {profile.status === 'passed' || profile.status === 'failed' ? `${profile.testScore}%` : 'N/A'}
            </div>
            <p className="text-xs text-gray-500 mt-1">Complete the final test to get your score</p>
          </CardContent>
        </Card>
      </div>

      {profile.role === 'trainee' && profile.status !== 'passed' && (
        <Card className="bg-[#004225] text-white border-none shadow-xl">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Continue your training</h2>
              <p className="text-gray-300">
                {profile.currentModule === 0 
                  ? "You haven't started the course yet. Begin Module 1 to learn the basics of moderation."
                  : `You are currently on Module ${profile.currentModule + 1}. Keep going!`}
              </p>
            </div>
            <Link to="/course">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#b8962e] text-[#004225] font-bold whitespace-nowrap">
                {profile.currentModule === 0 ? 'Start Course' : 'Resume Course'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {profile.status === 'passed' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h2>
            <p className="text-green-700">
              You have successfully passed the Goodwood RBLX Moderator Training Course. 
              An administrator will review your results and promote you shortly.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
