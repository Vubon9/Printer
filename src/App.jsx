import { useState, useEffect, useMemo } from "react";
import { Plus, Search, X, Printer, Trash2, Phone, Calendar, Wallet, CircleCheck, CircleAlert } from "lucide-react";

const fmt = (n) => "৳" + Number(n || 0).toLocaleString("en-IN");
const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Local persistence (browser-only, per-device). Swap this for a real backend
// (e.g. Firebase, Supabase) if you need data to sync across devices.
const storage = {
  get: (key) => {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

export default function App() {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | due | paid
  const [showAdd, setShowAdd] = useState(false);
  const [payTarget, setPayTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const saved = storage.get("orders");
    if (saved) setOrders(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    storage.set("orders", orders);
  }, [orders, loaded]);

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.total, 0);
    const collected = orders.reduce((s, o) => s + o.paid, 0);
    const due = total - collected;
    return { count: orders.length, total, collected, due };
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter === "due") list = list.filter((o) => o.total - o.paid > 0);
    if (filter === "paid") list = list.filter((o) => o.total - o.paid <= 0);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.customer.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.item.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [orders, filter, query]);

  const addOrder = (order) => {
    setOrders((prev) => [...prev, { ...order, id: uid(), payments: order.paid > 0 ? [{ amount: order.paid, date: order.date }] : [] }]);
    setShowAdd(false);
  };

  const addPayment = (id, amount) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              paid: Math.min(o.total, o.paid + amount),
              payments: [...(o.payments || []), { amount, date: todayStr() }],
            }
          : o
      )
    );
    setPayTarget(null);
  };

  const deleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div style={{ background: "#F3EEE3", minHeight: "100%", color: "#20263B" }} className="w-full min-h-screen">
      <style>{`
        .ledger-font { font-family: Georgia, 'Times New Roman', serif; }
        .mono { font-family: 'Courier New', ui-monospace, monospace; }
        .stamp {
          transform: rotate(-6deg);
          border: 2.5px solid currentColor;
          border-radius: 4px;
          box-shadow: 0 0 0 2px currentColor inset;
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div style={{ background: "#20263B" }} className="w-9 h-9 rounded flex items-center justify-center">
                <Printer size={18} color="#F3EEE3" />
              </div>
              <h1 className="ledger-font text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#20263B" }}>
                Press Ledger
              </h1>
            </div>
            <p className="text-sm mt-1" style={{ color: "#6B6350" }}>
              Orders &amp; payment tracker · BDT
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{ background: "#20263B" }}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-lg text-white hover:opacity-90 transition"
          >
            <Plus size={16} /> New order
          </button>
        </div>

        <div className="grid grid-cols-3 gap-px mb-6 rounded-lg overflow-hidden" style={{ background: "#C9BFA8" }}>
          <StatCell label="Orders" value={stats.count} />
          <StatCell label="Collected" value={fmt(stats.collected)} color="#2F6844" />
          <StatCell label="Due" value={fmt(stats.due)} color="#B33A3A" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8A8168" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer, phone, or job..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: "#FBF8F1", border: "1px solid #D9D0BB" }}
            />
          </div>
          <div className="flex gap-1.5">
            {[
              ["all", "All"],
              ["due", "Due"],
              ["paid", "Paid"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition"
                style={
                  filter === key
                    ? { background: "#20263B", color: "#F3EEE3" }
                    : { background: "#FBF8F1", color: "#6B6350", border: "1px solid #D9D0BB" }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loaded && filtered.length === 0 && (
          <div className="text-center py-16 rounded-lg" style={{ background: "#FBF8F1", border: "1px dashed #D9D0BB" }}>
            <Printer size={28} className="mx-auto mb-3" style={{ color: "#C9BFA8" }} />
            <p className="text-sm" style={{ color: "#8A8168" }}>
              {orders.length === 0 ? "No orders yet — add your first one." : "No orders match this search."}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map((o) => {
            const due = o.total - o.paid;
            const isPaid = due <= 0;
            return (
              <div key={o.id} className="flex rounded-lg overflow-hidden" style={{ background: "#FBF8F1", border: "1px solid #D9D0BB" }}>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "#20263B" }}>
                        {o.customer}
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-1" style={{ color: "#8A8168" }}>
                        <span className="flex items-center gap-1">
                          <Phone size={11} /> {o.phone || "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {o.date}
                        </span>
                      </div>
                      <div className="text-sm mt-2" style={{ color: "#3B3826" }}>
                        {o.item} {o.qty ? <span className="mono text-xs" style={{ color: "#8A8168" }}>× {o.qty}</span> : null}
                      </div>
                    </div>
                    <div className="stamp text-xs font-bold px-2 py-0.5 shrink-0 uppercase tracking-wide" style={{ color: isPaid ? "#2F6844" : "#B33A3A" }}>
                      {isPaid ? "Paid" : "Due"}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3 pt-3" style={{ borderTop: "1px dashed #D9D0BB" }}>
                    <div className="mono text-xs" style={{ color: "#6B6350" }}>
                      <div>
                        Total <span className="font-semibold" style={{ color: "#20263B" }}>{fmt(o.total)}</span>
                      </div>
                      <div>
                        Paid <span className="font-semibold" style={{ color: "#2F6844" }}>{fmt(o.paid)}</span>
                        {due > 0 && (
                          <>
                            {" "}
                            · Due <span className="font-semibold" style={{ color: "#B33A3A" }}>{fmt(due)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {due > 0 && (
                        <button
                          onClick={() => setPayTarget(o)}
                          className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md text-white"
                          style={{ background: "#2F6844" }}
                        >
                          <Wallet size={12} /> Add payment
                        </button>
                      )}
                      <button onClick={() => setConfirmDelete(o)} className="p-1.5 rounded-md" style={{ color: "#B33A3A" }} aria-label="Delete order">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAdd && <AddOrderModal onClose={() => setShowAdd(false)} onSave={addOrder} />}
      {payTarget && <PaymentModal order={payTarget} onClose={() => setPayTarget(null)} onSave={addPayment} />}
      {confirmDelete && (
        <ConfirmModal text={`Delete the order for ${confirmDelete.customer}? This can't be undone.`} onCancel={() => setConfirmDelete(null)} onConfirm={() => deleteOrder(confirmDelete.id)} />
      )}
    </div>
  );
}

