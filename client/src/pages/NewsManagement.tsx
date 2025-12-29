import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

interface NewsPost {
  id: string;
  title: string;
  titleAmharic?: string;
  content: string;
  contentAmharic?: string;
  excerpt: string;
  author: string;
  category: string;
  visibility: 'all' | 'students' | 'teachers' | 'management';
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  attachments?: string[];
  tags: string[];
}

const NewsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [posts, setPosts] = useState<NewsPost[]>([
    {
      id: '1',
      title: 'New Academic Year Registration Opens',
      titleAmharic: 'አዲስ የትምህርት ዓመት ምዝገባ ተጀመረ',
      content: 'Registration for the 2024/25 academic year is now open for all continuing students. Please complete your course selection and payment by the deadline.',
      contentAmharic: 'የ2024/25 የትምህርት ዓመት ምዝገባ ለሁሉም ተከታታይ ተማሪዎች ተጀምሯል። እባክዎ የኮርስ ምርጫዎን እና ክፍያዎን በተወሰነው ጊዜ ውስጥ ያጠናቅቁ።',
      excerpt: 'Registration for the 2024/25 academic year is now open...',
      author: 'Registrar Office',
      category: 'Academic',
      visibility: 'all',
      featured: true,
      published: true,
      publishedAt: '2024-12-20T10:00:00Z',
      createdAt: '2024-12-20T09:00:00Z',
      updatedAt: '2024-12-20T09:00:00Z',
      tags: ['registration', 'academic-year', 'students']
    },
    {
      id: '2',
      title: 'Faculty Meeting - Research Proposals',
      content: 'All faculty members are required to attend the research proposal meeting scheduled for next week.',
      excerpt: 'Faculty meeting for research proposals...',
      author: 'Academic Affairs',
      category: 'Faculty',
      visibility: 'teachers',
      featured: false,
      published: true,
      publishedAt: '2024-12-19T14:00:00Z',
      createdAt: '2024-12-19T13:00:00Z',
      updatedAt: '2024-12-19T13:00:00Z',
      tags: ['faculty', 'research', 'meeting']
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    titleAmharic: '',
    content: '',
    contentAmharic: '',
    category: '',
    visibility: 'all' as 'all' | 'students' | 'teachers' | 'management',
    featured: false,
    imageUrl: '',
    tags: ''
  });

  const categories = ['Academic', 'Faculty', 'Student Life', 'Research', 'Events', 'Administration'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const newPost: NewsPost = {
      id: Date.now().toString(),
      title: formData.title,
      titleAmharic: formData.titleAmharic,
      content: formData.content,
      contentAmharic: formData.contentAmharic,
      excerpt: formData.content.substring(0, 150) + '...',
      author: 'Admin User',
      category: formData.category,
      visibility: formData.visibility,
      featured: formData.featured,
      published: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrl: formData.imageUrl,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };

    if (isEditing && selectedPost) {
      setPosts(prev => prev.map(post => 
        post.id === selectedPost.id 
          ? { ...newPost, id: selectedPost.id, createdAt: selectedPost.createdAt }
          : post
      ));
    } else {
      setPosts(prev => [newPost, ...prev]);
    }

    // Reset form
    setFormData({
      title: '',
      titleAmharic: '',
      content: '',
      contentAmharic: '',
      category: '',
      visibility: 'all',
      featured: false,
      imageUrl: '',
      tags: ''
    });
    setIsEditing(false);
    setSelectedPost(null);
    setActiveTab('view');
    alert('News post saved successfully!');
  };

  const handleEdit = (post: NewsPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      titleAmharic: post.titleAmharic || '',
      content: post.content,
      contentAmharic: post.contentAmharic || '',
      category: post.category,
      visibility: post.visibility,
      featured: post.featured,
      imageUrl: post.imageUrl || '',
      tags: post.tags.join(', ')
    });
    setIsEditing(true);
    setActiveTab('create');
  };

  const handleDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      alert('Post deleted successfully!');
    }
  };

  const renderNewsList = () => (
    <div style={{ display: 'grid', gap: '20px' }}>
      {posts.map(post => (
        <div
          key={post.id}
          style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ color: '#7a0a2d', margin: 0 }}>{post.title}</h3>
                {post.featured && (
                  <span style={{
                    background: '#fbbf24',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    ⭐ Featured
                  </span>
                )}
                <span style={{
                  background: post.published ? '#dcfce7' : '#fef3c7',
                  color: post.published ? '#15803d' : '#92400e',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {post.published ? '✅ Published' : '📝 Draft'}
                </span>
              </div>
              
              {post.titleAmharic && (
                <h4 style={{ color: '#6b7280', margin: '0 0 8px', fontSize: '16px' }}>{post.titleAmharic}</h4>
              )}
              
              <p style={{ color: '#6b7280', margin: '0 0 12px', fontSize: '14px' }}>{post.excerpt}</p>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                <span>📝 {post.author}</span>
                <span>📂 {post.category}</span>
                <span>👥 {post.visibility}</span>
                <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div style={{ marginTop: '8px' }}>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#e0e7ff',
                      color: '#3730a3',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      marginRight: '4px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleEdit(post)}
                style={{
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCreateForm = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '24px' }}>
        {isEditing ? '✏️ Edit News Post' : '📝 Create News Post'}
      </h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Title */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Title (English) *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="Enter news title in English"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Title (Amharic)
            </label>
            <input
              type="text"
              value={formData.titleAmharic}
              onChange={(e) => handleInputChange('titleAmharic', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="በአማርኛ ርዕስ ያስገቡ"
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Content (English) *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '120px'
              }}
              placeholder="Enter detailed news content in English"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Content (Amharic)
            </label>
            <textarea
              value={formData.contentAmharic}
              onChange={(e) => handleInputChange('contentAmharic', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                minHeight: '120px'
              }}
              placeholder="በአማርኛ ዝርዝር ይዘት ያስገቡ"
            />
          </div>
        </div>

        {/* Category and Visibility */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Visibility *
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => handleInputChange('visibility', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="all">All Users</option>
              <option value="students">Students Only</option>
              <option value="teachers">Teachers Only</option>
              <option value="management">Management Only</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Options
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
              />
              <span>⭐ Featured Post</span>
            </label>
          </div>
        </div>

        {/* Image URL and Tags */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              placeholder="academic, students, registration"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setActiveTab('view');
              setIsEditing(false);
              setSelectedPost(null);
            }}
            style={{
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#7a0a2d',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isEditing ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <SharedLayout title="News & Announcements" userRole="admin">
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
            { id: 'view', label: 'All Posts', icon: '📰' },
            { id: 'create', label: 'Create Post', icon: '✏️' },
            { id: 'analytics', label: 'Analytics', icon: '📊' }
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
        {activeTab === 'view' && renderNewsList()}
        {activeTab === 'create' && renderCreateForm()}
        {activeTab === 'analytics' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <h3>📊 News Analytics</h3>
            <p>Analytics dashboard for news engagement and reach coming soon...</p>
          </div>
        )}
      </div>
    </SharedLayout>
  );
};

export default NewsManagement;