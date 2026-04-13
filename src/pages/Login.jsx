import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const roles = [
  { id: 'student', title: 'Student', desc: 'Track mood & habits' },
  { id: 'counsellor', title: 'Counsellor', desc: 'Support students' },
  { id: 'ambassador', title: 'Ambassador', desc: 'Peer support' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole);
    navigate(`/${selectedRole}`);
  };

  const currentRole = roles.find((r) => r.id === selectedRole);

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8f7f5' }}
    >

      {/* LEFT PANEL */}

      <div
        className="hidden lg:flex flex-col justify-between p-16 flex-[0.8]"
        style={{
          background: '#0f1117',
          position: 'relative',
          overflow: 'hidden',
        }}
      >

        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(45,91,227,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(74,124,111,0.12) 0%, transparent 50%)',
          }}
        />

        {/* BRAND */}

        <div className="flex items-center gap-3 relative z-10">
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 22,
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            MindCare
          </span>
        </div>

        {/* HERO TEXT */}

        <div className="relative z-10">

          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(42px,4vw,56px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            Your mind <br />
            <span
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontStyle: 'italic',
              }}
            >
              deserves
            </span>
            <br />
            attention.
          </h1>

          <p
            style={{
              fontSize: 17,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              maxWidth: 380,
            }}
          >
            A safe space to track your wellbeing, connect with counsellors,
            and build habits that last beyond the classroom.
          </p>
        </div>

        {/* STATS */}

        <div className="flex gap-10 relative z-10">
          {[
            ['12k+', 'Students supported'],
            ['94%', 'Report improvement'],
            ['240', 'Schools enrolled'],
          ].map(([num, label], i) => (
            <div key={i} className="flex flex-col gap-1">
              <span
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 34,
                  color: '#fff',
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex flex-[1.2] items-center justify-center p-10 lg:p-16">

        <div
          style={{
            width: '100%',
            maxWidth: 520,
            background: '#fdfcfa',
            border: '1px solid #e8e4df',
            borderRadius: 20,
            padding: '56px 48px',
            boxShadow:
              '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 28,
                color: '#0f1117',
                marginBottom: 8,
              }}
            >
              Welcome back
            </h2>

            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Select your role and sign in to continue.
            </p>
          </div>

          {/* ROLE SELECTOR */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 10,
              marginBottom: 28,
            }}
          >
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                style={{
                  border:
                    selectedRole === role.id
                      ? '2px solid #0f1117'
                      : '1px solid #e8e4df',
                  borderRadius: 12,
                  padding: 14,
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                  }}
                >
                  {role.title}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                  }}
                >
                  {role.desc}
                </div>
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}

          <form onSubmit={handleLogin}>

            <div style={{ marginBottom: 16 }}>
              <label>Email</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
                style={{
                  width: '100%',
                  height: 48,
                  border: '1px solid #e8e4df',
                  borderRadius: 10,
                  padding: '0 14px',
                  marginTop: 6,
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label>Password</label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  height: 48,
                  border: '1px solid #e8e4df',
                  borderRadius: 10,
                  padding: '0 14px',
                  marginTop: 6,
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                height: 50,
                background: '#0f1117',
                color: '#fff',
                borderRadius: 10,
                border: 'none',
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Sign in as {currentRole.title}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;