function StatCell({ label, value, color = "#20263B" }) {
  return (
    <div className="p-4" style={{ background: "#FBF8F1" }}>
      <div className="text-[11px] uppercase tracking-wide mb-1" style={{ color: "#8A8168" }}>
        {label}
      </div>
      <div className="mono text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(32,38,59,0.45)" }}>
      <div className="w-full sm:max-w-sm rounded-t-2xl sm:rounded-xl overflow-hidden" style={{ background: "#FBF8F1" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #D9D0BB" }}>
          <h2 className="ledger-font font-bold text-lg" style={{ color: "#20263B" }}>
            {title}
          </h2>
          <button onClick={onClose} style={{ color: "#8A8168" }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium mb-1" style={{ color: "#6B6350" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: "1px solid #D9D0BB",
  background: "#FFFFFF",
  fontSize: 14,
  outline: "none",
  color: "#20263B",
};

function AddOrderModal({ onClose, onSave }) {
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [date, setDate] = useState(todayStr());
  const [error, setError] = useState("");

  const submit = () => {
    if (!customer.trim()) return setError("Customer name is required.");
    if (!item.trim()) return setError("Job description is required.");
    const t = Number(total);
    if (!t || t <= 0) return setError("Enter a valid total amount.");
    const p = Number(paid) || 0;
    if (p > t) return setError("Advance paid can't exceed the total.");
    onSave({ customer: customer.trim(), phone: phone.trim(), item: item.trim(), qty: qty.trim(), total: t, paid: p, date });
  };

  return (
    <ModalShell title="New order" onClose={onClose}>
      <Field label="Customer name">
        <input style={inputStyle} value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Rahim Uddin" />
      </Field>
      <Field label="Phone (optional)">
        <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
      </Field>
      <Field label="Job description">
        <input style={inputStyle} value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. Business cards, 1000 pcs" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Quantity (optional)">
          <input style={inputStyle} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 1000" />
        </Field>
        <Field label="Order date">
          <input type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Total amount (৳)">
          <input type="number" style={inputStyle} value={total} onChange={(e) => setTotal(e.target.value)} placeholder="0" />
        </Field>
        <Field label="Advance paid (৳)">
          <input type="number" style={inputStyle} value={paid} onChange={(e) => setPaid(e.target.value)} placeholder="0" />
        </Field>
      </div>
      {error && (
        <div className="text-xs mb-3 flex items-center gap-1" style={{ color: "#B33A3A" }}>
          <CircleAlert size={12} /> {error}
        </div>
      )}
      <button onClick={submit} className="w-full py-2.5 rounded-lg text-sm font-medium text-white mt-1" style={{ background: "#20263B" }}>
        Save order
      </button>
    </ModalShell>
  );
}

function PaymentModal({ order, onClose, onSave }) {
  const due = order.total - order.paid;
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const a = Number(amount);
    if (!a || a <= 0) return setError("Enter a valid amount.");
    if (a > due) return setError(`Amount can't exceed the due of ${fmt(due)}.`);
    onSave(order.id, a);
  };

  return (
    <ModalShell title="Add payment" onClose={onClose}>
      <div className="mb-4 p-3 rounded-lg mono text-sm" style={{ background: "#F3EEE3" }}>
        <div className="font-semibold ledger-font text-base mb-1" style={{ color: "#20263B" }}>
          {order.customer}
        </div>
        <div style={{ color: "#6B6350" }}>Total {fmt(order.total)} · Paid {fmt(order.paid)}</div>
        <div className="font-semibold" style={{ color: "#B33A3A" }}>Due {fmt(due)}</div>
      </div>
      <Field label="Payment amount (৳)">
        <input type="number" autoFocus style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Up to ${due}`} />
      </Field>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setAmount(String(due))} className="text-xs font-medium px-3 py-1.5 rounded-md" style={{ background: "#F3EEE3", color: "#20263B" }}>
          Pay full due
        </button>
      </div>
      {error && (
        <div className="text-xs mb-3 flex items-center gap-1" style={{ color: "#B33A3A" }}>
          <CircleAlert size={12} /> {error}
        </div>
      )}
      <button onClick={submit} className="w-full py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: "#2F6844" }}>
        <span className="inline-flex items-center gap-1.5 justify-center w-full">
          <CircleCheck size={15} /> Record payment
        </span>
      </button>
    </ModalShell>
  );
}

function ConfirmModal({ text, onCancel, onConfirm }) {
  return (
    <ModalShell title="Confirm delete" onClose={onCancel}>
      <p className="text-sm mb-4" style={{ color: "#3B3826" }}>
        {text}
      </p>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ background: "#F3EEE3", color: "#20263B" }}>
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white" style={{ background: "#B33A3A" }}>
          Delete
        </button>
      </div>
    </ModalShell>
  );
}
