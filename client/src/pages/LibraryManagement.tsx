import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  library: string;
  status: 'available' | 'borrowed' | 'reserved';
  borrowedBy?: string;
  borrowDate?: string;
  dueDate?: string;
}

interface BorrowRecord {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  library: string;
}

const LibraryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLibrary, setSelectedLibrary] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [borrowingStudentId, setBorrowingStudentId] = useState('');

  const libraries = [
    'Health Library',
    'Technology Library', 
    'Computational Library',
    'Fresh Library',
    'Social Library'
  ];

  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '978-0262033848',
      category: 'Computer Science',
      library: 'Technology Library',
      status: 'available'
    },
    {
      id: '2',
      title: 'Gray\'s Anatomy',
      author: 'Henry Gray',
      isbn: '978-0443066849',
      category: 'Medicine',
      library: 'Health Library',
      status: 'borrowed',
      borrowedBy: 'WCU/2024/001234',
      borrowDate: '2024-12-15',
      dueDate: '2024-12-29'
    },
    {
      id: '3',
      title: 'Calculus: Early Transcendentals',
      author: 'James Stewart',
      isbn: '978-1285741550',
      category: 'Mathematics',
      library: 'Computational Library',
      status: 'available'
    },
    {
      id: '4',
      title: 'Principles of Economics',
      author: 'N. Gregory Mankiw',
      isbn: '978-1305585126',
      category: 'Economics',
      library: 'Social Library',
      status: 'available'
    },
    {
      id: '5',
      title: 'Organic Chemistry',
      author: 'Paula Yurkanis Bruice',
      isbn: '978-0134042282',
      category: 'Chemistry',
      library: 'Fresh Library',
      status: 'reserved',
      borrowedBy: 'WCU/2024/001236'
    }
  ]);

  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([
    {
      id: '1',
      studentId: 'WCU/2024/001234',
      studentName: 'Abebe Kebede',
      bookId: '2',
      bookTitle: 'Gray\'s Anatomy',
      borrowDate: '2024-12-15',
      dueDate: '2024-12-29',
      status: 'active',
      library: 'Health Library'
    },
    {
      id: '2',
      studentId: 'WCU/2024/001235',
      studentName: 'Almaz Tadesse',
      bookId: '1',
      bookTitle: 'Introduction to Algorithms',
      borrowDate: '2024-12-10',
      dueDate: '2024-12-24',
      returnDate: '2024-12-22',
      status: 'returned',
      library: 'Technology Library'
    }
  ]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.isbn.includes(searchQuery);
    const matchesLibrary = !selectedLibrary || book.library === selectedLibrary;
    return matchesSearch && matchesLibrary;
  });

  const handleBorrowBook = (book: Book) => {
    if (!borrowingStudentId) {
      alert('Please enter student ID');
      return;
    }

    const newRecord: BorrowRecord = {
      id: Date.now().toString(),
      studentId: borrowingStudentId,
      studentName: 'Student Name', // In real app, fetch from student database
      bookId: book.id,
      bookTitle: book.title,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days
      status: 'active',
      library: book.library
    };

    setBorrowRecords(prev => [...prev, newRecord]);
    setBooks(prev => prev.map(b => 
      b.id === book.id 
        ? { ...b, status: 'borrowed', borrowedBy: borrowingStudentId, borrowDate: newRecord.borrowDate, dueDate: newRecord.dueDate }
        : b
    ));
    
    setSelectedBook(null);
    setBorrowingStudentId('');
    alert('Book borrowed successfully!');
  };

  const handleReturnBook = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    setBorrowRecords(prev => prev.map(r => 
      r.id === recordId 
        ? { ...r, status: 'returned', returnDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    
    setBooks(prev => prev.map(b => 
      b.id === record.bookId 
        ? { ...b, status: 'available', borrowedBy: undefined, borrowDate: undefined, dueDate: undefined }
        : b
    ));
    
    alert('Book returned successfully!');
  };

  const renderBookSearch = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Search Filters */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ color: '#7a0a2d', marginBottom: '20px' }}>📚 Search Books</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Search by Title, Author, or ISBN
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter book title, author name, or ISBN..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Filter by Library
            </label>
            <select
              value={selectedLibrary}
              onChange={(e) => setSelectedLibrary(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">All Libraries</option>
              {libraries.map(library => (
                <option key={library} value={library}>{library}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredBooks.map(book => (
          <div
            key={book.id}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ color: '#7a0a2d', marginBottom: '8px', fontSize: '16px' }}>{book.title}</h4>
              <p style={{ color: '#6b7280', marginBottom: '4px', fontSize: '14px' }}>by {book.author}</p>
              <p style={{ color: '#9ca3af', fontSize: '12px' }}>ISBN: {book.isbn}</p>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>📍 {book.library}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: book.status === 'available' ? '#dcfce7' : book.status === 'borrowed' ? '#fef3c7' : '#e0e7ff',
                  color: book.status === 'available' ? '#15803d' : book.status === 'borrowed' ? '#92400e' : '#3730a3'
                }}>
                  {book.status === 'available' ? '✅ Available' : 
                   book.status === 'borrowed' ? '📖 Borrowed' : '📋 Reserved'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Category: {book.category}</div>
            </div>

            {book.status === 'borrowed' && (
              <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '6px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#92400e' }}>
                  <div>Borrowed by: {book.borrowedBy}</div>
                  <div>Due: {book.dueDate}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              {book.status === 'available' && (
                <button
                  onClick={() => setSelectedBook(book)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#7a0a2d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  📖 Borrow Book
                </button>
              )}
              <button
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📋 Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <h3>No books found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  const renderBorrowRecords = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ color: '#7a0a2d', marginBottom: '20px' }}>📋 Borrow Records</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Student</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Book</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Library</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Borrow Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Due Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {borrowRecords.map(record => (
              <tr key={record.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{record.studentName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.studentId}</div>
                  </div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{record.bookTitle}</div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '14px' }}>{record.library}</div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '14px' }}>{record.borrowDate}</div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '14px' }}>{record.dueDate}</div>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: record.status === 'active' ? '#fef3c7' : record.status === 'returned' ? '#dcfce7' : '#fecaca',
                    color: record.status === 'active' ? '#92400e' : record.status === 'returned' ? '#15803d' : '#dc2626'
                  }}>
                    {record.status === 'active' ? '📖 Active' : 
                     record.status === 'returned' ? '✅ Returned' : '⚠️ Overdue'}
                  </span>
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  {record.status === 'active' && (
                    <button
                      onClick={() => handleReturnBook(record.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Return Book
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLibraryStats = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      {libraries.map(library => {
        const libraryBooks = books.filter(book => book.library === library);
        const availableBooks = libraryBooks.filter(book => book.status === 'available').length;
        const borrowedBooks = libraryBooks.filter(book => book.status === 'borrowed').length;
        
        return (
          <div
            key={library}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
            <h4 style={{ color: '#7a0a2d', marginBottom: '12px', fontSize: '16px' }}>{library}</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Total Books:</span>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{libraryBooks.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#15803d' }}>Available:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#15803d' }}>{availableBooks}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#dc2626' }}>Borrowed:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>{borrowedBooks}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <SharedLayout title="Library Management" userRole="student">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '24px',
          background: '#fff',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          {[
            { id: 'search', label: 'Search Books', icon: '🔍' },
            { id: 'records', label: 'Borrow Records', icon: '📋' },
            { id: 'stats', label: 'Library Stats', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderRadius: '6px',
                background: activeTab === tab.id ? '#7a0a2d' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#64748b',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'search' && renderBookSearch()}
        {activeTab === 'records' && renderBorrowRecords()}
        {activeTab === 'stats' && renderLibraryStats()}

        {/* Borrow Book Modal */}
        {selectedBook && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{ color: '#7a0a2d', marginBottom: '16px' }}>📖 Borrow Book</h3>
              
              <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{selectedBook.title}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>by {selectedBook.author}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>📍 {selectedBook.library}</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Student ID *
                </label>
                <input
                  type="text"
                  value={borrowingStudentId}
                  onChange={(e) => setBorrowingStudentId(e.target.value)}
                  placeholder="Enter student ID (e.g., WCU/2024/001234)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleBorrowBook(selectedBook)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#7a0a2d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Borrow
                </button>
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    setBorrowingStudentId('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SharedLayout>
  );
};

export default LibraryManagement;