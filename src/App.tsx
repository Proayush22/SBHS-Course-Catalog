import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, BookOpen, ExternalLink } from 'lucide-react';
import Papa from 'papaparse';

interface Course {
  courseCode: string;
  departmentName: string;
  courseDescription: string;
  courseCatalogDescription: string;
  creditsAndLevel: string;
  specialProgramDescription: string;
}

interface NavLink {
  title: string;
  url: string;
}

// Used Claude help to clean HTML tags and format text
const cleanHtmlTags = (text: string): string => {
  return text
    // Add line breaks before closing tags that should create new lines
    .replace(/<\/(p|div|br|h[1-6]|li|ul|ol|blockquote)>/gi, '\n')
    // Add line breaks after opening paragraph and heading tags
    .replace(/<(p|div|h[1-6]|li|blockquote)[^>]*>/gi, '\n')
    // Add line breaks for self-closing br tags
    .replace(/<br\s*\/?>/gi, '\n')
    // Bold specific course-related terms
    .replace(/Prerequisites?:/gi, '*Prerequisites:*')
    .replace(/No Prerequisites?/gi, '*No Prerequisites*')
    .replace(/Course Highlights?:/gi, '*Course Highlights:*')
    // Remove all remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Replace HTML entities
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    // Clean up multiple consecutive line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove leading/trailing whitespace and line breaks
    .trim();
};

const Navbar: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onMenuToggle: () => void;
  onLogoClick: () => void; 
}> = ({ searchTerm, onSearchChange, onMenuToggle, onLogoClick }) => {
  const hasSearchTerm = searchTerm.trim().length > 0;
  
  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className={`flex items-center space-x-4 transition-all duration-300 ${hasSearchTerm ? 'lg:w-auto' : ''}`}>
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer lg:hidden xl:flex transform hover:scale-105"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <div className={`flex items-center space-x-2 transition-all duration-300 ${hasSearchTerm ? 'lg:hidden xl:flex' : ''}`}>
            <img 
              src={`${import.meta.env.BASE_URL}photo.png`} 
              alt="Logo" 
              className="h-13 w-13 transition-transform duration-200 hover:scale-105 cursor-pointer" 
              onClick={onLogoClick}
            />
          </div>
        </div>

        
        <div className={`flex-1 mx-4 transition-all duration-300 ${hasSearchTerm ? 'max-w-4xl' : 'max-w-2xl'}`}>
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
            />
          </div>
        </div>
        
        <div className={`transition-all duration-300 ${hasSearchTerm ? 'w-4 lg:w-16' : 'w-16'}`}></div>
      </div>
    </nav>
  );
};

