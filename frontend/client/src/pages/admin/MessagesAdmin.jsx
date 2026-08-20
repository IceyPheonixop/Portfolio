import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import Loader from '../../components/Loader';
import { Trash2, Mail, MailOpen, Calendar, User, MessageSquare, Reply } from 'lucide-react';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api('/messages')
      .then((d) => {
        setMessages(d?.messages || []);
      })
      .catch((e) => setError(e.message || 'Failed to load messages'));
  };

  useEffect(() => {
    load();
  }, []);

  const del = async () => {
    try {
      await api(`/messages/${confirm._id}`, { method: 'DELETE' });
      if (selectedMessage?._id === confirm._id) {
        setSelectedMessage(null);
      }
      setConfirm(null);
      load();
    } catch (e) {
      setError(e.message || 'Failed to delete message');
    }
  };

  return (
    <>
      <p className="text-sm font-semibold tracking-wider text-lime">INBOX</p>
      <h1 className="text-3xl font-bold text-white">Contact Inquiries</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Review and respond to client inquiries received through your portfolio contact form.
      </p>

      {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      {messages === null ? (
        <Loader text="Loading inbox…" />
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          
          {/* Message List */}
          <div className="space-y-3">
            {messages.length ? (
              messages.map((m) => {
                const isSelected = selectedMessage?._id === m._id;
                const formattedDate = new Date(m.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={m._id}
                    onClick={() => setSelectedMessage(m)}
                    className={`panel cursor-pointer transition-all ${
                      isSelected
                        ? 'border-lime/50 bg-lime/[0.04]'
                        : 'hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-lime">
                          {isSelected ? <MailOpen size={16} /> : <Mail size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{m.name}</p>
                          <p className="text-xs text-zinc-400">{m.email}</p>
                        </div>
                      </div>

                      <span className="text-[11px] text-zinc-500">{formattedDate}</span>
                    </div>

                    <p className="mt-3 text-xs font-medium text-zinc-300">
                      {m.subject || 'No Subject'}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
                      {m.message}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="panel text-center text-zinc-500">Your inbox is empty.</div>
            )}
          </div>

          {/* Message Viewer & Actions */}
          <div>
            {selectedMessage ? (
              <div className="panel sticky top-6 space-y-6">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedMessage.subject || 'No Subject'}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-lime" /> {selectedMessage.name}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-lime" /> {selectedMessage.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-zinc-500" />
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setConfirm(selectedMessage)}
                    className="btn bg-red-500/15 p-2 text-red-400 hover:bg-red-500/25"
                    title="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Message Content</p>
                  <div className="mt-3 whitespace-pre-line rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || 'Your Inquiry'
                    )}`}
                    className="btn-primary inline-flex items-center gap-2 text-sm"
                  >
                    <Reply size={16} /> Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="panel hidden h-64 flex-col items-center justify-center text-center text-zinc-500 lg:flex">
                <MessageSquare size={32} className="mb-2 opacity-40" />
                Select a message from the list to preview details.
              </div>
            )}
          </div>

        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete this message?"
        onCancel={() => setConfirm(null)}
        onConfirm={del}
      >
        Are you sure you want to delete the message from <strong>{confirm?.name}</strong>? This cannot be undone.
      </ConfirmDialog>
    </>
  );
}