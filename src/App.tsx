import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { StudentModal } from './components/StudentModal';
import { ExcelImportModal } from './components/ExcelImportModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { storageService } from './services/storage';
import { Student, UserRole, ViolationRecord, AchievementRecord, SystemNotification, WeeklyReportData } from './types';

// Views
import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { AcademicsView } from './views/AcademicsView';
import { AttendanceView } from './views/AttendanceView';
import { ConductView } from './views/ConductView';
import { AwardsView } from './views/AwardsView';
import { StudentProfileView } from './views/StudentProfileView';
import { StatisticsView } from './views/StatisticsView';
import { ReportsView } from './views/ReportsView';
import { AIAssistantView } from './views/AIAssistantView';
import { SettingsView } from './views/SettingsView';

function MainApp() {
  const { showToast } = useToast();

  // Navigation & View state
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('hs-01');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportData | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('GVCN');

  // Modal states
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setStudents(storageService.getStudents());
    setViolations(storageService.getViolations());
    setAchievements(storageService.getAchievements());
    setNotifications(storageService.getNotifications());
    setWeeklyReport(storageService.getWeeklyReport());
    setCurrentRole(storageService.getCurrentRole());
  };

  const handleImportExcelSuccess = (newStudents: Student[], mode: 'append' | 'replace') => {
    let updatedList: Student[];
    if (mode === 'replace') {
      updatedList = newStudents;
    } else {
      const existing = storageService.getStudents();
      const existingCodes = new Set(existing.map((s) => s.studentCode));
      const filteredNew = newStudents.filter((s) => !existingCodes.has(s.studentCode));
      updatedList = [...existing, ...filteredNew];
    }
    storageService.saveStudents(updatedList);
    setStudents(updatedList);
    if (newStudents.length > 0) {
      setSelectedStudentId(newStudents[0].id);
    }
    showToast(
      mode === 'replace'
        ? `Đã thay thế danh sách lớp bằng ${newStudents.length} học sinh từ file Excel!`
        : `Đã nhập thêm thành công ${newStudents.length} học sinh từ file Excel vào lớp 8A2!`,
      'success'
    );
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Student CRUD handlers
  const handleSaveStudent = (data: Partial<Student>) => {
    if (editingStudent) {
      const updated: Student = {
        ...editingStudent,
        ...data,
      } as Student;
      storageService.updateStudent(updated);
      setStudents(storageService.getStudents());
      showToast(`Đã cập nhật thông tin học sinh ${updated.fullName}!`, 'success');
    } else {
      const created = storageService.addStudent({
        ...data,
        conductScore: 90,
        conductRating: 'Tốt',
        totalAbsences: 0,
        totalLate: 0,
        weeklyAttendance: {
          monday: 'present',
          tuesday: 'present',
          wednesday: 'present',
          thursday: 'present',
          friday: 'present',
        },
      } as any);
      setStudents(storageService.getStudents());
      setSelectedStudentId(created.id);
      showToast(`Đã thêm mới học sinh ${created.fullName} vào lớp 8A2!`, 'success');
    }
    setStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleConfirmDeleteStudent = () => {
    if (!deletingStudent) return;
    storageService.deleteStudent(deletingStudent.id);
    const updated = storageService.getStudents();
    setStudents(updated);
    if (selectedStudentId === deletingStudent.id) {
      if (updated.length > 0) {
        setSelectedStudentId(updated[0].id);
      }
    }
    showToast(`Đã xóa học sinh ${deletingStudent.fullName} khỏi danh sách!`, 'success');
    setDeletingStudent(null);
  };

  const handleDeleteMultipleStudents = (ids: string[]) => {
    storageService.deleteMultipleStudents(ids);
    const updated = storageService.getStudents();
    setStudents(updated);
    if (updated.length > 0) {
      setSelectedStudentId(updated[0].id);
    }
    showToast(`Đã xóa thành công ${ids.length} học sinh khỏi danh sách lớp 8A2!`, 'success');
  };

  const handleDeleteAllStudents = () => {
    storageService.deleteAllStudents();
    setStudents([]);
    showToast('Đã xóa toàn bộ danh sách học sinh lớp 8A2!', 'success');
  };

  // Attendance handlers
  const handleToggleAttendance = (
    studentId: string,
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
  ) => {
    const currentList = storageService.getStudents();
    const st = currentList.find((s) => s.id === studentId);
    if (!st) return;

    const currentStatus = st.weeklyAttendance[day];
    const nextStatusMap: Record<string, 'present' | 'late' | 'excused' | 'unexcused'> = {
      present: 'late',
      late: 'excused',
      excused: 'unexcused',
      unexcused: 'present',
    };
    const nextStatus = nextStatusMap[currentStatus] || 'present';

    st.weeklyAttendance[day] = nextStatus;

    // Recount total absences & late
    const allStatuses = Object.values(st.weeklyAttendance);
    st.totalAbsences = allStatuses.filter((s) => s === 'excused' || s === 'unexcused').length;
    st.totalLate = allStatuses.filter((s) => s === 'late').length;

    storageService.updateStudent(st);
    setStudents([...storageService.getStudents()]);
  };

  const handleSetAllPresent = (day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday') => {
    const currentList = storageService.getStudents();
    currentList.forEach((st) => {
      st.weeklyAttendance[day] = 'present';
      const allStatuses = Object.values(st.weeklyAttendance);
      st.totalAbsences = allStatuses.filter((s) => s === 'excused' || s === 'unexcused').length;
      st.totalLate = allStatuses.filter((s) => s === 'late').length;
    });
    storageService.saveStudents(currentList);
    setStudents([...currentList]);
    showToast(`Đã điểm danh tất cả 38 học sinh Có mặt ngày ${day}!`, 'success');
  };

  // Violation CRUD
  const handleAddViolation = (record: Omit<ViolationRecord, 'id'>) => {
    storageService.addViolation(record);
    setViolations(storageService.getViolations());
  };

  const handleUpdateViolation = (record: ViolationRecord) => {
    storageService.updateViolation(record);
    setViolations(storageService.getViolations());
  };

  const handleDeleteViolation = (id: string) => {
    storageService.deleteViolation(id);
    setViolations(storageService.getViolations());
    showToast('Đã xóa ghi nhận vi phạm thành công', 'success');
  };

  // Achievement CRUD
  const handleAddAchievement = (record: Omit<AchievementRecord, 'id'>) => {
    storageService.addAchievement(record);
    setAchievements(storageService.getAchievements());
  };

  const handleDeleteAchievement = (id: string) => {
    storageService.deleteAchievement(id);
    setAchievements(storageService.getAchievements());
    showToast('Đã xóa danh hiệu khen thưởng', 'success');
  };

  // Notifications
  const handleNotificationClick = (notif: SystemNotification) => {
    storageService.markNotificationAsRead(notif.id);
    setNotifications(storageService.getNotifications());
    if (notif.studentId) {
      setSelectedStudentId(notif.studentId);
      setCurrentView('profiles');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    storageService.markAllNotificationsRead();
    setNotifications(storageService.getNotifications());
    showToast('Đã đánh dấu đọc tất cả thông báo', 'info');
  };

  // Role change
  const handleRoleChange = (role: UserRole) => {
    storageService.setCurrentRole(role);
    setCurrentRole(role);
    showToast(`Đã chuyển đổi vai trò sang: ${role}`, 'info');
  };

  // Reset data
  const handleResetData = () => {
    storageService.resetToDefaultData();
    loadAllData();
  };

  // Navigate helper
  const handleNavigate = (view: string, studentId?: string) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick AI Prompt from Dashboard
  const handleQuickAiPrompt = (promptText: string) => {
    setAiInitialPrompt(promptText);
    setCurrentView('ai_assistant');
  };

  // Active student object for Profile View
  const activeStudent =
    students.find((s) => s.id === selectedStudentId) || students[0] || null;

  return (
    <div className="min-h-screen bg-[#F3F8FF] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onOpenSearchModal={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex">
        {/* Navy Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => handleNavigate(view)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentRole={currentRole}
          concernCount={students.filter((s) => s.isFlaggedForConcern).length}
          awardCount={achievements.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 lg:p-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {/* VIEW ROUTING */}
            {currentView === 'dashboard' && (
              <DashboardView
                students={students}
                onSelectStudent={(id) => handleNavigate('profiles', id)}
                onOpenAddStudent={() => {
                  setEditingStudent(null);
                  setStudentModalOpen(true);
                }}
                onOpenEditStudent={(s) => {
                  setEditingStudent(s);
                  setStudentModalOpen(true);
                }}
                onDeleteStudent={(s) => setDeletingStudent(s)}
                onDeleteAllStudents={handleDeleteAllStudents}
                onToggleAttendance={handleToggleAttendance}
                onNavigate={handleNavigate}
                onQuickAiPrompt={handleQuickAiPrompt}
                onOpenExcelImport={() => setIsExcelImportOpen(true)}
              />
            )}

            {currentView === 'students' && (
              <StudentsView
                students={students}
                onSelectStudent={(id) => handleNavigate('profiles', id)}
                onOpenAddModal={() => {
                  setEditingStudent(null);
                  setStudentModalOpen(true);
                }}
                onOpenEditModal={(s) => {
                  setEditingStudent(s);
                  setStudentModalOpen(true);
                }}
                onOpenDeleteModal={(s) => setDeletingStudent(s)}
                onDeleteMultipleStudents={handleDeleteMultipleStudents}
                onDeleteAllStudents={handleDeleteAllStudents}
                onOpenExcelImport={() => setIsExcelImportOpen(true)}
                onRestoreSampleData={handleResetData}
              />
            )}

            {currentView === 'academics' && (
              <AcademicsView
                students={students}
                onUpdateStudent={(s) => {
                  storageService.updateStudent(s);
                  setStudents([...storageService.getStudents()]);
                }}
                onSelectStudent={(id) => handleNavigate('profiles', id)}
              />
            )}

            {currentView === 'attendance' && (
              <AttendanceView
                students={students}
                onToggleAttendance={handleToggleAttendance}
                onSetAllPresent={handleSetAllPresent}
              />
            )}

            {currentView === 'conduct' && (
              <ConductView
                violations={violations}
                students={students}
                onAddViolation={handleAddViolation}
                onUpdateViolation={handleUpdateViolation}
                onDeleteViolation={handleDeleteViolation}
              />
            )}

            {currentView === 'awards' && (
              <AwardsView
                achievements={achievements}
                students={students}
                onAddAchievement={handleAddAchievement}
                onDeleteAchievement={handleDeleteAchievement}
                onSelectStudent={(id) => handleNavigate('profiles', id)}
              />
            )}

            {currentView === 'profiles' && activeStudent && (
              <StudentProfileView
                student={activeStudent}
                students={students}
                onSelectStudent={(id) => setSelectedStudentId(id)}
                onEditStudent={(s) => {
                  setEditingStudent(s);
                  setStudentModalOpen(true);
                }}
                onUpdateNote={(id, note, plan) => {
                  const st = students.find((s) => s.id === id);
                  if (st) {
                    st.teacherNote = note;
                    st.actionPlan = plan;
                    storageService.updateStudent(st);
                    setStudents([...storageService.getStudents()]);
                  }
                }}
              />
            )}

            {currentView === 'statistics' && <StatisticsView students={students} />}

            {currentView === 'reports' && weeklyReport && (
              <ReportsView
                report={weeklyReport}
                students={students}
                onSaveReport={(rep) => {
                  storageService.saveWeeklyReport(rep);
                  setWeeklyReport(rep);
                }}
              />
            )}

            {currentView === 'ai_assistant' && (
              <AIAssistantView students={students} initialPrompt={aiInitialPrompt} />
            )}

            {currentView === 'settings' && (
              <SettingsView
                currentRole={currentRole}
                onRoleChange={handleRoleChange}
                onResetData={handleResetData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        students={students}
        onSelectStudent={(id) => handleNavigate('profiles', id)}
        onNavigateView={(view) => handleNavigate(view)}
      />

      <StudentModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        student={editingStudent}
        onOpenExcelImport={() => {
          setStudentModalOpen(false);
          setIsExcelImportOpen(true);
        }}
      />

      <ExcelImportModal
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        onImportSuccess={handleImportExcelSuccess}
        existingCount={students.length}
      />

      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmDeleteStudent}
        title="Xóa học sinh khỏi lớp 8A2?"
        message={`Bạn có chắc chắn muốn xóa học sinh "${deletingStudent?.fullName}" (Mã: ${deletingStudent?.studentCode}) khỏi cơ sở dữ liệu lớp học? Toàn bộ kết quả điểm số và chuyên cần của em cũng sẽ bị xóa.`}
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
