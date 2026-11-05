import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileText,
  ToggleLeft,
  ToggleRight,
  ShieldAlert
} from 'lucide-react';
import { AuditLogItem } from '../../types';

interface PrivacyCenterModuleProps {
  emergencyStop: boolean;
  onToggleEmergencyStop: () => void;
}

export const PrivacyCenterModule: React.FC<PrivacyCenterModuleProps> = ({
  emergencyStop,
  onToggleEmergencyStop,
}) => {
  const [permissions, setPermissions] = useState({
    mic: true,
    camera: true,
    location: true,
    contacts: false,
    notifications: true,
    screenShare: true,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'log_01',
      action: 'Instagram Comment Analysis',
      details: 'Analyzed comment from @sarah_dev. Classified as FAQ. Suggested reply held in draft.',
      timestamp: '10:42 AM',
      category: 'social',
      status: 'success',
    },
    {
      id: 'log_02',
      action: 'Location Query Request',
      details: 'GPS coordinates retrieved via Android FusedLocationProviderClient.',
      timestamp: '10:15 AM',
      category: 'location',
      status: 'success',
    },
    {
      id: 'log_03',
      action: 'Social Spam Suppressed',
      details: 'Blocked spam comment containing phishing URL. Auto-reply aborted.',
      timestamp: '09:30 AM',
      category: 'security',
      status: 'warn',
    },
  ]);

  const [dbWiped, setDbWiped] = useState(false);

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const wipeLocalRoomDatabase = () => {
    if (confirm("Are you sure you want to permanently delete all local Room database tables, conversations, and social logs?")) {
      setAuditLogs([]);
      setDbWiped(true);
      setTimeout(() => setDbWiped(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Privacy Guarantee Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white">
              Pinky AI Zero-Surveillance Privacy Engine
            </h2>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Strict Android least-privilege security model. No hidden tracking, no unauthorized background audio or screen capture, and all credentials are encrypted locally using AndroidX Security Crypto.
            </p>
          </div>
        </div>

        {/* Master Emergency Kill-Switch */}
        <div className="mt-6 p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-red-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Master Emergency Kill-Switch</span>
            </div>
            <p className="text-xs text-red-200/70 mt-0.5">
              Instantly terminates all background services, auto-replies, and network sync jobs.
            </p>
          </div>
          <button
            onClick={onToggleEmergencyStop}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              emergencyStop
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-red-950/40 text-red-200 border border-red-500/40 hover:bg-red-900/60'
            }`}
          >
            {emergencyStop ? 'SYSTEM HALTED (Resume)' : 'TRIGGER EMERGENCY HALT'}
          </button>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-sm font-display font-semibold text-white mb-4">
          Android Runtime Permission Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PermissionCard
            name="Microphone (Record Audio)"
            manifestTag="android.permission.RECORD_AUDIO"
            granted={permissions.mic}
            onToggle={() => togglePermission('mic')}
          />
          <PermissionCard
            name="Camera (Assignment OCR)"
            manifestTag="android.permission.CAMERA"
            granted={permissions.camera}
            onToggle={() => togglePermission('camera')}
          />
          <PermissionCard
            name="Location (GPS)"
            manifestTag="android.permission.ACCESS_FINE_LOCATION"
            granted={permissions.location}
            onToggle={() => togglePermission('location')}
          />
          <PermissionCard
            name="Contacts (Address Book)"
            manifestTag="android.permission.READ_CONTACTS"
            granted={permissions.contacts}
            onToggle={() => togglePermission('contacts')}
          />
          <PermissionCard
            name="Notification Listener"
            manifestTag="BIND_NOTIFICATION_LISTENER_SERVICE"
            granted={permissions.notifications}
            onToggle={() => togglePermission('notifications')}
          />
          <PermissionCard
            name="Screen Projection Service"
            manifestTag="FOREGROUND_SERVICE_MEDIA_PROJECTION"
            granted={permissions.screenShare}
            onToggle={() => togglePermission('screenShare')}
          />
        </div>
      </div>

      {/* Cryptographic Security & Audit Logs */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-display font-semibold text-white">
              Immutable Security Audit Trail
            </h3>
            <p className="text-xs text-purple-200/60">
              Local Room SQLite audit events recorded on-device.
            </p>
          </div>
          <button
            onClick={wipeLocalRoomDatabase}
            className="px-3.5 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 hover:bg-red-900/40 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Local Room Database</span>
          </button>
        </div>

        {dbWiped && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
            Local Room database wiped cleanly. All caches and audit logs purged.
          </div>
        )}

        <div className="space-y-2">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/10 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-semibold text-purple-100">{log.action}</div>
                  <div className="text-purple-300/70 text-[11px] mt-0.5">{log.details}</div>
                </div>
                <div className="text-right font-mono text-[11px] text-purple-300/50 shrink-0">
                  {log.timestamp}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-purple-300/40 italic">
              No audit records present.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PermissionCardProps {
  name: string;
  manifestTag: string;
  granted: boolean;
  onToggle: () => void;
}

const PermissionCard: React.FC<PermissionCardProps> = ({ name, manifestTag, granted, onToggle }) => {
  return (
    <div className="p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/15 flex items-center justify-between">
      <div>
        <div className="text-xs font-semibold text-white">{name}</div>
        <div className="text-[10px] font-mono text-purple-300/50">{manifestTag}</div>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
          granted
            ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
        }`}
      >
        {granted ? 'GRANTED' : 'DENIED'}
      </button>
    </div>
  );
};
