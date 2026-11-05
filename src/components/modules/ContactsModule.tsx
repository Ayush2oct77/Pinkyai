import React, { useState } from 'react';
import { ContactItem } from '../../types';
import { UserCheck, Search, Shield, Plus, Phone, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export const ContactsModule: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([
    {
      id: 'c1',
      name: 'Sarah Connor',
      phone: '+1 (555) 019-2834',
      relation: 'VIP',
      status: 'allowed',
      customTone: 'friendly',
      autoReplyEnabled: true,
    },
    {
      id: 'c2',
      name: 'Dr. Robert Oppenheimer',
      phone: '+1 (555) 234-9812',
      relation: 'Work',
      status: 'allowed',
      customTone: 'professional',
      autoReplyEnabled: false,
    },
    {
      id: 'c3',
      name: 'Spam Telemarketer 88',
      phone: '+1 (800) 555-0199',
      relation: 'General',
      status: 'blocked',
      customTone: 'silent',
      autoReplyEnabled: false,
    },
  ]);

  const [search, setSearch] = useState('');

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const toggleStatus = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === 'allowed' ? 'restricted' : c.status === 'restricted' ? 'blocked' : 'allowed';
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/15 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Personal Contact Intelligence
              </h2>
              <p className="text-xs text-purple-200/60">
                Permission-Guarded Address Book · Per-Contact Tone Personas
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
            Permission: READ_CONTACTS Granted
          </div>
        </div>

        {/* Search & Actions */}
        <div className="my-5 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contact name or phone..."
              className="w-full bg-purple-950/30 border border-purple-500/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-pink-500/50"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="space-y-3">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{contact.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-pink-300">
                    {contact.relation}
                  </span>
                </div>
                <div className="text-xs font-mono text-purple-300/70 mt-0.5">
                  {contact.phone} · Tone Persona: <span className="text-pink-400 font-semibold">{contact.customTone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(contact.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                    contact.status === 'allowed'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                      : contact.status === 'restricted'
                      ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                      : 'bg-red-950/50 text-red-300 border border-red-500/30'
                  }`}
                >
                  {contact.status.toUpperCase()}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
