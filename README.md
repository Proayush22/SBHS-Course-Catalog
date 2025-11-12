Course Catalog Application

A site made for SBHS for browsing and searching course offerings. Built with React, TypeScript, and Tailwind CSS, this application provides an intuitive interface for students and administrators to explore course catalogs with advanced filtering and search capabilities. The way this works is using a csv file uploaded straight to the React project, it parses through the file and fills in available courses based on that. 
Core Functionality

Dynamic Data Loading: Automatically loads course data from a CSV file (courses.csv) using PapaParse library
Comprehensive Course Information: Each course displays:

Course code and department
Full course description
Credit requirements and grade level eligibility
Special program information (AP, Honors, Dual Enrollment)
Prerequisites and course highlights


Search & Filtering

Real-time Search: Instant search across course names, codes, and departments
Multi-category Filtering:

Department (Business, Computer Science, English, etc.)
Credit hours (2.5, 5.0, 10.0)
Grade level (9-12)
Course type (AP, Honors, Academic, Dual Enrollment)


Combined Search: Search and filters work together for precise course discovery

Responsive Design

Mobile-first Approach: Fully responsive design that adapts to all screen sizes
Touch-friendly Interface: Optimized for mobile devices with appropriate touch targets
Adaptive Layout: Navigation and content reorganize seamlessly across devices
Smooth Animations & Transitions

Staggered Card Animations: Course cards animate in with cascading delays for visual appeal
Hover Effects: Cards lift and scale on hover with smooth transitions
Modal Animations: Course detail modals appear with sophisticated scale and fade effects
Filter Transitions: Sidebar filters expand/collapse with smooth animations

Modern Visual Elements

Glassmorphism Effects: Backdrop blur and transparency effects in modals
Gradient Overlays: Subtle gradients enhance visual hierarchy
Card-based Design: Clean, modern card layouts with consistent spacing
Color-coded Badges: Visual indicators for course types (AP, Honors, Dual Enrollment)


Removes HTML tags while preserving formatting
Converts HTML entities to readable text
Formats prerequisites and course highlights as structured lists
Maintains proper line breaks and spacing



Smart State Management
Optimized Filtering: Efficient filtering logic that combines multiple criteria
Persistent UI State: Maintains search and filter states during navigation
Performance Optimization: Minimal re-renders through strategic use of React hooks


Intuitive Navigation
Logo Reset Functionality: Clicking the logo clears all searches and filters
Quick Access Links: Direct links to student portals, scheduling tools, and AP resources
Breadcrumb-style Filtering: Clear indication of active filters

Rich Course Details
Modal-based Details: Full-screen course information without page navigation
Formatted Text Rendering: Markdown-style bold formatting for important information
Visual Course Type Indicators: Distinct badges for AP, Honors, and Dual Enrollment courses
Structured Information Layout: Two-column layout separating requirements from descriptions

Smart Content Organization
Department Categorization: Courses organized by academic departments
Credit-based Filtering: Easy filtering by credit requirements
Grade-level Targeting: Quick identification of grade-appropriate courses

Data Processing
CSV Integration: Seamless loading and parsing of course data from CSV files
Error Handling: Robust error handling for data loading failures
Dynamic Updates: Easy to update course information by replacing the CSV file

Performance Optimizations
Lazy Loading: Components load only when needed
Efficient Filtering: Optimized search and filter algorithms
Some Memory Management implemented: cleans up event listeners and effects

