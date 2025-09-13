import React, { useState, useMemo, useCallback } from 'react';
import ResourceCard from './ResourceCard';
import { FaBookOpen } from 'react-icons/fa';
import { X, Filter, Search } from 'lucide-react';

const LibraryModule = () => {
  // State for all library resources
  const [allResources] = useState([
    {
      id: 'res_001',
      subject: 'Mathematics',
      topic: 'Differential Calculus',
      classes: ['MPC', 'MEC'],
      description: 'Complete guide to limits, derivatives, and applications for intermediate students.',
      type: 'pdf',
      url: 'mathematics_calculus_guide.pdf',
      title: 'Intermediate Mathematics - Calculus',
    },
    {
      id: 'res_002',
      subject: 'Physics',
      topic: 'Mechanics and Motion',
      classes: ['MPC', 'BiPC'],
      description: 'Laws of motion, work-energy theorem, and rotational dynamics.',
      type: 'video',
      url: 'https://youtube.com/physics_mechanics',
      title: 'Physics Mechanics Tutorial',
    },
    {
      id: 'res_003',
      subject: 'Chemistry',
      topic: 'Organic Chemistry',
      classes: ['MPC', 'BiPC'],
      description: 'Hydrocarbons, functional groups, and organic reactions for intermediate.',
      type: 'pdf',
      url: 'chemistry_organic_guide.pdf',
      title: 'Organic Chemistry Handbook',
    },
    {
      id: 'res_004',
      subject: 'Biology',
      topic: 'Human Physiology',
      classes: ['BiPC'],
      description: 'Digestive, respiratory, and circulatory systems in detail.',
      type: 'image',
      url: 'https://placehold.co/600x400/00FF00/FFFFFF?text=Human%20Body%20Systems',
      title: 'Human Body Systems Chart',
    },
    {
      id: 'res_005',
      subject: 'Commerce',
      topic: 'Partnership Accounts',
      classes: ['CEC', 'MEC'],
      description: 'Partnership formation, profit sharing, and dissolution procedures.',
      type: 'pdf',
      url: 'commerce_partnership_guide.pdf',
      title: 'Partnership Accounting Guide',
    },
    {
      id: 'res_006',
      subject: 'Economics',
      topic: 'Microeconomics',
      classes: ['CEC', 'MEC', 'HEC'],
      description: 'Demand and supply analysis, market structures, and consumer behavior.',
      type: 'video',
      url: 'https://youtube.com/microeconomics_basics',
      title: 'Microeconomics Fundamentals',
    },
    {
      id: 'res_007',
      subject: 'Civics',
      topic: 'Indian Constitution',
      classes: ['CEC', 'HEC'],
      description: 'Fundamental rights, directive principles, and constitutional amendments.',
      type: 'pdf',
      url: 'civics_constitution_guide.pdf',
      title: 'Indian Constitution Study Material',
    },
    {
      id: 'res_008',
      subject: 'History',
      topic: 'Indian Independence Movement',
      classes: ['HEC'],
      description: 'Freedom struggle from 1857 to 1947, major leaders and movements.',
      type: 'link',
      url: 'https://wikipedia.org/wiki/Indian_independence_movement',
      title: 'Independence Movement Reference',
    },
    {
      id: 'res_009',
      subject: 'JEE Coaching',
      topic: 'JEE Main Previous Papers',
      classes: ['MPC'],
      description: 'Last 10 years JEE Main question papers with detailed solutions.',
      type: 'pdf',
      url: 'jee_main_previous_papers.pdf',
      title: 'JEE Main Question Bank',
    },
    {
      id: 'res_010',
      subject: 'NEET Coaching',
      topic: 'NEET Biology MCQs',
      classes: ['BiPC'],
      description: 'Chapter-wise multiple choice questions for NEET Biology preparation.',
      type: 'pdf',
      url: 'neet_biology_mcqs.pdf',
      title: 'NEET Biology Practice Questions',
    }
  ]);

  // Combined state for filters
  const [filters, setFilters] = useState({
    searchQuery: '',
    subject: 'All',
    class: 'All Courses',
    type: 'All',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Options for dropdowns
  const classOptions = useMemo(() => ([
    'All Courses',
    'MPC', 'BiPC', 'CEC', 'MEC', 'HEC'
  ]), []);

  const subjectOptions = useMemo(() => {
    const subjects = new Set(allResources.map(res => res.subject));
    return ['All', ...Array.from(subjects).sort()];
  }, [allResources]);

  const resourceTypes = ['All', 'pdf', 'image', 'video', 'link'];

  // Handler for filter changes
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  }, []);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subject && filters.subject !== 'All') count++;
    if (filters.class && filters.class !== 'All Courses') count++;
    if (filters.type && filters.type !== 'All') count++;
    return count;
  }, [filters]);

  // Memoized filtered resources
  const filteredResources = useMemo(() => {
    let tempResources = [...allResources];

    if (filters.searchQuery) {
      const lowerCaseSearchTerm = filters.searchQuery.toLowerCase();
      tempResources = tempResources.filter(res =>
        res.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.topic.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filters.subject !== 'All') {
      tempResources = tempResources.filter(res => res.subject === filters.subject);
    }

    if (filters.class !== 'All Courses') {
      tempResources = tempResources.filter(res => res.classes.includes(filters.class));
    }

    if (filters.type !== 'All') {
      tempResources = tempResources.filter(res => res.type === filters.type);
    }

    return tempResources;
  }, [allResources, filters]);

  // Handler to clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      subject: 'All',
      class: 'All Courses',
      type: 'All',
    });
  }, []);

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaBookOpen className="text-blue-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Digital Library</h1>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className='flex justify-between mb-4'>
        {/* Desktop Search Bar */}
        <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full md:w-[400px]'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by Title, Topic, Subject, Course..."
            className="p-2 bg-transparent outline-none flex-1 min-w-0"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className='flex gap-2'>
          {/* Mobile Search Button */}
          <button
            className='md:hidden flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md text-sm'
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={16} />
            Search
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100'
            }`}
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
            <span className="hidden md:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-0 md:ml-1 inline-flex items-center px-1.5 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <div className='md:hidden flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 w-full mb-4 animate-fade-in'>
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search resources..."
            className="p-2 bg-transparent outline-none flex-1 min-w-0"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Filter by Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Subject</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              >
                {subjectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Filter by Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Course</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.class}
                onChange={(e) => handleFilterChange('class', e.target.value)}
              >
                {classOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button
              onClick={clearFilters}
              className='text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors duration-200'
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Resource Cards Display */}
      <div className="min-h-[300px]">
        {filteredResources.length === 0 ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-6 rounded-lg shadow-md text-center">
            <p className="font-bold text-lg mb-2">No Resources Found!</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryModule;