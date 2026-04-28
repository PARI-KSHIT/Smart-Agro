import { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  ExternalLink,
  Activity,
  FileText,
  Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminLayout from '../components/AdminLayout';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    newToday: 0,
    activeNow: 0,
    securedUsers: '0%'
  });
  const [topScanners, setTopScanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { adminToken } = useAdmin();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, scannersRes] = await Promise.all([
          fetch('/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          }),
          fetch('/api/admin/top-scanners', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
          })
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStatsData(data);
        }
        if (scannersRes.ok) {
          const data = await scannersRes.json();
          setTopScanners(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
    
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [adminToken]);

  const handleDownloadReport = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      const users = await response.json();

      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(16, 185, 129); // emerald-600
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('SMART AGRO', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Agricultural Management System', 20, 32);
      
      doc.setFontSize(8);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 140, 32);

      // Content Title
      doc.setTextColor(31, 41, 55); // gray-800
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Registered Farmers Directory', 20, 55);

      // Table
      const tableData = users.map((user: any, index: number) => [
        index + 1,
        user.name,
        user.email,
        'Farmer',
        new Date(user.createdAt).toLocaleDateString()
      ]);

      autoTable(doc, {
        startY: 65,
        head: [['No.', 'Full Name', 'Email Address', 'Account Role', 'Joined Date']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [16, 185, 129], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 45 },
          2: { cellWidth: 70 },
          3: { cellWidth: 30, halign: 'center' },
          4: { cellWidth: 30, halign: 'center' }
        },
        styles: { fontSize: 9, cellPadding: 5 },
        alternateRowStyles: { fillColor: [249, 250, 251] }
      });

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(`Confidential - Smart Agro Administration Panel | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      }

      doc.save(`Smart_Agro_Users_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  const stats = [
    { title: 'Total Users', value: statsData.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { title: 'New Today', value: statsData.newToday, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50', trend: '+4%' },
    { title: 'Active Now', value: statsData.activeNow, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+18%' },
    { title: 'Secured Users', value: statsData.securedUsers, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Stable' },
  ];

  return (
    <AdminLayout title="Overview">
      <div className="space-y-8">
        {/* Header with Download Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">System Overview</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Real-time platform metrics and administration tools</p>
          </div>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] group"
          >
            <FileText className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            Download User Report
            <Download className="w-4 h-4 ml-1 opacity-60" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wider">
                  {stat.trend} <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Scanners Leaderboard */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2.5 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Top Activity Leaderboard</h2>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-[0.2em]">
                Live Analytics
              </span>
            </div>
            
            <div className="space-y-5">
              {topScanners.length > 0 ? (
                topScanners.map((user, index) => (
                  <motion.div 
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-black
                          ${index === 0 ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-50' : 
                            index === 1 ? 'bg-slate-100 text-slate-500' : 
                            index === 2 ? 'bg-orange-100 text-orange-600' : 
                            'bg-gray-50 text-gray-400'}
                        `}>
                          #{index + 1}
                        </div>
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-800 line-clamp-1">{user.name}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{user.scanCount} Scans Performed</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-gray-900">{user.scanCount}</span>
                      </div>
                    </div>
                    {/* Graph Type Indicator (Progress Bar) */}
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(user.scanCount / topScanners[0].scanCount) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                          'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-400 font-medium italic">No scan activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">User Management</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Manage all registered farmers, view their activity history, or remove accounts from the platform.
              </p>
              
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/30">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-blue-700">{statsData.totalUsers}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Registered Farmers</span>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </div>
            </div>

            <Link 
              to="/admin/users"
              className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-all group shadow-xl shadow-gray-200"
            >
              <Users className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Manage All Users
              <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
