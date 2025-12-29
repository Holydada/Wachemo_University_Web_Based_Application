import React, { useState } from 'react';
import SharedLayout from '../components/Layout/SharedLayout';

const CafeteriaManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('menu');
  const [serviceType, setServiceType] = useState<'government' | 'cash' | null>(null);
  const [showCostSharingForm, setShowCostSharingForm] = useState(false);

  // Weekly menu data
  const weeklyMenu = {
    Monday: {
      breakfast: 'Bread, Tea, Egg',
      lunch: 'Injera, Doro Wot, Salad',
      dinner: 'Rice, Vegetable Stew, Fruit'
    },
    Tuesday: {
      breakfast: 'Porridge, Coffee, Banana',
      lunch: 'Pasta, Meat Sauce, Bread',
      dinner: 'Injera, Shiro, Vegetables'
    },
    Wednesday: {
      breakfast: 'Bread, Milk, Honey',
      lunch: 'Rice, Fish Curry, Salad',
      dinner: 'Injera, Kitfo, Ayib'
    },
    Thursday: {
      breakfast: 'Pancakes, Tea, Fruit',
      lunch: 'Injera, Beef Stew, Vegetables',
      dinner: 'Pasta, Tomato Sauce, Cheese'
    },
    Friday: {
      breakfast: 'Bread, Coffee, Egg',
      lunch: 'Rice, Chicken Curry, Salad',
      dinner: 'Injera, Vegetable Wot, Salad'
    },
    Saturday: {
      breakfast: 'Porridge, Milk, Fruit',
      lunch: 'Injera, Fish Wot, Vegetables',
      dinner: 'Rice, Lentil Stew, Bread'
    },
    Sunday: {
      breakfast: 'Bread, Tea, Cheese',
      lunch: 'Special Ethiopian Platter',
      dinner: 'Pasta, Meat Balls, Salad'
    }
  };

  const renderMenuTab = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ color: '#7a0a2d', marginBottom: '20px', fontSize: '20px' }}>Weekly Menu</h2>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {Object.entries(weeklyMenu).map(([day, meals]) => (
            <div key={day} style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                background: '#7a0a2d', 
                color: '#fff', 
                padding: '12px 16px', 
                fontWeight: '600' 
              }}>
                {day}
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px' }}>🌅 Breakfast</h4>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{meals.breakfast}</p>
                  </div>
                  <div>
                    <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px' }}>🍽️ Lunch</h4>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{meals.lunch}</p>
                  </div>
                  <div>
                    <h4 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px' }}>🌙 Dinner</h4>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>{meals.dinner}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServiceRegistration = () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ color: '#7a0a2d', marginBottom: '20px', fontSize: '20px' }}>Cafeteria Service Registration</h2>
        
        {!serviceType ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div 
              onClick={() => setServiceType('government')}
              style={{ 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '24px', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7a0a2d';
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = '#fff';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
              <h3 style={{ color: '#7a0a2d', marginBottom: '12px' }}>Government Cafeteria Service</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                Free meals provided by the federal government. Requires meal card for daily access. 
                Part of the cost-sharing agreement system.
              </p>
              <div style={{ 
                background: '#dcfce7', 
                color: '#15803d', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: '600',
                marginTop: '12px'
              }}>
                FREE SERVICE
              </div>
            </div>

            <div 
              onClick={() => setServiceType('cash')}
              style={{ 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '24px', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7a0a2d';
                e.currentTarget.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = '#fff';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ color: '#7a0a2d', marginBottom: '12px' }}>Cash Payment Option</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
                Opt out of government cafeteria service and receive 3,000 ETB monthly payment 
                directly to your bank account.
              </p>
              <div style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: '600',
                marginTop: '12px'
              }}>
                3,000 ETB/MONTH
              </div>
            </div>
          </div>
        ) : (
          <div>
            {serviceType === 'government' ? (
              <div style={{ background: '#dcfce7', padding: '24px', borderRadius: '12px', border: '1px solid #16a34a' }}>
                <h3 style={{ color: '#15803d', marginBottom: '16px' }}>Government Cafeteria Service Registration</h3>
                
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#15803d' }}>
                      Student ID *
                    </label>
                    <input
                      type="text"
                      placeholder="WCU/2024/001234"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #16a34a',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#15803d' }}>
                      Upload Student Photo *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #16a34a',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#15803d', marginBottom: '8px' }}>Service Benefits:</h4>
                    <ul style={{ color: '#15803d', fontSize: '14px', paddingLeft: '20px' }}>
                      <li>Free breakfast, lunch, and dinner</li>
                      <li>7 days a week service</li>
                      <li>Nutritious and balanced meals</li>
                      <li>Part of government cost-sharing program</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowCostSharingForm(true)}
                    style={{
                      background: '#16a34a',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Register for Government Service
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: '#fef3c7', padding: '24px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
                <h3 style={{ color: '#92400e', marginBottom: '16px' }}>Cash Payment Option Registration</h3>
                
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
                      Student ID *
                    </label>
                    <input
                      type="text"
                      placeholder="WCU/2024/001234"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
                      Bank Account Number *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your bank account number"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
                      Bank Name *
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      <option value="">Select Bank</option>
                      <option value="cbe">Commercial Bank of Ethiopia</option>
                      <option value="dashen">Dashen Bank</option>
                      <option value="awash">Awash Bank</option>
                      <option value="boa">Bank of Abyssinia</option>
                      <option value="nib">Nib International Bank</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#92400e' }}>
                      Upload National ID *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#92400e', marginBottom: '8px' }}>Payment Details:</h4>
                    <ul style={{ color: '#92400e', fontSize: '14px', paddingLeft: '20px' }}>
                      <li>Monthly payment: 3,000 ETB</li>
                      <li>Direct bank transfer</li>
                      <li>Payment on the 1st of each month</li>
                      <li>No cafeteria meal card access</li>
                    </ul>
                  </div>

                  <button
                    style={{
                      background: '#f59e0b',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Register for Cash Payment
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setServiceType(null)}
              style={{
                background: '#6b7280',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              ← Back to Options
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderMealCard = () => (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ color: '#7a0a2d', marginBottom: '20px', fontSize: '20px' }}>Digital Meal Card</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #7a0a2d, #a21caf)',
        borderRadius: '12px',
        padding: '24px',
        color: '#fff',
        maxWidth: '400px',
        margin: '0 auto 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <img src="/logo2.png" alt="WCU Logo" style={{ height: '40px' }} />
          <div style={{ fontSize: '12px', opacity: 0.9 }}>MEAL CARD</div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>John Doe</div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>WCU/2024/001234</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
          <div>
            <div style={{ opacity: 0.7 }}>College</div>
            <div>Engineering</div>
          </div>
          <div>
            <div style={{ opacity: 0.7 }}>Department</div>
            <div>Computer Eng.</div>
          </div>
          <div>
            <div style={{ opacity: 0.7 }}>Year</div>
            <div>2nd Year</div>
          </div>
          <div>
            <div style={{ opacity: 0.7 }}>Status</div>
            <div>Active</div>
          </div>
        </div>
      </div>

      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '16px' }}>Today's Meal Status</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803d' }}>Breakfast</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>7:30 AM</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#f59e0b' }}>Lunch</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>12:00 PM</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⭕</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>Dinner</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>6:00 PM</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SharedLayout title="Cafeteria Management" userRole="student">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
            { id: 'menu', label: 'Weekly Menu', icon: '📋' },
            { id: 'registration', label: 'Service Registration', icon: '📝' },
            { id: 'card', label: 'Meal Card', icon: '🆔' }
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
        {activeTab === 'menu' && renderMenuTab()}
        {activeTab === 'registration' && renderServiceRegistration()}
        {activeTab === 'card' && renderMealCard()}

        {/* Cost Sharing Form Modal */}
        {showCostSharingForm && (
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
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ color: '#7a0a2d', marginBottom: '16px' }}>Cost Sharing Agreement Required</h3>
              <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
                To register for government cafeteria service, you must complete the annual cost sharing agreement form.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowCostSharingForm(false);
                    // Navigate to cost sharing form
                  }}
                  style={{
                    background: '#7a0a2d',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Complete Cost Sharing Form
                </button>
                <button
                  onClick={() => setShowCostSharingForm(false)}
                  style={{
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
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

export default CafeteriaManagement;