const NavigationLinks: React.FC = () => {
  const navLinks: NavLink[] = [
    { title: "Student Portal", url: "https://parents.sbschools.org/genesis/" },
    { title: "Option II", url: "https://sites.google.com/sbschools.org/sbhs-guidancesps/scheduling/option-ii" },
    { title: "Scheduling Guidelines", url: "https://docs.google.com/document/d/1_v2Mmcg3wg_6mQKO6f5VpfiknErThEuPvOkJjvb2hFA/edit?usp=sharing" },
    { title: "VTN", url: "https://sites.google.com/sbschools.org/vtnannouncements/home" },
    { title: "AP Information", url: "https://apstudents.collegeboard.org/courses" },
    { title: "AP Registration", url: "https://user.totalregistration.net/AP/310802" },
    { title: "CS Academy", url: "https://docs.google.com/document/d/1qrq504NNbUvJ0f42lQehynbf83H611cQjeTQmuMBv2o/edit?tab=t.0" }
  ];

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleLinkClick(link.url)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group transform cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                {link.title}
              </span>
              <ExternalLink size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  filters: {
    department: string;
    credits: string;
    gradeLevel: string;
    courseType: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}> = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [expandedDropdowns, setExpandedDropdowns] = useState<Set<string>>(new Set());

  const filterOptions = {
    department: [
      'All Departments',
      'Business',
      'Computer Science',
      'English / Language Arts',
      'Family and Consumer Sciences',
      'Fine Arts',
      'Mathematics',
      'Music / Performing Arts',
      'Physical Education / Health',
      'Science',
      'Social Studies',
      'Special Education',
      'Technology',
      'World Languages',
      '21st Century Skills'
    ],
    credits: ['All Credits', '2.5', '5.0', '10.0'],
    gradeLevel: ['All Grades', '9', '10', '11', '12'],
    courseType: ['All Types', 'AP', 'Honors', 'Academic', 'Dual Enrollment']
  };

  const toggleDropdown = (dropdown: string) => {
    setExpandedDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dropdown)) {
        newSet.delete(dropdown);
      } else {
        newSet.add(dropdown);
      }
      return newSet;
    });
  };

  const handleSidebarScroll = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-20 backdrop-blur-sm' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />
      
      <div 
        className={`fixed left-0 top-0 h-full bg-white shadow-xl transform transition-all duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80 flex flex-col overflow-hidden`}
        onScroll={handleSidebarScroll}
      >
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-all duration-200 transform hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1" onScroll={handleSidebarScroll}>
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md">
              <button
                onClick={() => toggleDropdown(filterType)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span className="font-medium capitalize text-gray-700">
                  {filterType === 'gradeLevel' ? 'Grade Level' : 
                   filterType === 'courseType' ? 'Course Type' : filterType}
                </span>
                <div className={`transition-transform duration-200 ${expandedDropdowns.has(filterType) ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </div>
              </button>
              
              <div className={`border-t border-gray-200 transition-all duration-300 ease-out overflow-hidden ${
                expandedDropdowns.has(filterType) 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                {options.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => onFilterChange(filterType, option)}
                    style={{ transitionDelay: `${index * 20}ms` }}
                    className={`w-full text-left p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 transform hover:translate-x-1 ${
                      filters[filterType as keyof typeof filters] === option 
                        ? 'bg-yellow-50 text-yellow-700 font-medium border-r-2 border-yellow-400' 
                        : 'text-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const CourseCard: React.FC<{
  course: Course;
  onClick: () => void;
}> = ({ course, onClick }) => {
  const cleanCredits = cleanHtmlTags(course.creditsAndLevel);
  const cleanDescription = cleanHtmlTags(course.courseCatalogDescription);
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 p-6 transform hover:scale-105 hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded transition-all duration-200 group-hover:bg-yellow-100">
          {course.courseCode}
        </span>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded transition-all duration-200 group-hover:bg-gray-200">
          {course.departmentName}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-200">
        {course.courseDescription}
      </h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-3 group-hover:text-gray-700 transition-colors duration-200">
        {cleanDescription.substring(0, 150)}...
      </p>
      
      <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
        {cleanCredits}
      </div>
    </div>
  );
};

const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-bold text-gray-900">{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

const CourseDetailModal: React.FC<{
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ course, isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200); 
    //mkaes you wait for animation
  };

  if (!isOpen || !course) return null;

  const cleanDescription = cleanHtmlTags(course.courseCatalogDescription);
  const cleanCredits = cleanHtmlTags(course.creditsAndLevel);
  const cleanSpecialProgram = cleanHtmlTags(course.specialProgramDescription);

  const isAP = course.courseDescription.includes('AP ');
  const isDualEnrollment = cleanCredits.toLowerCase().includes('Dual Credit Course');
  const isHonors = course.courseDescription.toLowerCase().includes('Honors') || cleanCredits.toLowerCase().includes('Honors 0.5');

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-500 ${
        isAnimating ? 'backdrop-blur-xl bg-black/40' : 'backdrop-blur-0 bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl transition-all duration-500 ease-out transform ${
          isAnimating 
            ? 'scale-100 opacity-100 translate-y-0 rotate-0' 
            : 'scale-90 opacity-0 translate-y-8 rotate-1'
        } border border-gray-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header without gradient */}
        <div className="relative overflow-hidden bg-yellow-600">
          <div className="relative p-8 text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                    {course.courseCode}
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm">
                    {course.departmentName}
                  </div>
                  {isAP && (
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                      ADVANCED PLACEMENT
                    </div>
                  )}
                  {isDualEnrollment && (
                    //<div className="px-3 py-1 rounded-full text-xs font-bold bg-gray-600 text-white backdrop-blur-sm border border-gray-500">
                    <div className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                      DUAL ENROLLMENT
                    </div>
                  )}
                  {isHonors && (
                    <div className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                      HONORS
                    </div>
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2 leading-tight">
                  {course.courseDescription}
                </h2>
                <p className="text-white/90 text-lg font-medium">
                  Explore the details and requirements for this course
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-3 hover:bg-white/20 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-90 flex-shrink-0 backdrop-blur-sm border border-white/20"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Area - Two Column Layout */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] bg-gray-50">
          <div className="p-8">
            <div className="flex gap-8 h-full">
              
              {/* Left Column - 40% */}
              <div className="w-2/5 space-y-8">
                {/* Credits and Level Card */}
                <div className="transform transition-all duration-500 delay-200 hover:scale-[1.02]">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      {/*
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      */}
                      <h3 className="text-xl font-bold text-gray-800">Credits & Requirements</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-gray-400">
                      <div className="text-gray-700 whitespace-pre-line font-medium">
                        {renderFormattedText(cleanCredits)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Card */}
                {cleanSpecialProgram && (
                  <div className="transform transition-all duration-500 delay-300 hover:scale-[1.02]">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Additional Information</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-gray-400">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {renderFormattedText(cleanSpecialProgram)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - 60% for Course Description */}
              <div className="w-3/5">
                <div className="transform transition-all duration-500 delay-100 hover:scale-[1.02] h-full">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                        <BookOpen size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Course Description</h3>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                        {renderFormattedText(cleanDescription)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 border-gray-100">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Need more information about this course?</p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>Contact your guidance counselor</span>
                  <span>•</span>
                  <span>Check the student portal for updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseApp: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: 'All Departments',
    credits: 'All Credits',
    gradeLevel: 'All Grades',
    courseType: 'All Types'
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data.csv`);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedCourses = results.data.map((row: any) => ({
              courseCode: row['Course Code'] || '',
              departmentName: row['Department Name'] || '',
              courseDescription: row['Course Description'] || '',
              courseCatalogDescription: cleanHtmlTags(row['Course Catalog Description'] || ''),
              creditsAndLevel: cleanHtmlTags(row['Credits and Level'] || ''),
              specialProgramDescription: cleanHtmlTags(row['Special Program Description'] || '')
            }));
            setCourses(parsedCourses);
          }
        });
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };
    
    loadCourses();
  }, []);

  // for filter and search
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.department !== 'All Departments') {
      filtered = filtered.filter(course => course.departmentName === filters.department);
    }

    if (filters.credits !== 'All Credits') {
      filtered = filtered.filter(course => 
        cleanHtmlTags(course.creditsAndLevel).includes(filters.credits)
      );
    }

    if (filters.gradeLevel !== 'All Grades') {
      filtered = filtered.filter(course => 
        cleanHtmlTags(course.creditsAndLevel).includes(filters.gradeLevel)
      );
    }

    if (filters.courseType !== 'All Types') {
      if (filters.courseType === 'AP') {
        filtered = filtered.filter(course => 
          course.courseDescription.includes('AP ') || 
          cleanHtmlTags(course.creditsAndLevel).includes('AP')
        );
      }
      else if (filters.courseType === 'Honors') {
        filtered = filtered.filter(course => 
          course.courseDescription.toLowerCase().includes('honors') || 
          cleanHtmlTags(course.creditsAndLevel).toLowerCase().includes('honors')
        );
      } 
      else if (filters.courseType === 'Dual Enrollment') {
        filtered = filtered.filter(course => 
          course.courseDescription.toLowerCase().includes('dual credit course') || 
          cleanHtmlTags(course.creditsAndLevel).toLowerCase().includes('dual credit course')
        );
      }
      else {
        filtered = filtered.filter(course => 
          !course.courseDescription.includes('AP ') && 
          !cleanHtmlTags(course.creditsAndLevel).includes('AP') &&
          !course.courseDescription.toLowerCase().includes('honors') &&
          !cleanHtmlTags(course.creditsAndLevel).toLowerCase().includes('honors') &&
          !course.courseDescription.toLowerCase().includes('dual credit course') &&
          !cleanHtmlTags(course.creditsAndLevel).toLowerCase().includes('dual credit course')
        );
      }
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const openCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const resetAllChoices = () => {
    setSearchTerm('');
    setFilters({
      department: 'All Departments',
      credits: 'All Credits',
      gradeLevel: 'All Grades',
      courseType: 'All Types'
    });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuToggle={() => setSidebarOpen(true)}
        onLogoClick={resetAllChoices}
      />
      
      <NavigationLinks />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 transform transition-all duration-500">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Catalog</h1>
          <p className="text-gray-600 transition-all duration-300">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <div
              key={course.courseCode}
              style={{ animationDelay: `${index * 50}ms` }}
              className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
            >
              <CourseCard
                course={course}
                onClick={() => openCourseDetail(course)}
              />
            </div>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 transform transition-all duration-500">
            <div className="animate-bounce mb-4">
              <BookOpen size={64} className="mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
      
      <CourseDetailModal
        course={selectedCourse}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CourseApp;